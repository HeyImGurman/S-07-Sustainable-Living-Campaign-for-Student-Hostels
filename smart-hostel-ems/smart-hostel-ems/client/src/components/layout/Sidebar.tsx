import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  DoorOpen,
  BarChart3,
  Bell,
  ScrollText,
  Settings as SettingsIcon,
  Leaf,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/rooms", label: "Rooms", icon: DoorOpen },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/activity", label: "Activity Logs", icon: ScrollText },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
];

export default function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { user } = useAuth();

  return (
    <div className="flex h-full flex-col bg-surface-sidebar dark:bg-surface-sidebar-dark">
      <div className="flex items-center gap-2.5 px-6 py-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald to-emerald-light">
          <Leaf className="h-5 w-5 text-white" strokeWidth={2} />
        </div>
        <div>
          <p className="font-display text-sm font-semibold leading-none text-ink-primary dark:text-ink-primary-dark">
            Smart Hostel
          </p>
          <p className="text-xs text-ink-muted dark:text-ink-muted-dark">Energy Management</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-200 ${
                isActive
                  ? "bg-emerald/10 text-emerald dark:bg-emerald/15 dark:text-emerald-light"
                  : "text-ink-secondary hover:bg-surface-secondary dark:text-ink-secondary-dark dark:hover:bg-surface-secondary-dark"
              }`
            }
          >
            <Icon className="h-4.5 w-4.5" strokeWidth={2} size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-border p-4 dark:border-border-dark-default">
        <div className="flex items-center gap-3 rounded-xl bg-surface-secondary p-3 dark:bg-surface-secondary-dark">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
            style={{ backgroundColor: user?.avatarColor || "#10B981" }}
          >
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-ink-primary dark:text-ink-primary-dark">
              {user?.name}
            </p>
            <p className="truncate text-xs capitalize text-ink-muted dark:text-ink-muted-dark">
              {user?.role}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
