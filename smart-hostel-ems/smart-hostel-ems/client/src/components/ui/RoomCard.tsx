import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Lightbulb, Fan, WifiOff, Wifi, Users, Zap } from "lucide-react";
import type { Room } from "../../types";
import Badge from "./Badge";

interface RoomCardProps {
  room: Room;
  onToggleAppliance: (roomNumber: string, type: "light" | "fan", state: "on" | "off") => void;
  delay?: number;
}

export default function RoomCard({ room, onToggleAppliance, delay = 0 }: RoomCardProps) {
  const light = room.appliances.find((a) => a.type === "light");
  const fan = room.appliances.find((a) => a.type === "fan");
  const hasFault = room.appliances.some((a) => a.relayStatus === "fault");

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      whileHover={{ y: -2 }}
      className="card card-hover flex flex-col gap-4 p-5"
    >
      <div className="flex items-start justify-between">
        <div>
          <Link
            to={`/rooms/${room.roomNumber}`}
            className="font-display text-base font-semibold text-ink-primary hover:text-emerald dark:text-ink-primary-dark dark:hover:text-emerald-light"
          >
            {room.roomNumber}
          </Link>
          <p className="text-xs text-ink-muted dark:text-ink-muted-dark">
            {room.hostel} · Floor {room.floor}
          </p>
        </div>
        {room.occupancy.status === "occupied" ? (
          <Badge tone="occupied">Occupied</Badge>
        ) : (
          <Badge tone="vacant">Vacant</Badge>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-ink-secondary dark:text-ink-secondary-dark">
        <span className="flex items-center gap-1.5">
          <Users size={13} /> {room.occupancy.occupantsDetected} detected
        </span>
        <span className="flex items-center gap-1.5">
          {room.sensor.status === "online" ? <Wifi size={13} /> : <WifiOff size={13} />}
          {room.sensor.model} {room.sensor.status === "offline" && "· offline"}
        </span>
        <span className="flex items-center gap-1.5 font-mono">
          <Zap size={13} /> {room.energy.currentWatts}W
        </span>
      </div>

      {hasFault && (
        <Badge tone="fault">Relay fault detected</Badge>
      )}

      <div className="flex items-center gap-3 border-t border-border pt-4 dark:border-border-dark-default">
        {light && (
          <button
            onClick={() => onToggleAppliance(room.roomNumber, "light", light.state === "on" ? "off" : "on")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition-colors duration-200 ${
              light.state === "on"
                ? "border-emerald/30 bg-emerald/10 text-emerald dark:text-emerald-light"
                : "border-border text-ink-muted dark:border-border-dark-default dark:text-ink-muted-dark"
            }`}
          >
            <Lightbulb size={14} /> Light {light.state === "on" ? "ON" : "OFF"}
          </button>
        )}
        {fan && (
          <button
            onClick={() => onToggleAppliance(room.roomNumber, "fan", fan.state === "on" ? "off" : "on")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition-colors duration-200 ${
              fan.state === "on"
                ? "border-emerald/30 bg-emerald/10 text-emerald dark:text-emerald-light"
                : "border-border text-ink-muted dark:border-border-dark-default dark:text-ink-muted-dark"
            }`}
          >
            <Fan size={14} /> Fan {fan.state === "on" ? "ON" : "OFF"}
          </button>
        )}
      </div>
    </motion.div>
  );
}
