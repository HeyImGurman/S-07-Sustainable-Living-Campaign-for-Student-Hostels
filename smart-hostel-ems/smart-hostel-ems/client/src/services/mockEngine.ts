import type {
  Room,
  Summary,
  Notification,
  OccupancyLogEntry,
  DailyUsagePoint,
  HourlyUsagePoint,
  TopRoom,
  User,
  Role,
} from "../types";

// Lightweight client-side stand-in for the "Simulation Data Generator -> Database" pipeline
// described in the proposal's architecture diagram. It lets the dashboard run and feel fully
// alive with zero backend setup; point VITE_API_URL at the real Express server (see server/)
// for a true MERN deployment and this file is bypassed entirely.

const WATTS = { light: 18, fan: 65 };
const CO2_KG_PER_KWH = 0.82;
const HOSTELS: Room["hostel"][] = ["Zakir Hostel", "NC Hostel"];

let rooms: Room[] = [];
let notifications: Notification[] = [];
let occupancyLogs: OccupancyLogEntry[] = [];
const energyByDateHour: Record<string, { kwhUsed: number; kwhSaved: number; co2: number; roomNumber: string; hostel: string }> = {};

type Listener = (rooms: Room[]) => void;
type NotifyListener = (n: Notification) => void;
const roomListeners = new Set<Listener>();
const notifyListeners = new Set<NotifyListener>();

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function todayStr(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() - offsetDays);
  return d.toISOString().slice(0, 10);
}

function seedRooms() {
  const list: Room[] = [];
  for (const hostel of HOSTELS) {
    const prefix = hostel === "Zakir Hostel" ? "Z" : "NC";
    for (let floor = 1; floor <= 3; floor++) {
      for (let i = 1; i <= 4; i++) {
        const roomNumber = `${prefix}-${floor}${String(i).padStart(2, "0")}`;
        list.push({
          _id: uid(),
          roomNumber,
          hostel,
          floor,
          capacity: 4,
          occupancy: {
            status: Math.random() > 0.4 ? "occupied" : "vacant",
            occupantsDetected: Math.floor(Math.random() * 4) + 1,
            lastMovementAt: new Date().toISOString(),
          },
          sensor: { model: Math.random() > 0.5 ? "LD2410" : "C1001", status: "online" },
          appliances: [
            { type: "light", label: "Room Light", state: "on", mode: "auto", relayStatus: "active" },
            { type: "fan", label: "Ceiling Fan", state: "on", mode: "auto", relayStatus: "active" },
          ],
          automation: { enabled: true, autoShutdownSeconds: 45 },
          energy: { currentWatts: 0, todayKwh: 0, savedTodayKwh: 0 },
        });
      }
    }
  }
  return list;
}

// Backfill a week of plausible energy history so Analytics has something to chart immediately
function seedEnergyHistory() {
  for (let dayOffset = 6; dayOffset >= 0; dayOffset--) {
    const date = todayStr(dayOffset);
    for (const room of rooms) {
      for (let hour = 6; hour < 23; hour++) {
        const occupancyChance = hour >= 8 && hour <= 22 ? 0.55 : 0.2;
        const used = Math.random() < occupancyChance ? Math.random() * 0.6 + 0.2 : Math.random() * 0.1;
        const saved = Math.random() * 0.35;
        const key = `${date}-${hour}-${room.roomNumber}`;
        energyByDateHour[key] = {
          kwhUsed: used,
          kwhSaved: saved,
          co2: saved * CO2_KG_PER_KWH,
          roomNumber: room.roomNumber,
          hostel: room.hostel,
        };
      }
    }
  }
}

function pushNotification(payload: Omit<Notification, "_id" | "createdAt" | "read">) {
  const n: Notification = { ...payload, _id: uid(), createdAt: new Date().toISOString(), read: false };
  notifications = [n, ...notifications].slice(0, 200);
  notifyListeners.forEach((fn) => fn(n));
}

function emitRooms() {
  roomListeners.forEach((fn) => fn(rooms));
}

