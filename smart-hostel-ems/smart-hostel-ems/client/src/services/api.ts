import axios from "axios";
import { io, Socket } from "socket.io-client";
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
import * as mock from "./mockEngine";

// If VITE_API_URL is defined, this app talks to the real MERN backend in /server.
// Otherwise it runs entirely on the in-browser simulation engine so the UI can be
// explored instantly with zero setup.
const API_URL = import.meta.env.VITE_API_URL as string | undefined;
export const USING_MOCK = !API_URL;

const http = axios.create({ baseURL: API_URL });
http.interceptors.request.use((config) => {
  const token = localStorage.getItem("shems_token");
  if (token && !USING_MOCK) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let socket: Socket | null = null;
export function getSocket() {
  if (USING_MOCK) return null;
  if (!socket) socket = io(API_URL as string);
  return socket;
}

function getCurrentUser(): User | null {
  const raw = localStorage.getItem("shems_user");
  return raw ? JSON.parse(raw) : null;
}

// ---------- Auth ----------
export async function login(email: string, password: string) {
  if (USING_MOCK) return mock.mockLogin(email, password);
  const { data } = await http.post("/api/auth/login", { email, password });
  return data;
}

export async function register(name: string, email: string, password: string, role: Role, roomNumber?: string) {
  if (USING_MOCK) return mock.mockRegister(name, email, password, role, roomNumber);
  const { data } = await http.post("/api/auth/register", { name, email, password, role, roomNumber });
  return data;
}

// ---------- Rooms ----------
export async function getRooms(): Promise<Room[]> {
  if (USING_MOCK) return mock.mockGetRooms(getCurrentUser());
  const { data } = await http.get("/api/rooms");
  return data.rooms;
}

export async function getSummary(): Promise<Summary> {
  if (USING_MOCK) return mock.mockGetSummary();
  const { data } = await http.get("/api/rooms/summary");
  return data;
}

export async function toggleAppliance(roomNumber: string, applianceType: "light" | "fan", state: "on" | "off") {
  const user = getCurrentUser();
  if (USING_MOCK) return mock.mockToggleAppliance(roomNumber, applianceType, state, user?.name || "You");
  const { data } = await http.patch(`/api/rooms/${roomNumber}/appliance`, { applianceType, state });
  return data.room;
}

export async function setAutomation(roomNumber: string, enabled: boolean) {
  const user = getCurrentUser();
  if (USING_MOCK) return mock.mockSetAutomation(roomNumber, enabled, user?.name || "You");
  const { data } = await http.patch(`/api/rooms/${roomNumber}/automation`, { enabled });
  return data.room;
}

export function subscribeRoomUpdates(cb: (rooms: Room[]) => void) {
  if (USING_MOCK) return mock.subscribeRooms(cb);
  const s = getSocket();
  s?.on("rooms:update", cb);
  return () => {
    s?.off("rooms:update", cb);
  };
}

// ---------- Notifications ----------
export async function getNotifications(): Promise<Notification[]> {
  if (USING_MOCK) return mock.mockGetNotifications();
  const { data } = await http.get("/api/notifications");
  return data.notifications;
}

export async function markNotificationRead(id: string) {
  if (USING_MOCK) return mock.mockMarkRead(id);
  await http.patch(`/api/notifications/${id}/read`);
}

export async function markAllNotificationsRead() {
  if (USING_MOCK) return mock.mockMarkAllRead();
  await http.patch("/api/notifications/read-all");
}

export function subscribeNewNotifications(cb: (n: Notification) => void) {
  if (USING_MOCK) return mock.subscribeNotifications(cb);
  const s = getSocket();
  s?.on("notification:new", cb);
  return () => {
    s?.off("notification:new", cb);
  };
}

// ---------- Activity logs ----------
export async function getActivityLogs(): Promise<OccupancyLogEntry[]> {
  if (USING_MOCK) return mock.mockGetActivityLogs();
  const { data } = await http.get("/api/logs");
  return data.logs;
}

// ---------- Analytics ----------
export async function getDailyUsage(days = 7): Promise<DailyUsagePoint[]> {
  if (USING_MOCK) return mock.mockGetDailyUsage(days);
  const { data } = await http.get(`/api/analytics/daily?days=${days}`);
  return data.series;
}

export async function getHourlyUsage(date?: string): Promise<HourlyUsagePoint[]> {
  if (USING_MOCK) return mock.mockGetHourlyUsage(date);
  const { data } = await http.get(`/api/analytics/hourly${date ? `?date=${date}` : ""}`);
  return data.series;
}

export async function getTopRooms(limit = 5): Promise<TopRoom[]> {
  if (USING_MOCK) return mock.mockGetTopRooms(limit);
  const { data } = await http.get(`/api/analytics/top-rooms?limit=${limit}`);
  return data.rooms;
}

export async function getOccupancyStats() {
  if (USING_MOCK) return mock.mockGetOccupancyStats();
  const { data } = await http.get("/api/analytics/occupancy");
  return data.byHostel;
}
