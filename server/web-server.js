import express from 'express';
import bodyParser from 'body-parser';
import { init } from './database/db-connections.js';
import router from './routes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import jitterMiddleware from './middleware/jitter.js';
import idempotencyMiddleware from './middleware/idempotency.js';
import redis from 'redis';
import cacheMiddleware from './middleware/cache.js';
import readCacheMiddleware from './middleware/readCache.js';

const app = express();
const port = 3000;

const client = redis.createClient({
  url: 'redis://redis:6379'
})

async function start() {
  await client.connect();
}

await start();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(bodyParser.json());

// Server side Queue
app.use(queueMiddleware);

// Jitter (variation in the time delay)
app.use(jitterMiddleware(0, 100));

app.use('/api/sensor-data',idempotencyMiddleware(client));

// Serve static view for testing
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Idempotent API
app.use('/api/sensor-data',idempotencyMiddleware(client));

// Caching
app.use('/api/sensor-data', cacheMiddleware(client));
app.use('/api/max-temperature', readCacheMiddleware(client, "maxTemperature"));

// API routes
app.use('/api', router);

// Starting server after initializing database connection
init().then(() => {
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}).catch((err) => {
  console.error('Failed to initialize the DBMS:', err);
});


