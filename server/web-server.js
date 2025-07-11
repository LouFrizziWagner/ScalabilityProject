import express from 'express';
import bodyParser from 'body-parser';
import { init } from './database/db-connections.js';
import router from './routes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import jitterMiddleware from './middleware/jitter.js';
import idempotencyMiddleware from './middleware/idempotency.js';
import redis from 'redis';

const app = express();
const port = 3000;
const client = redis.createClient({
  url: 'redis://redis:6379'
})

async function start() {
  await client.connect();
}

start();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(bodyParser.json());

// Add jitter to all routes
app.use(jitterMiddleware(100, 500));

// Serve static view for testing
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.use('/api/sensor-data',idempotencyMiddleware(client));

// API routes
app.use('/api', router);

// Starting server after initializing database connection
init().then(() => {
  app.listen(3000, '0.0.0.0', () => {
    console.log('Server is running now on the port 3000');
});
})


