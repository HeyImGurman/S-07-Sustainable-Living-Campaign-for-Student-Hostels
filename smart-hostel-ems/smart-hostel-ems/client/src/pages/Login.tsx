import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Leaf, Mail, Lock, User as UserIcon, DoorOpen, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { USING_MOCK } from "../services/api";
import type { Role } from "../types";

const DEMO_ACCOUNTS: { label: string; email: string; role: Role }[] = [
  { label: "Admin", email: "admin@hostel.edu", role: "admin" },
  { label: "Maintenance", email: "maintenance@hostel.edu", role: "maintenance" },
  { label: "Student", email: "student@hostel.edu", role: "student" },
];

export default function Login() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("password123");
  const [role, setRole] = useState<Role>("student");
  const [roomNumber, setRoomNumber] = useState("");
  const { login, register, loading, error } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (mode === "login") await login(email, password);
      else await register(name, email, password, role, roomNumber);
      navigate("/");
    } catch {
      // error surfaced via context
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-bg px-4 py-10 dark:bg-surface-bg-dark">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald to-emerald-light shadow-card">
            <Leaf className="h-6 w-6 text-white" />
          </div>
          <h1 className="font-display text-2xl font-semibold text-ink-primary dark:text-ink-primary-dark">
            Smart Hostel EMS
          </h1>
          <p className="mt-1 text-sm text-ink-secondary dark:text-ink-secondary-dark">
            Occupancy-aware energy management for Zakir &amp; NC Hostels
          </p>
        </div>

        <div className="card p-6 sm:p-8">
          <div className="mb-6 flex rounded-xl bg-surface-secondary p-1 dark:bg-surface-secondary-dark">
            {(["login", "register"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors duration-200 ${
                  mode === m
                    ? "bg-surface-card text-ink-primary shadow-sm dark:bg-surface-card-dark dark:text-ink-primary-dark"
                    : "text-ink-muted dark:text-ink-muted-dark"
                }`}
              >
                {m === "login" ? "Sign in" : "Create account"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="mb-1.5 block text-xs font-medium text-ink-secondary dark:text-ink-secondary-dark">
                  Full name
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-border px-3 py-2.5 focus-within:border-emerald dark:border-border-dark-default">
                  <UserIcon size={16} className="text-ink-muted dark:text-ink-muted-dark" />
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Gurmanpreet Singh"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-ink-disabled dark:placeholder:text-ink-disabled-dark"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-secondary dark:text-ink-secondary-dark">
                Email
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-border px-3 py-2.5 focus-within:border-emerald dark:border-border-dark-default">
                <Mail size={16} className="text-ink-muted dark:text-ink-muted-dark" />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@hostel.edu"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-ink-disabled dark:placeholder:text-ink-disabled-dark"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-secondary dark:text-ink-secondary-dark">
                Password
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-border px-3 py-2.5 focus-within:border-emerald dark:border-border-dark-default">
                <Lock size={16} className="text-ink-muted dark:text-ink-muted-dark" />
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-ink-disabled dark:placeholder:text-ink-disabled-dark"
                />
              </div>
            </div>

            {mode === "register" && (
              <>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-ink-secondary dark:text-ink-secondary-dark">
                    Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as Role)}
                    className="w-full rounded-xl border border-border bg-transparent px-3 py-2.5 text-sm outline-none focus:border-emerald dark:border-border-dark-default"
                  >
                    <option value="student">Student</option>
                    <option value="admin">Hostel Administration</option>
                    <option value="maintenance">Maintenance Staff</option>
                  </select>
                </div>
                {role === "student" && (
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-ink-secondary dark:text-ink-secondary-dark">
                      Room number
                    </label>
                    <div className="flex items-center gap-2 rounded-xl border border-border px-3 py-2.5 focus-within:border-emerald dark:border-border-dark-default">
                      <DoorOpen size={16} className="text-ink-muted dark:text-ink-muted-dark" />
                      <input
                        value={roomNumber}
                        onChange={(e) => setRoomNumber(e.target.value)}
                        placeholder="Z-101"
                        className="w-full bg-transparent text-sm outline-none placeholder:text-ink-disabled dark:placeholder:text-ink-disabled-dark"
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            {error && <p className="text-xs font-medium text-danger-light">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-emerald-hover disabled:opacity-60"
            >
              {loading && <Loader2 size={15} className="animate-spin" />}
              {mode === "login" ? "Sign in" : "Create account"}
            </button>
          </form>

          {USING_MOCK && (
            <div className="mt-6 border-t border-border pt-5 dark:border-border-dark-default">
              <p className="mb-2.5 text-center text-xs text-ink-muted dark:text-ink-muted-dark">
                Running in demo mode · tap a role to sign in instantly
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {DEMO_ACCOUNTS.map((acc) => (
                  <button
                    key={acc.email}
                    type="button"
                    onClick={() => {
                      setMode("login");
                      setEmail(acc.email);
                      setPassword("password123");
                    }}
                    className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-ink-secondary transition-colors duration-200 hover:border-emerald hover:text-emerald dark:border-border-dark-default dark:text-ink-secondary-dark"
                  >
                    {acc.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