function tick() {
  const date = todayStr();
  const hour = new Date().getHours();
  const tickSeconds = 4;

  rooms = rooms.map((room) => {
    const r: Room = JSON.parse(JSON.stringify(room));

    if (Math.random() < 0.004 && r.sensor.status === "online") {
      r.sensor.status = "offline";
      pushNotification({
        room: r._id,
        roomNumber: r.roomNumber,
        type: "sensor_failure",
        message: `${r.sensor.model} sensor in ${r.roomNumber} stopped responding`,
        severity: "critical",
      });
    } else if (r.sensor.status === "offline" && Math.random() < 0.08) {
      r.sensor.status = "online";
    }

    if (r.sensor.status === "online") {
      const wasOccupied = r.occupancy.status === "occupied";
      const flip = Math.random();
      if (wasOccupied && flip < 0.05) {
        r.occupancy.status = "vacant";
        r.occupancy.occupantsDetected = 0;
        occupancyLogs = [
          { _id: uid(), roomNumber: r.roomNumber, event: "vacant" as const, detail: "No human presence detected", createdAt: new Date().toISOString() },
          ...occupancyLogs,
        ].slice(0, 300);
        pushNotification({ room: r._id, roomNumber: r.roomNumber, type: "room_vacant", message: `${r.roomNumber} became vacant`, severity: "info" });
      } else if (!wasOccupied && flip < 0.09) {
        r.occupancy.status = "occupied";
        r.occupancy.occupantsDetected = Math.floor(Math.random() * r.capacity) + 1;
        r.occupancy.lastMovementAt = new Date().toISOString();
        occupancyLogs = [
          { _id: uid(), roomNumber: r.roomNumber, event: "occupied" as const, detail: `${r.occupancy.occupantsDetected} occupant(s) detected`, createdAt: new Date().toISOString() },
          ...occupancyLogs,
        ].slice(0, 300);
        pushNotification({ room: r._id, roomNumber: r.roomNumber, type: "occupancy_detected", message: `Occupancy detected in ${r.roomNumber}`, severity: "info" });
        if (r.automation.enabled) {
          r.appliances.forEach((a) => {
            if (a.mode === "auto") {
              a.state = "on";
              a.relayStatus = "active";
            }
          });
        }
      } else if (wasOccupied) {
        r.occupancy.lastMovementAt = new Date().toISOString();
      }
    }

    const secondsVacant = (Date.now() - new Date(r.occupancy.lastMovementAt).getTime()) / 1000;
    if (r.occupancy.status === "vacant" && r.automation.enabled && secondsVacant >= r.automation.autoShutdownSeconds) {
      r.appliances.forEach((a) => {
        if (a.mode === "auto" && a.state === "on") {
          a.state = "off";
          a.relayStatus = "inactive";
          pushNotification({ room: r._id, roomNumber: r.roomNumber, type: "appliance_off", message: `${a.label} in ${r.roomNumber} auto-switched OFF after inactivity`, severity: "info" });
        }
      });
    }

    if (Math.random() < 0.0008) {
      const a = r.appliances[Math.floor(Math.random() * r.appliances.length)];
      if (a && a.relayStatus !== "fault") {
        a.relayStatus = "fault";
        pushNotification({ room: r._id, roomNumber: r.roomNumber, type: "relay_failure", message: `Relay fault detected for ${a.label} in ${r.roomNumber}`, severity: "critical" });
      }
    }

    const currentWatts = r.appliances.reduce((sum, a) => sum + (a.state === "on" ? WATTS[a.type] : 0), 0);
    const maxWatts = r.appliances.reduce((sum, a) => sum + WATTS[a.type], 0);
    const kwhUsedTick = (currentWatts * tickSeconds) / 3600 / 1000;
    const kwhSavedTick = r.automation.enabled && r.occupancy.status === "vacant" ? ((maxWatts - currentWatts) * tickSeconds) / 3600 / 1000 : 0;

    r.energy.currentWatts = currentWatts;
    r.energy.todayKwh += kwhUsedTick;
    r.energy.savedTodayKwh += kwhSavedTick;

    const key = `${date}-${hour}-${r.roomNumber}`;
    const existing = energyByDateHour[key] || { kwhUsed: 0, kwhSaved: 0, co2: 0, roomNumber: r.roomNumber, hostel: r.hostel };
    existing.kwhUsed += kwhUsedTick;
    existing.kwhSaved += kwhSavedTick;
    existing.co2 += kwhSavedTick * CO2_KG_PER_KWH;
    energyByDateHour[key] = existing;

    return r;
  });

  emitRooms();
}

