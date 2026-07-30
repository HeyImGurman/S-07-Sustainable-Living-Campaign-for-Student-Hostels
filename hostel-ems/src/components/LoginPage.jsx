import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  Activity,
  ShieldCheck,
  Wrench,
  GraduationCap,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

const ROLES = [
  { id: "admin", label: "Admin", icon: ShieldCheck },
  { id: "maintenance", label: "Maintenance", icon: Wrench },
  { id: "student", label: "Student", icon: GraduationCap },
];

// Deterministic pseudo-random pulse timings so the sensor grid feels alive
// without being distracting or fully random on every render.
function useSensorGrid(rows, cols) {
  return useMemo(() => {
    const nodes = [];
    let seed = 42;
    const rand = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        nodes.push({
          id: `${r}-${c}`,
          delay: rand() * 4,
          duration: 2.4 + rand() * 2.2,
          active: rand() > 0.35,
        });
      }
    }
    return nodes;
  }, [rows, cols]);
}

export default function LoginPage() {
  const [role, setRole] = useState("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [status, setStatus] = useState("idle"); // idle | loading | error
  const [errorMsg, setErrorMsg] = useState("");

  const sensorNodes = useSensorGrid(6, 5);

  function validate() {
    if (!email.trim()) return "Enter your email address.";
    if (!/^\S+@\S+\.\S+$/.test(email)) return "Enter a valid email address.";
    if (!password) return "Enter your password.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    return "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const err = validate();
    if (err) {
      setStatus("error");
      setErrorMsg(err);
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    // TODO: replace with real auth call, e.g.
    // await fetch("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password, role }) })
    await new Promise((res) => setTimeout(res, 1200));
    setStatus("idle");
    setErrorMsg("Login isn't wired up yet — connect this form to your auth API.");
    setStatus("error");
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center p-6">
        <div className="grid w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 md:grid-cols-2">
          {/* Left: brand / live sensor panel */}
          <div className="relative hidden flex-col justify-between overflow-hidden bg-slate-950 p-10 md:flex">
            {/* ambient gradient */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.18),transparent_55%),radial-gradient(circle_at_80%_85%,rgba(34,211,238,0.12),transparent_50%)]" />

            <div className="relative">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400">
                  <Activity className="h-4 w-4" />
                </span>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
                  Hostel EMS
                </p>
              </div>

              <h1 className="mt-8 text-2xl font-semibold leading-snug text-white">
                Real-time energy &amp; occupancy,
                <br /> across every room.
              </h1>
              <p className="mt-3 max-w-xs text-sm text-slate-400">
                Live mmWave occupancy sensing and role-based control for Zakir
                and NC hostels.
              </p>
            </div>

            {/* Signature element: live sensor grid */}
            <div className="relative mt-10">
              <div className="mb-3 flex items-center gap-2 text-xs font-medium text-slate-400">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </span>
                Sensor network &middot; live
              </div>
              <div className="grid grid-cols-5 gap-2.5">
                {sensorNodes.map((n) => (
                  <motion.div
                    key={n.id}
                    className={`h-2.5 w-2.5 rounded-[3px] ${
                      n.active ? "bg-emerald-400/70" : "bg-slate-700/70"
                    }`}
                    animate={
                      n.active
                        ? { opacity: [0.35, 1, 0.35] }
                        : { opacity: 0.25 }
                    }
                    transition={{
                      duration: n.duration,
                      delay: n.delay,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
              <div className="mt-6 flex items-center gap-6 text-xs text-slate-400">
                <div>
                  <p className="text-lg font-semibold text-white">128 kWh</p>
                  <p>saved today</p>
                </div>
                <div className="h-8 w-px bg-slate-800" />
                <div>
                  <p className="text-lg font-semibold text-white">74%</p>
                  <p>occupancy</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: login form */}
          <div className="flex flex-col justify-center p-8 sm:p-10">
            <div className="mb-8 md:hidden">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
                Hostel EMS
              </p>
            </div>

            <h2 className="text-2xl font-semibold">Welcome back</h2>
            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
              Sign in to monitor and manage your hostel.
            </p>

            {/* Role selector */}
            <div className="mt-6 grid grid-cols-3 gap-2">
              {ROLES.map(({ id, label, icon: Icon }) => {
                const active = role === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setRole(id)}
                    className={`flex flex-col items-center gap-1.5 rounded-lg border px-2 py-2.5 text-xs font-medium transition-colors ${
                      active
                        ? "border-emerald-500/60 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                        : "border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:border-slate-800 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-slate-200"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </button>
                );
              })}
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-300"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@hostelems.edu"
                    className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-950 dark:focus:border-emerald-400"
                  />
                </div>
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-xs font-medium text-slate-600 dark:text-slate-300"
                  >
                    Password
                  </label>
                  <a
                    href="#"
                    className="text-xs font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-950 dark:focus:border-emerald-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <label className="flex select-none items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-900"
                />
                Keep me signed in
              </label>

              <AnimatePresence>
                {status === "error" && errorMsg && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-start gap-2 overflow-hidden rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300"
                  >
                    <AlertCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
                    <span>{errorMsg}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={status === "loading"}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-slate-400 dark:text-slate-500">
              Hostel EMS &middot; Zakir &amp; NC Hostels
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}