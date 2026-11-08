import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bell, AlertTriangle, Info, CheckCheck } from "lucide-react";
import * as api from "../services/api";
import type { Notification } from "../types";

const SEVERITY_STYLES: Record<Notification["severity"], string> = {
  info: "text-info-light dark:text-info-dark",
  warning: "text-warning-light dark:text-warning-dark",
  critical: "text-danger-light dark:text-danger-dark",
};

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  async function refresh() {
    const list = await api.getNotifications();
    setNotifications(list);
  }

  useEffect(() => {
    refresh();
    const unsub = api.subscribeNewNotifications((n) => setNotifications((prev) => [n, ...prev]));
    return unsub;
  }, []);

  async function handleMarkRead(id: string) {
    await api.markNotificationRead(id);
    setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
  }

  async function handleMarkAll() {
    await api.markAllNotificationsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-secondary dark:text-ink-secondary-dark">
          {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "You're all caught up"}
        </p>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAll}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-emerald hover:bg-emerald/10 dark:text-emerald-light"
          >
            <CheckCheck size={14} /> Mark all as read
          </button>
        )}
      </div>

      <div className="card divide-y divide-border dark:divide-border-dark-divider">
        {notifications.length === 0 && (
          <p className="p-8 text-center text-sm text-ink-muted dark:text-ink-muted-dark">
            No notifications yet — the simulation will generate some shortly.
          </p>
        )}
        {notifications.map((n, i) => (
          <motion.div
            key={n._id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: Math.min(i * 0.02, 0.2) }}
            className={`flex items-start gap-3 p-4 ${!n.read ? "bg-emerald/5 dark:bg-emerald/5" : ""}`}
          >
            <div className={`mt-0.5 shrink-0 ${SEVERITY_STYLES[n.severity]}`}>
              {n.severity === "critical" ? <AlertTriangle size={16} /> : n.severity === "warning" ? <Bell size={16} /> : <Info size={16} />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-ink-primary dark:text-ink-primary-dark">{n.message}</p>
              <p className="mt-0.5 text-xs text-ink-muted dark:text-ink-muted-dark">
                {new Date(n.createdAt).toLocaleString()}
              </p>
            </div>
            {!n.read && (
              <button
                onClick={() => handleMarkRead(n._id)}
                className="shrink-0 text-xs font-medium text-emerald hover:underline dark:text-emerald-light"
              >
                Mark read
              </button>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
