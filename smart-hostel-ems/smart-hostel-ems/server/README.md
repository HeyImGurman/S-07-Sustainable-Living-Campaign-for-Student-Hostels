# Smart Hostel EMS — Backend (Simulation + API)

Express + MongoDB API that stands in for the "Backend API Server" and "Simulation Data
Generator" boxes in the architecture diagram. A background engine (`simulation/simulator.js`)
ticks every few seconds, randomly evolving room occupancy, triggering auto-shutdown of
lights/fans, generating faults, and accruing energy usage/savings — exactly the behaviour a
real ESP32 + mmWave deployment would produce, without any hardware attached.

## Setup

```bash
cd server
npm install
cp .env.example .env      # then edit MONGO_URI / JWT_SECRET if needed
npm run seed               # creates hostels, rooms and 3 demo accounts
npm run dev                 # starts the API on http://localhost:5000
```

You need a MongoDB instance reachable at `MONGO_URI` (local `mongod`, Docker, or a free
MongoDB Atlas cluster all work).

## Demo accounts (created by `npm run seed`)

| Role        | Email                  | Password    |
|-------------|------------------------|-------------|
| Admin       | admin@hostel.edu       | password123 |
| Maintenance | maintenance@hostel.edu | password123 |
| Student     | student@hostel.edu     | password123 |

## Key endpoints

- `POST /api/auth/register` / `POST /api/auth/login` / `GET /api/auth/me`
- `GET /api/rooms` (filters: `?hostel=`, `?status=`) / `GET /api/rooms/:roomNumber`
- `GET /api/rooms/summary` — dashboard stat cards
- `PATCH /api/rooms/:roomNumber/appliance` — remote on/off `{ applianceType, state }`
- `PATCH /api/rooms/:roomNumber/automation` — enable/disable auto mode `{ enabled }`
- `GET /api/rooms/:roomNumber/logs` — per-room occupancy history
- `GET /api/analytics/daily`, `/hourly`, `/top-rooms`, `/occupancy`
- `GET /api/notifications`, `PATCH /api/notifications/:id/read`, `.../read-all`
- `GET /api/logs` — global activity log feed

Realtime: the server emits `rooms:update` and `notification:new` over Socket.io so the
dashboard updates live as the simulator runs locally. On Vercel, the API is served by
Functions and the client polls for updates; the background simulation does not run there.

## Vercel deployment

The repository's root `vercel.json` deploys the client and API as separate services and
routes `/api/*` to this API. Configure `MONGO_URI` and a long random `JWT_SECRET` in the
Vercel project environment, and seed the configured MongoDB database before using the
application. The simulation process is only started by the local `npm start` server.
