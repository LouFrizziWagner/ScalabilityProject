import express from 'express';
import db from './database/db-connections.js';

const router = express.Router();

/** SENSOR POST ENDPOINT */
router.post('/sensor-data', async (req, res) => {
  const {
    timestamp,
    sensor_id,
    temperature,
    humidity,
    frequency_in_hz,
    carbon_dioxide_in_ppm,
    light_intensity_in_lux
  } = req.body;

  try {
    await db.pool.query(
      `INSERT INTO multi_modal_sensor_station_data (
        timestamp,
        sensor_id,
        temperature,
        humidity,
        frequency_in_hz,
        carbon_dioxide_in_ppm,
        light_intensity_in_lux
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        timestamp,
        sensor_id,
        temperature,
        humidity,
        frequency_in_hz,
        carbon_dioxide_in_ppm,
        light_intensity_in_lux
      ]
    );
    res.status(201).send('Recorded');
  } catch (err) {
    console.error(err);
    res.status(500).send('DB Error');
  }
});

/** USERS GET ENDPOINTS */
router.get('/recent-sensor-data', async (req, res) => {
  try {
    const result = await db.pool.query(
      'SELECT * FROM multi_modal_sensor_station_data ORDER BY timestamp DESC LIMIT 10'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('DB Error');
  }
});

export default router;