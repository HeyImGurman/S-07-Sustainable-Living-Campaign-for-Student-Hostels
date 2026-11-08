import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Lightbulb, Fan, Wifi, WifiOff, Zap, Leaf, Clock, ToggleLeft, ToggleRight } from "lucide-react";
import * as api from "../services/api";
import type { Room, OccupancyLogEntry } from "../types";
import Badge from "../components/ui/Badge";

export default function RoomDetail() {
  const { roomNumber } = useParams<{ roomNumber: string }>();
  const [room, setRoom] = useState<Room | null>(null);
  const [logs, setLogs] = useState<OccupancyLogEntry[]>([]);

  useEffect(() => {
    if (!roomNumber) return;
    async function load() {
      const rooms = await api.getRooms();
      setRoom(rooms.find((r) => r.roomNumber === roomNumber) || null);
      const allLogs = await api.getActivityLogs();
      setLogs(allLogs.filter((l) => l.roomNumber === roomNumber).slice(0, 15));
    }
    load();
    const unsub = api.subscribeRoomUpdates((rooms) => {
      const match = rooms.find((r) => r.roomNumber === roomNumber);
      if (match) setRoom(match);
    });
    return unsub;
  }, [roomNumber]);

  async function handleToggle(type: "light" | "fan", state: "on" | "off") {
    if (!roomNumber) return;
    const updated = await api.toggleAppliance(roomNumber, type, state);
    setRoom(updated);
  }

  async function handleAutomation(enabled: boolean) {
    if (!roomNumber) return;
    const updated = await api.setAutomation(roomNumber, enabled);
    setRoom(updated);
  }

  if (!room) {
    return <p className="py-12 text-center text-sm text-ink-muted dark:text-ink-muted-dark">Loading room…</p>;
  }

  return (
    <div className="space-y-6">
      <Link
        to="/rooms"
        className="inline-flex items-center gap-1.5 text-sm text-ink-secondary hover:text-emerald dark:text-ink-secondary-dark"
      >
        <ArrowLeft size={15} /> Back to rooms
      </Link>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-semibold text-ink-primary dark:text-ink-primary-dark">
              {room.roomNumber}
            </h2>
            <p className="text-sm text-ink-secondary dark:text-ink-secondary-dark">
              {room.hostel} · Floor {room.floor} · Capacity {room.capacity}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {room.occupancy.status === "occupied" ? <Badge tone="occupied">Occupied</Badge> : <Badge tone="vacant">Vacant</Badge>}
            {room.sensor.status === "offline" && <Badge tone="offline">Sensor offline</Badge>}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl bg-surface-secondary p-3 dark:bg-surface-secondary-dark">
            <p className="text-xs text-ink-muted dark:text-ink-muted-dark">Sensor</p>
            <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-ink-primary dark:text-ink-primary-dark">
              {room.sensor.status === "online" ? <Wifi size={14} /> : <WifiOff size={14} />} {room.sensor.model}
            </p>
          </div>
          <div className="rounded-xl bg-surface-secondary p-3 dark:bg-surface-secondary-dark">
            <p className="text-xs text-ink-muted dark:text-ink-muted-dark">Current draw</p>
            <p className="mt-1 flex items-center gap-1.5 font-mono text-sm font-medium text-ink-primary dark:text-ink-primary-dark">
              <Zap size={14} /> {room.energy.currentWatts}W
            </p>
          </div>
          <div className="rounded-xl bg-surface-secondary p-3 dark:bg-surface-secondary-dark">
            <p className="text-xs text-ink-muted dark:text-ink-muted-dark">Used today</p>
            <p className="mt-1 font-mono text-sm font-medium text-ink-primary dark:text-ink-primary-dark">
              {room.energy.todayKwh.toFixed(2)} kWh
            </p>
          </div>
          <div className="rounded-xl bg-surface-secondary p-3 dark:bg-surface-secondary-dark">
            <p className="flex items-center gap-1 text-xs text-ink-muted dark:text-ink-muted-dark">
              <Leaf size={12} /> Saved today
            </p>
            <p className="mt-1 font-mono text-sm font-medium text-emerald dark:text-emerald-light">
              {room.energy.savedTodayKwh.toFixed(2)} kWh
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-sm font-semibold text-ink-primary dark:text-ink-primary-dark">
              Appliance control
            </h3>
            <button
              onClick={() => handleAutomation(!room.automation.enabled)}
              className="flex items-center gap-1.5 text-xs font-medium text-ink-secondary dark:text-ink-secondary-dark"
            >
              {room.automation.enabled ? (
                <ToggleRight size={22} className="text-emerald" />
              ) : (
                <ToggleLeft size={22} className="text-ink-muted" />
              )}
              Automatic mode
            </button>
          </div>

          <div className="space-y-3">
            {room.appliances.map((a) => (
              <div
                key={a.type}
                className="flex items-center justify-between rounded-xl border border-border p-4 dark:border-border-dark-default"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-secondary dark:bg-surface-secondary-dark">
                    {a.type === "light" ? <Lightbulb size={17} /> : <Fan size={17} />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ink-primary dark:text-ink-primary-dark">{a.label}</p>
                    <p className="text-xs capitalize text-ink-muted dark:text-ink-muted-dark">
                      {a.mode} mode · relay {a.relayStatus}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle(a.type, a.state === "on" ? "off" : "on")}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors duration-200 ${
                    a.state === "on"
                      ? "bg-emerald/10 text-emerald dark:text-emerald-light"
                      : "bg-surface-secondary text-ink-muted dark:bg-surface-secondary-dark dark:text-ink-muted-dark"
                  }`}
                >
                  {a.state === "on" ? "Turn OFF" : "Turn ON"}
                </button>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-ink-muted dark:text-ink-muted-dark">
            Auto shutdown after {room.automation.autoShutdownSeconds}s of no detected presence.
          </p>
        </div>

        <div className="card p-6">
          <h3 className="mb-4 font-display text-sm font-semibold text-ink-primary dark:text-ink-primary-dark">
            Recent occupancy history
          </h3>
          <ul className="space-y-3">
            {logs.map((log) => (
              <li key={log._id} className="flex items-start gap-3 text-sm">
                <Clock size={14} className="mt-0.5 shrink-0 text-ink-muted dark:text-ink-muted-dark" />
                <div>
                  <p className="text-ink-primary dark:text-ink-primary-dark">
                    {log.event === "occupied" ? "Occupancy detected" : "Room became vacant"}
                  </p>
                  <p className="text-xs text-ink-muted dark:text-ink-muted-dark">
                    {log.detail} · {new Date(log.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </li>
            ))}
            {logs.length === 0 && (
              <p className="text-sm text-ink-muted dark:text-ink-muted-dark">No occupancy events recorded yet.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
