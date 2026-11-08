import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { DoorOpen, Zap, Leaf, AlertTriangle, Users, Gauge } from "lucide-react";
import StatCard from "../components/ui/StatCard";
import RoomCard from "../components/ui/RoomCard";
import OccupancyChart from "../components/charts/OccupancyChart";
import * as api from "../services/api";
import type { Room, Summary } from "../types";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    api.getSummary().then(setSummary);
    api.getRooms().then(setRooms);
    const unsub = api.subscribeRoomUpdates((updated) => {
      setRooms(user?.role === "student" && user.roomNumber ? updated.filter((r) => r.roomNumber === user.roomNumber) : updated);
    });
    const interval = setInterval(() => api.getSummary().then(setSummary), 5000);
    return () => {
      unsub();
      clearInterval(interval);
    };
  }, [user]);

  async function handleToggle(roomNumber: string, type: "light" | "fan", state: "on" | "off") {
    const updated = await api.toggleAppliance(roomNumber, type, state);
    setRooms((prev) => prev.map((r) => (r.roomNumber === roomNumber ? updated : r)));
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h2 className="font-display text-xl font-semibold text-ink-primary dark:text-ink-primary-dark">
          Welcome back, {user?.name?.split(" ")[0]}
        </h2>
        <p className="text-sm text-ink-secondary dark:text-ink-secondary-dark">
          {user?.role === "student"
            ? "Here's a live look at your room."
            : "Here's what's happening across Zakir and NC Hostels right now."}
        </p>
      </motion.div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Total Rooms" value={summary?.totalRooms ?? "—"} icon={DoorOpen} gradient={["#7C3AED", "#A78BFA"]} delay={0} />
        <StatCard label="Occupied" value={summary?.occupiedRooms ?? "—"} icon={Users} gradient={["#2563EB", "#60A5FA"]} delay={0.05} />
        <StatCard label="Vacant" value={summary?.vacantRooms ?? "—"} icon={DoorOpen} gradient={["#64748B", "#94A3B8"]} delay={0.1} />
        <StatCard label="Energy Saved Today" value={summary?.savedTodayKwh ?? "—"} suffix="kWh" icon={Leaf} gradient={["#10B981", "#34D399"]} delay={0.15} />
        <StatCard label="Active Alerts" value={summary?.activeAlerts ?? "—"} icon={AlertTriangle} gradient={["#F59E0B", "#FBBF24"]} delay={0.2} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-sm font-semibold text-ink-primary dark:text-ink-primary-dark">
              {user?.role === "student" ? "Your room" : "Live room status"}
            </h3>
            <span className="flex items-center gap-1.5 text-xs text-ink-muted dark:text-ink-muted-dark">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald" /> live simulation
            </span>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {rooms.slice(0, 4).map((room, i) => (
              <RoomCard key={room._id} room={room} onToggleAppliance={handleToggle} delay={i * 0.05} />
            ))}
            {rooms.length === 0 && (
              <p className="col-span-2 py-8 text-center text-sm text-ink-muted dark:text-ink-muted-dark">
                Loading room data…
              </p>
            )}
          </div>
        </div>

        <div className="card p-5">
          <h3 className="mb-4 font-display text-sm font-semibold text-ink-primary dark:text-ink-primary-dark">
            Occupancy split
          </h3>
          <OccupancyChart occupied={summary?.occupiedRooms ?? 0} vacant={summary?.vacantRooms ?? 0} />
          <div className="mt-2 grid grid-cols-2 gap-3 text-center">
            <div className="rounded-xl bg-surface-secondary p-3 dark:bg-surface-secondary-dark">
              <p className="flex items-center justify-center gap-1 text-xs text-ink-muted dark:text-ink-muted-dark">
                <Gauge size={12} /> Live draw
              </p>
              <p className="font-mono text-lg font-semibold text-ink-primary dark:text-ink-primary-dark">
                {summary?.totalCurrentWatts ?? 0}W
              </p>
            </div>
            <div className="rounded-xl bg-surface-secondary p-3 dark:bg-surface-secondary-dark">
              <p className="flex items-center justify-center gap-1 text-xs text-ink-muted dark:text-ink-muted-dark">
                <Zap size={12} /> Used today
              </p>
              <p className="font-mono text-lg font-semibold text-ink-primary dark:text-ink-primary-dark">
                {summary?.todayKwh ?? 0} kWh
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
