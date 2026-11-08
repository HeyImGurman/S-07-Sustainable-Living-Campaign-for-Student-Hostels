import { Sun, Moon, Monitor } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { USING_MOCK } from "../services/api";

export default function Settings() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="max-w-2xl space-y-5">
      <div className="card p-6">
        <h3 className="mb-4 font-display text-sm font-semibold text-ink-primary dark:text-ink-primary-dark">
          Profile
        </h3>
        <div className="flex items-center gap-4">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-full text-lg font-semibold text-white"
            style={{ backgroundColor: user?.avatarColor }}
          >
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-ink-primary dark:text-ink-primary-dark">{user?.name}</p>
            <p className="text-sm text-ink-secondary dark:text-ink-secondary-dark">{user?.email}</p>
            <p className="text-xs capitalize text-ink-muted dark:text-ink-muted-dark">
              {user?.role} {user?.roomNumber && `· Room ${user.roomNumber}`}
            </p>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="mb-4 font-display text-sm font-semibold text-ink-primary dark:text-ink-primary-dark">
          Appearance
        </h3>
        <div className="flex items-center justify-between rounded-xl border border-border p-4 dark:border-border-dark-default">
          <div className="flex items-center gap-3">
            {theme === "light" ? <Sun size={18} /> : <Moon size={18} />}
            <div>
              <p className="text-sm font-medium text-ink-primary dark:text-ink-primary-dark">
                {theme === "light" ? "Light mode" : "Dark mode"}
              </p>
              <p className="text-xs text-ink-muted dark:text-ink-muted-dark">
                Switch between light and dark appearance
              </p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className="rounded-lg bg-emerald px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-hover"
          >
            Switch to {theme === "light" ? "dark" : "light"}
          </button>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="mb-2 flex items-center gap-2 font-display text-sm font-semibold text-ink-primary dark:text-ink-primary-dark">
          <Monitor size={16} /> System mode
        </h3>
        <p className="text-sm text-ink-secondary dark:text-ink-secondary-dark">
          {USING_MOCK
            ? "This session is running fully in-browser on the simulation engine — no backend required. Connect the Express + MongoDB server (see /server) and set VITE_API_URL to switch to the live MERN stack."
            : "This session is connected to the live Express + MongoDB backend."}
        </p>
      </div>
    </div>
  );
}