let started = false;
export function ensureMockStarted() {
  if (started) return;
  started = true;
  rooms = seedRooms();
  seedEnergyHistory();
  setInterval(tick, 4000);
}

export function subscribeRooms(fn: Listener) {
  roomListeners.add(fn);
  return () => {
    roomListeners.delete(fn);
  };
}
export function subscribeNotifications(fn: NotifyListener) {
  notifyListeners.add(fn);
  return () => {
    notifyListeners.delete(fn);
  };
}

// ---- Mock "REST" functions, all async to mirror real API shape ----

const MOCK_USERS: Record<string, { user: User; password: string }> = {
  "admin@hostel.edu": {
    password: "password123",
    user: { id: "u1", name: "Admin User", email: "admin@hostel.edu", role: "admin", roomNumber: null, avatarColor: "#3B82F6" },
  },
  "maintenance@hostel.edu": {
    password: "password123",
    user: { id: "u2", name: "Maintenance Staff", email: "maintenance@hostel.edu", role: "maintenance", roomNumber: null, avatarColor: "#8B5CF6" },
  },
  "student@hostel.edu": {
    password: "password123",
    user: { id: "u3", name: "Gurmanpreet Singh", email: "student@hostel.edu", role: "student", roomNumber: "Z-101", avatarColor: "#10B981" },
  },
};

export async function mockLogin(email: string, password: string) {
  ensureMockStarted();
  const record = MOCK_USERS[email.toLowerCase()];
  if (!record || record.password !== password) throw new Error("Invalid email or password");
  return { token: "mock-token-" + record.user.id, user: record.user };
}

export async function mockRegister(name: string, email: string, password: string, role: Role, roomNumber?: string) {
  ensureMockStarted();
  if (MOCK_USERS[email.toLowerCase()]) throw new Error("An account with this email already exists");
  const user: User = { id: uid(), name, email, role, roomNumber: roomNumber || null, avatarColor: "#10B981" };
  MOCK_USERS[email.toLowerCase()] = { password, user };
  return { token: "mock-token-" + user.id, user };
}

export async function mockGetRooms(currentUser: User | null): Promise<Room[]> {
  ensureMockStarted();
  if (currentUser?.role === "student" && currentUser.roomNumber) {
    return rooms.filter((r) => r.roomNumber === currentUser.roomNumber);
  }
  return rooms;
}

export async function mockGetSummary(): Promise<Summary> {
  ensureMockStarted();
  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter((r) => r.occupancy.status === "occupied").length;
  const sensorOfflineCount = rooms.filter((r) => r.sensor.status === "offline").length;
  const relayFaultCount = rooms.reduce((s, r) => s + r.appliances.filter((a) => a.relayStatus === "fault").length, 0);
  return {
    totalRooms,
    occupiedRooms,
    vacantRooms: totalRooms - occupiedRooms,
    totalCurrentWatts: Math.round(rooms.reduce((s, r) => s + r.energy.currentWatts, 0)),
    todayKwh: Number(rooms.reduce((s, r) => s + r.energy.todayKwh, 0).toFixed(2)),
    savedTodayKwh: Number(rooms.reduce((s, r) => s + r.energy.savedTodayKwh, 0).toFixed(2)),
    sensorOfflineCount,
    relayFaultCount,
    activeAlerts: sensorOfflineCount + relayFaultCount,
  };
}

export async function mockToggleAppliance(roomNumber: string, applianceType: "light" | "fan", state: "on" | "off", byName: string) {
  ensureMockStarted();
  const room = rooms.find((r) => r.roomNumber === roomNumber);
  if (!room) throw new Error("Room not found");
  const appliance = room.appliances.find((a) => a.type === applianceType);
  if (!appliance) throw new Error("Appliance not found");
  appliance.state = state;
  appliance.mode = "manual";
  appliance.relayStatus = state === "on" ? "active" : "inactive";
  pushNotification({ room: room._id, roomNumber, type: "manual_override", message: `${appliance.label} in ${roomNumber} manually switched ${state.toUpperCase()} by ${byName}`, severity: "info" });
  emitRooms();
  return room;
}

