/** k6 grafana - load testing tool scripts */

import http from 'k6/http';
import { sleep, check } from 'k6';

export let options = {
  stages: [
    { duration: '10s', target: 10 },   // ramp-up to 10 virtual users
    { duration: '20s', target: 10 },   // sustain
    { duration: '10s', target: 0 },    // ramp-down
  ],
};

const BASE_URL = 'http://localhost:3000'; // Change if needed

// Sample payload generator
function generateSensorData() {
  const now = new Date().toISOString();
  const sensors = [
    'park-station-tiergarten',
    'forest-station-grunewald',
    'forest-station-schoeneweide',
    'park-station-golm',
  ];

  return JSON.stringify({
    timestamp: now,
    sensor_id: sensors[Math.floor(Math.random() * sensors.length)],
    temperature: (20 + Math.random() * 10).toFixed(2),
    humidity: (40 + Math.random() * 20).toFixed(2),
    frequency_in_hz: (430 + Math.random() * 20).toFixed(2),
    carbon_dioxide_in_ppm: (390 + Math.random() * 30).toFixed(2),
    light_intensity_in_lux: (300 + Math.random() * 100).toFixed(2)
  });
}

export default function () {
  // Simulate sensor data POST
  const payload = generateSensorData();

  const headers = { 'Content-Type': 'application/json' };

  const postRes = http.post(`${BASE_URL}/api/sensor-data`, payload, { headers });
  check(postRes, {
    'POST status is 201': (r) => r.status === 201
  });

  // Simulate data viewer GET
  const getRes = http.get(`${BASE_URL}/api/recent-sensor-data`);
  check(getRes, {
    'GET status is 200': (r) => r.status === 200,
    'GET returned array': (r) => Array.isArray(JSON.parse(r.body)),
  });

  sleep(1); // 1 second between iterations
}

