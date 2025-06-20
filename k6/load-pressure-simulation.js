/** k6 grafana - load testing tool scripts */

import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 10,              // 10 virtual users
  duration: '10s',      // for 30 seconds
};

export default function () {
  //http.get("http://host.docker.internal:8080/api/recent-sensor-data");
  http.get("http://nginx/api/recent-sensor-data");
  sleep(1);
}