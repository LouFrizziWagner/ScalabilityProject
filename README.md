# ScalabilityProject

A minimal, scalable sensor data web application that demonstrates state sharing across replicated backend instances, load balancing via NGINX, and performance testing using synthetic and concurrent loads.

## system Architecture

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

```bash
cd scalable-test-app
docker compose up --build