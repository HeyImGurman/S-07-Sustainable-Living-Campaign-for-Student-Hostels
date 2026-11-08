import { useEffect, useState } from "react";
import { Menu, Bell, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import ThemeToggle from "../ui/ThemeToggle";
import { useAuth } from "../../context/AuthContext";
import * as api from "../../services/api";

const TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/rooms": "Rooms",
  "/analytics": "Analytics",
  "/notifications": "Notifications",
  "/activity": "Activity Logs",
  "/settings": "Settings",
};

export default function Navbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { logout } = useAuth();
  const location = useLocation();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    api.getNotifications().then((list) => setUnread(list.filter((n) => !n.read).length));
    const unsub = api.subscribeNewNotifications(() => setUnread((u) => u + 1));
    return unsub;
  }, []);

  const title =
    TITLES[location.pathname] ||
    (location.pathname.startsWith("/rooms/") ? "Room Details" : "Smart Hostel EMS");

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-surface-navbar/90 px-4 backdrop-blur dark:border-border-dark-default dark:bg-surface-navbar-dark/90 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-ink-secondary hover:bg-surface-secondary dark:text-ink-secondary-dark dark:hover:bg-surface-secondary-dark lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <h1 className="font-display text-lg font-semibold text-ink-primary dark:text-ink-primary-dark">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <Link
          to="/notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-border text-ink-secondary transition-colors duration-200 hover:bg-surface-secondary dark:border-border-dark-default dark:text-ink-secondary-dark dark:hover:bg-surface-secondary-dark"
          aria-label="Notifications"
        >
          <Bell size={17} />
          {unread > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-danger-light text-[10px] font-semibold text-white">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </Link>
        <ThemeToggle />
        <button
          onClick={logout}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-ink-secondary transition-colors duration-200 hover:bg-surface-secondary dark:border-border-dark-default dark:text-ink-secondary-dark dark:hover:bg-surface-secondary-dark"
          aria-label="Log out"
        >
          <LogOut size={17} />
        </button>
      </div>
    </header>
  );
}