export async function mockSetAutomation(roomNumber: string, enabled: boolean, byName: string) {
  ensureMockStarted();
  const room = rooms.find((r) => r.roomNumber === roomNumber);
  if (!room) throw new Error("Room not found");
  room.automation.enabled = enabled;
  if (enabled) room.appliances.forEach((a) => (a.mode = "auto"));
  pushNotification({ room: room._id, roomNumber, type: "manual_override", message: `Automation ${enabled ? "enabled" : "disabled"} for ${roomNumber} by ${byName}`, severity: "info" });
  emitRooms();
  return room;
}

export async function mockGetNotifications(): Promise<Notification[]> {
  ensureMockStarted();
  return notifications;
}
export async function mockMarkRead(id: string) {
  notifications = notifications.map((n) => (n._id === id ? { ...n, read: true } : n));
}
export async function mockMarkAllRead() {
  notifications = notifications.map((n) => ({ ...n, read: true }));
}

export async function mockGetActivityLogs(): Promise<OccupancyLogEntry[]> {
  ensureMockStarted();
  return occupancyLogs;
}

export async function mockGetDailyUsage(days = 7): Promise<DailyUsagePoint[]> {
  ensureMockStarted();
  const out: DailyUsagePoint[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = todayStr(i);
    let kwhUsed = 0, kwhSaved = 0, co2 = 0;
    Object.entries(energyByDateHour).forEach(([key, val]) => {
      if (key.startsWith(date)) {
        kwhUsed += val.kwhUsed;
        kwhSaved += val.kwhSaved;
        co2 += val.co2;
      }
    });
    out.push({ date, kwhUsed: Number(kwhUsed.toFixed(2)), kwhSaved: Number(kwhSaved.toFixed(2)), co2ReducedKg: Number(co2.toFixed(2)) });
  }
  return out;
}

export async function mockGetHourlyUsage(date = todayStr()): Promise<HourlyUsagePoint[]> {
  ensureMockStarted();
  const out: HourlyUsagePoint[] = [];
  for (let hour = 0; hour < 24; hour++) {
    let kwhUsed = 0, kwhSaved = 0;
    Object.entries(energyByDateHour).forEach(([key, val]) => {
      if (key === `${date}-${hour}` || key.startsWith(`${date}-${hour}-`)) {
        kwhUsed += val.kwhUsed;
        kwhSaved += val.kwhSaved;
      }
    });
    out.push({ hour, kwhUsed: Number(kwhUsed.toFixed(2)), kwhSaved: Number(kwhSaved.toFixed(2)) });
  }
  return out;
}

export async function mockGetTopRooms(limit = 5): Promise<TopRoom[]> {
  ensureMockStarted();
  const byRoom: Record<string, TopRoom> = {};
  Object.values(energyByDateHour).forEach((val) => {
    const existing = byRoom[val.roomNumber] || { roomNumber: val.roomNumber, hostel: val.hostel, kwhUsed: 0 };
    existing.kwhUsed += val.kwhUsed;
    byRoom[val.roomNumber] = existing;
  });
  return Object.values(byRoom)
    .sort((a, b) => b.kwhUsed - a.kwhUsed)
    .slice(0, limit)
    .map((r) => ({ ...r, kwhUsed: Number(r.kwhUsed.toFixed(2)) }));
}

export async function mockGetOccupancyStats() {
  ensureMockStarted();
  const byHostel: Record<string, { occupied: number; vacant: number; total: number }> = {};
  rooms.forEach((r) => {
    byHostel[r.hostel] = byHostel[r.hostel] || { occupied: 0, vacant: 0, total: 0 };
    byHostel[r.hostel].total += 1;
    byHostel[r.hostel][r.occupancy.status] += 1;
  });
  return byHostel;
}
