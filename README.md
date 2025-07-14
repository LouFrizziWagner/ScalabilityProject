# ScalabilityProject

A minimal, scalable sensor data web application that demonstrates state sharing across replicated backend instances, load balancing via NGINX, and performance testing using synthetic and concurrent loads.

Project demo: [link](https://www.canva.com/design/DAGsgxn55yQ/eDxbYLf_B0eyfKQNqQLEJw/view?utm_content=DAGsgxn55yQ&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=ha94298273c)

## Application Scenario
Multi-modal sensor stations send measurements from parks and forests from all over berlin-brandenburg. The measurements are made publicly accessable through a website.
The more sensors are installed, and the more users want to read the website - the more load presses on the backend server.
Scaling is then managed through nginx and three implemented horizontal scaling methods.

### Example POST request body data from three clients.

| ID  | Timestamp                  | Sensor ID                   | Temperature (°C) | Humidity (%) | Frequency (Hz) | CO₂ (ppm) | Light Intensity (lux) |
|-----|----------------------------|-----------------------------|------------------|--------------|----------------|-----------|------------------------|
| 825 | 2025-07-13T14:28:56.449Z  | park-station-golm           | 29.44            | 52.53        | 449.09         | 404.7     | 343.99                 |
| 823 | 2025-07-13T14:28:56.247Z  | forest-station-grunewald    | 23.41            | 50.16        | 449.6          | 399.08    | 381.04                 |
| 824 | 2025-07-13T14:28:56.052Z  | park-station-tiergarten     | 21.49            | 41.53        | 446.37         | 408.92    | 310.11                 |


## System Architecture

This project showcases a horizontally and vertically scalable web application stack.

- **Backend (Node.js)** – 3 app replicas (`replica1`, `replica2`, `replica3`)
- **Database** – Shared PostgreSQL container
- **Load Balancer** – NGINX reverse proxy distributing traffic across replicas
- **Sensor Simulator** – `sensor-simulator.js` generates realistic write load requests
- **Load Testing** – [`k6`](https://k6.io/) for concurrent HTTP request simulation

### State Sharing

The web application maintains **shared state across instances** by centralizing persistent data storage in PostgreSQL.

---

## how to get Started

### Prerequisites

- Docker + Docker Compose (e.g., via [Rancher Desktop](https://rancherdesktop.io/))

### Start the system

Install k6 for macOs:
```
brew install k6
```

```bash
cd ScalabilityProject
docker compose up --build
```

### Restart the system
```
# wipes the volumes
docker compose down -v


# rebuild
docker compose up --build
```

### Containers
| Container Name                  | Defined In         | Role                                                                                                  |
| ------------------------------- | ------------------ | ----------------------------------------------------------------------------------------------------- |
| `scalabilityproject-nginx-1`    | `nginx` service    | Runs **Nginx reverse proxy** <br>Handles **rate limiting**, **proxying**, optional **load balancing** |
| `scalabilityproject-replica1-1` | `replica1` service | Runs **Node.js app** <br>Handles actual app logic (e.g., APIs, DB queries)                            |

#### Addresses
| Address          | What It Hits                             | Role                       |
| ---------------- | ---------------------------------------- | -------------------------- |
| `localhost:3000` | Directly hits the Node.js app (replica1) | Application server         |
| `localhost:8080` | Goes through Nginx reverse proxy (nginx) | Load balancer + throttling |

#### test health

### running k6 locally:
```
k6 run load-pressure-simulation.js
```

### Test throttling
```
for i in {1..20}; do curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8080/; done
```
Valid result:
```
200
200
200
200
200
200
200
200
200
200
200
200
200
503
503
503
200
503
503
503
```

### Test Jitter
Run k6, examine result:
```
    http_req_duration.......................................................: avg=318.34ms min=102.55ms med=319.23ms max=708.84ms p(90)=477.86ms p(95)=496.76ms      
```
Check if the range (min to max) reflects the randomness of delay (jitter) we applied.

### Test Idempotency API (POST)
Add 'Idempotency-Key' to header, send two requests with the same key and make sure only one record is added to the database.
