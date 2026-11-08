import { useEffect, useState } from "react";
import { ScrollText, DoorOpen, DoorClosed } from "lucide-react";
import * as api from "../services/api";
import type { OccupancyLogEntry } from "../types";

export default function ActivityLogs() {
  const [logs, setLogs] = useState<OccupancyLogEntry[]>([]);

  useEffect(() => {
    api.getActivityLogs().then(setLogs);
    const interval = setInterval(() => api.getActivityLogs().then(setLogs), 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="card p-5">
      <div className="mb-4 flex items-center gap-2">
        <ScrollText size={16} className="text-ink-secondary dark:text-ink-secondary-dark" />
        <h3 className="font-display text-sm font-semibold text-ink-primary dark:text-ink-primary-dark">
          Occupancy &amp; appliance activity
        </h3>
      </div>

      <div className="max-h-[70vh] space-y-1 overflow-y-auto scrollbar-thin pr-1">
        {logs.map((log) => (
          <div
            key={log._id}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-surface-secondary dark:hover:bg-surface-secondary-dark"
          >
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                log.event === "occupied"
                  ? "bg-status-occupied/10 text-status-occupied dark:bg-status-occupied-dark/15 dark:text-status-occupied-dark"
                  : "bg-status-vacant/10 text-status-vacant dark:bg-status-vacant-dark/15 dark:text-status-vacant-dark"
              }`}
            >
              {log.event === "occupied" ? <DoorOpen size={14} /> : <DoorClosed size={14} />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-ink-primary dark:text-ink-primary-dark">
                <span className="font-medium">{log.roomNumber}</span>{" "}
                {log.event === "occupied" ? "occupancy detected" : "became vacant"}
              </p>
              <p className="text-xs text-ink-muted dark:text-ink-muted-dark">{log.detail}</p>
            </div>
            <span className="shrink-0 text-xs text-ink-muted dark:text-ink-muted-dark">
              {new Date(log.createdAt).toLocaleTimeString()}
            </span>
          </div>
        ))}
        {logs.length === 0 && (
          <p className="py-8 text-center text-sm text-ink-muted dark:text-ink-muted-dark">
            No activity recorded yet — check back in a moment.
          </p>
        )}
      </div>
    </div>
  );
}
