import express from 'express';
import bodyParser from 'body-parser';
import { init } from './database/db-connections.js';
import router from './routes.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(bodyParser.json());

// Serve static view for testing
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// API routes
app.use('/api', router);

// Starting server after initializing dtabase connection
init().then(() => {
  app.listen(port, () => {
    console.log(`Sensor app running on port ${port}`);
  });
})

// db.init().then(() => {
//   app.listen(port, () => {
//     console.log(`Sensor app running on port ${port}`);
//   });
  // app.listen(3000, '0.0.0.0', () => {
  // console.log('Sensor app Server running on port 3000');
// });
});