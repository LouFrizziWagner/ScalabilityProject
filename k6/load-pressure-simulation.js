/** k6 grafana - load testing tool scripts */

import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  scenarios: {
    stress_test: {
      executor: 'ramping-arrival-rate',
      startRate: 70,          // requests per second (RPS)
      timeUnit: '1s',
      preAllocatedVUs: 100,   // initial VUs
      maxVUs: 1000,           // max VUs it can scale to
      stages: [
        { target: 200, duration: '30s' },
        { target: 400, duration: '30s' },
        { target: 800, duration: '30s' },
        { target: 0, duration: '30s' },
      ],
    },
  },
};

const BASE_URL = 'http://localhost:8080'; // Change if needed

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

// idempotent key generator
function uuidv4() {
  // Generate RFC4122 version 4 UUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export default function () {
  // Simulate sensor data POST
  const payload = generateSensorData();
  const idempotentKey = uuidv4();
  // console.log(idempotentKey);

  const headers = { 'Content-Type': 'application/json', 'Idempotency-Key': idempotentKey };

  const postRes = http.post(`${BASE_URL}/api/sensor-data`, payload, { headers });
  check(postRes, {
    'POST status is 201': (r) => r.status === 201
  });

  // Simulate data viewer GET
  // const getRes = http.get(`${BASE_URL}/api/recent-sensor-data`);
  // check(getRes, {
  //   'GET status is 200': (r) => r.status === 200,
  //   'GET returned array': (r) => Array.isArray(JSON.parse(r.body)),
  // });

  // Simulate count GET
  // const getCountRes = http.get(`${BASE_URL}/api/count`);
  // check(getCountRes, {
  //   'GET status is 200': (r) => r.status === 200,
  //   'GET response message': (r) => Array.isArray(r.body),
  // });

  // Simulate temperature GET
  const getTempRes = http.get(`${BASE_URL}/api/max-temperature`);
  check(getTempRes, {
    'GET status is 200': (r) => r.status === 200,
    'GET status is 503': (r) => r.status === 503,
    'GET response message': (r) => Array.isArray(r.body),
  });

  //sleep(1); // 1 second between iterations
}

