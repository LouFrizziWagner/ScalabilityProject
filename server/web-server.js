import express from 'express';
import bodyParser from 'body-parser';
import { init } from './database/db-connections.js';
import router from './routes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import jitterMiddleware from './middleware/jitter.js';

const app = express();
const port = 3000;

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

// API routes
app.use('/api', router);

// Starting server after initializing database connection
init().then(() => {
  app.listen(3000, '0.0.0.0', () => {
    console.log('Server is running now on the port 3000');
});
})


