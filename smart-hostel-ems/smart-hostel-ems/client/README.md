# Smart Hostel EMS — Frontend

React 18 + TypeScript + Tailwind CSS + Framer Motion dashboard for the Smart Hostel Energy
Management System proposal — occupancy monitoring, remote appliance control, notifications,
activity logs, and energy analytics for Zakir & NC Hostels.

## Run it instantly (demo mode, no backend needed)

```bash
cd client
npm install
npm run dev
```

Open http://localhost:5173 and sign in with any of the demo accounts shown on the login
screen (or tap the role chips to autofill). The app runs entirely on an in-browser
simulation engine (`src/services/mockEngine.ts`) that mirrors the real backend's logic —
occupancy flips, auto-shutdown, relay faults, and energy accrual all happen live.

## Connect to the real MERN backend

```bash
cp .env.example .env
# edit .env:
# VITE_API_URL=http://localhost:5000
npm run dev
```

With `VITE_API_URL` set, every request goes to the Express + MongoDB server instead of
the mock engine. Set `VITE_USE_MOCK_API=true` to explicitly use the in-browser demo.
Production builds use the same-origin `/api` routes by default, so no client API URL
needs to be configured on Vercel. In production the dashboard polls API updates instead
of relying on a persistent socket connection.


## Structure

- `src/pages` — Login, Dashboard, Rooms, RoomDetail, Analytics, Notifications, ActivityLogs, Settings
- `src/components/layout` — Sidebar, Navbar, responsive DashboardLayout
- `src/components/ui` — StatCard, RoomCard, Badge, ThemeToggle
- `src/components/charts` — Recharts wrappers themed to the light/dark palette
- `src/context` — Theme (light/dark) and Auth providers
- `src/services/api.ts` — single API surface; swaps between the mock engine and the real backend
- `src/services/mockEngine.ts` — self-contained simulation used when no backend is configured

## Design tokens

Colors, gradients, and typography (Geist / Inter / JetBrains Mono) follow the palette
supplied in the project brief and are wired into `tailwind.config.js` as named tokens
(`emerald`, `status-*`, `metric-*`, `surface-*`, `ink-*`) so every screen stays consistent.
