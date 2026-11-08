export type Role = "student" | "admin" | "maintenance";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  roomNumber: string | null;
  avatarColor: string;
}

export interface Appliance {
  type: "light" | "fan";
  label: string;
  state: "on" | "off";
  mode: "auto" | "manual";
  relayStatus: "active" | "inactive" | "fault";
}

export interface Room {
  _id: string;
  roomNumber: string;
  hostel: "Zakir Hostel" | "NC Hostel";
  floor: number;
  capacity: number;
  occupancy: {
    status: "occupied" | "vacant";
    occupantsDetected: number;
    lastMovementAt: string;
  };
  sensor: {
    model: "LD2410" | "C1001";
    status: "online" | "offline";
  };
  appliances: Appliance[];
  automation: {
    enabled: boolean;
    autoShutdownSeconds: number;
  };
  energy: {
    currentWatts: number;
    todayKwh: number;
    savedTodayKwh: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface Summary {
  totalRooms: number;
  occupiedRooms: number;
  vacantRooms: number;
  totalCurrentWatts: number;
  todayKwh: number;
  savedTodayKwh: number;
  sensorOfflineCount: number;
  relayFaultCount: number;
  activeAlerts: number;
}

export interface Notification {
  _id: string;
  room: string | null;
  roomNumber: string | null;
  type:
    | "room_vacant"
    | "appliance_off"
    | "occupancy_detected"
    | "sensor_failure"
    | "relay_failure"
    | "manual_override";
  message: string;
  severity: "info" | "warning" | "critical";
  read: boolean;
  createdAt: string;
}

export interface OccupancyLogEntry {
  _id: string;
  roomNumber: string;
  event: "occupied" | "vacant" | "sensor_offline" | "sensor_online";
  detail: string;
  createdAt: string;
}

export interface DailyUsagePoint {
  date: string;
  kwhUsed: number;
  kwhSaved: number;
  co2ReducedKg: number;
}

export interface HourlyUsagePoint {
  hour: number;
  kwhUsed: number;
  kwhSaved: number;
}

export interface TopRoom {
  roomNumber: string;
  hostel: string;
  kwhUsed: number;
}
