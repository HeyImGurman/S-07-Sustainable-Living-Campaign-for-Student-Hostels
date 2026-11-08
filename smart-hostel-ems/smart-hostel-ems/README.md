# Smart Hostel Energy Management System (MERN)

A full MERN-stack implementation of the Smart Hostel Energy Management System proposal:
occupancy-aware automation for lights and fans across Zakir & NC Hostels, a live dashboard,
remote appliance control, notifications, activity logs, and energy analytics — all driven by
a simulation engine that stands in for the ESP32 + mmWave hardware described in the proposal.

```
smart-hostel-ems/
├── client/   React 18 + TypeScript + Tailwind + Framer Motion + Recharts frontend
└── server/   Express + MongoDB (Mongoose) + Socket.io backend + simulation engine
```

## Fastest way to try it — zero setup

```bash
cd client
npm install
npm run dev
```

Open http://localhost:5173. The frontend runs entirely on a built-in browser simulation
engine (mirrors the real backend's logic), so you can explore every screen — dashboard,
rooms, room detail, analytics, notifications, activity logs, settings, light/dark mode —
without installing MongoDB or running the server at all. Sign in with any demo account
shown on the login screen.

## Running the real MERN stack

1. **Backend**
   ```bash
   cd server
   npm install
   cp .env.example .env        # point MONGO_URI at your MongoDB instance
   npm run seed                # creates hostels, rooms, and 3 demo accounts
   npm run dev                 # http://localhost:5000
   ```
2. **Frontend**
   ```bash
   cd client
   cp .env.example .env
   # set VITE_API_URL=http://localhost:5000 in .env
   npm install
   npm run dev
   ```

See `client/README.md` and `server/README.md` for full endpoint and structure documentation.

## What's implemented against the proposal

- Simulated occupancy detection (stand-in for LD2410 / C1001 mmWave sensors) with automatic
  appliance shutdown after a configurable inactivity window
- Remote on/off control of lights and fans, with manual-override tracking
- Real-time dashboard: total/occupied/vacant rooms, live wattage, energy saved, active alerts
- Room-level detail view with sensor status, relay status, and occupancy history
- Notification system for vacancy, occupancy, sensor failure, relay failure, and overrides
- Global activity log feed
- Energy analytics: daily/hourly usage vs. savings, CO₂ reduction, most energy-consuming rooms
- Role-based views for students (their own room only), admin, and maintenance staff
- Email/password sign in and sign up
- Light/dark mode using the exact color system supplied in the brief
- Fully responsive layout (mobile drawer navigation, adaptive grids)

Out of scope, matching the proposal: real ESP32 firmware, physical relays/sensors, mobile
app, and cloud deployment — the architecture is built so those can be added later without
restructuring the app.
