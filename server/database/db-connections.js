import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  host: 'postgres',
  user: 'sensor_user',
  password: 'taichi',
  database: 'multi_modal_sensor_station_data',
  port: 5432,
});

const maxRetries = 10;
const retryDelayMs = 2000;

export async function init() {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await pool.query('SELECT 1'); // for testing the connection
      console.log('---- Connected to PostgreSQL------');
      break;
    } catch (err) {
      console.warn(`------ Postgres not ready yet (attempt ${i + 1})...`);
      if (i === maxRetries - 1) throw err;
      await new Promise(resolve => setTimeout(resolve, retryDelayMs));
    }
  }
}

export default { init, pool };