import { useState } from 'react';
import {
  Bell,
  ChevronRight,
  LockKeyhole,
  MoonStar,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Waves,
} from 'lucide-react';

export default function Settings({ user, darkMode, setDarkMode }) {
  const [notifications, setNotifications] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [privacyMode, setPrivacyMode] = useState(false);
  const [soundAlerts, setSoundAlerts] = useState(true);

  return (
    <div className="min-h-screen bg-slate-50 p-6 text-slate-800 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">Settings</p>
              <h1 className="mt-1 text-2xl font-semibold">Customise your hostel management workspace</h1>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Fine-tune notifications, privacy, theme, and device preferences in one place.
              </p>
            </div>
            <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
              Signed in as {user?.name ?? 'Admin'} · {user?.role ?? 'admin'}
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-emerald-600">Appearance</p>
                  <h2 className="mt-1 text-xl font-semibold">Theme and layout</h2>
                </div>
                <div className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  Synced across the app
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-emerald-100 p-2 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                      <MoonStar size={18} />
                    </div>
                    <div>
                      <p className="font-semibold">Dark mode</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Switch between light and dark theme instantly.</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDarkMode(!darkMode)}
                    className="rounded-full p-1.5 text-emerald-600 transition hover:bg-slate-200 dark:hover:bg-slate-800"
                  >
                    {darkMode ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                  </button>
                </div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-emerald-600">
                    <Sparkles size={16} />
                    <span className="text-sm font-semibold">Focus mode</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Reduce visual noise and keep the dashboard clean.</p>
                </div>
                <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-emerald-600">
                    <Waves size={16} />
                    <span className="text-sm font-semibold">Adaptive layout</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Optimised cards for desktop, tablet, and mobile views.</p>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-emerald-600">Notifications</p>
                  <h2 className="mt-1 text-xl font-semibold">Stay informed without distraction</h2>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                <div className="flex items-center justify-between rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                  <div>
                    <p className="font-semibold">Push alerts</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Receive updates for maintenance and occupancy changes.</p>
                  </div>
                  <button type="button" onClick={() => setNotifications(!notifications)}>
                    {notifications ? <ToggleRight className="text-emerald-600" size={24} /> : <ToggleLeft className="text-slate-400" size={24} />}
                  </button>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                  <div>
                    <p className="font-semibold">Sound alerts</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Play short chimes for urgent events.</p>
                  </div>
                  <button type="button" onClick={() => setSoundAlerts(!soundAlerts)}>
                    {soundAlerts ? <ToggleRight className="text-emerald-600" size={24} /> : <ToggleLeft className="text-slate-400" size={24} />}
                  </button>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                  <div>
                    <p className="font-semibold">Auto-sync status</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Sync data every few minutes with the hostel system.</p>
                  </div>
                  <button type="button" onClick={() => setAutoSync(!autoSync)}>
                    {autoSync ? <ToggleRight className="text-emerald-600" size={24} /> : <ToggleLeft className="text-slate-400" size={24} />}
                  </button>
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-2 text-emerald-600">
                <ShieldCheck size={18} />
                <p className="text-sm font-semibold">Security & privacy</p>
              </div>
              <h2 className="mt-2 text-xl font-semibold">Protect your account</h2>

              <div className="mt-5 space-y-3">
                <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">Privacy mode</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Hide sensitive details on shared screens.</p>
                    </div>
                    <button type="button" onClick={() => setPrivacyMode(!privacyMode)}>
                      {privacyMode ? <ToggleRight className="text-emerald-600" size={24} /> : <ToggleLeft className="text-slate-400" size={24} />}
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                    <LockKeyhole size={16} />
                    Two-factor authentication
                  </div>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Add an extra verification step to your account for better protection.</p>
                  <button className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                    Enable security setup <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-2 text-emerald-600">
                <Smartphone size={18} />
                <p className="text-sm font-semibold">Connected devices</p>
              </div>
              <h2 className="mt-2 text-xl font-semibold">Manage access</h2>

              <div className="mt-5 space-y-3">
                <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">Admin dashboard</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Windows desktop · Last active 2 min ago</p>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">Active</span>
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">Mobile companion</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Android app · Last sync 1 hour ago</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">Offline</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        <section className="rounded-3xl border border-slate-200 bg-gradient-to-br from-emerald-50 via-white to-sky-50 p-6 shadow-sm dark:border-slate-800 dark:from-emerald-950/40 dark:via-slate-900 dark:to-slate-900">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">Quick actions</p>
              <h2 className="mt-1 text-xl font-semibold">Keep everything running smoothly</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                Reset defaults
              </button>
              <button className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-500">
                Save changes
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
