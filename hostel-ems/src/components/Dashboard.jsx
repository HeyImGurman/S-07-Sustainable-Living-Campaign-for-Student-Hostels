import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  ArrowUpRight,
  Award,
  BedDouble,
  BedSingle,
  Clock3,
  Home,
  Leaf,
  LoaderCircle,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from 'lucide-react';
import RoomCard from './UI/RoomCard';

const API_URL = 'http://localhost:5000';

export default function Dashboard({ user }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  const role = user?.role ?? 'admin';
  const isStudentView = role === 'student';

  const loadingMessages = [
    'Syncing room sensors and appliance status…',
    'Checking occupancy updates and maintenance flags…',
    'Preparing the latest hostel insights for you…',
  ];

  useEffect(() => {
    const messageTimer = setInterval(() => {
      setLoadingMessageIndex((current) => (current + 1) % loadingMessages.length);
    }, 2200);

    Promise.all([
      fetch(`${API_URL}/dashboard`).then((res) => res.json()),
      fetch(`${API_URL}/rooms`).then((res) => res.json()),
    ])
      .then(([dashboard, roomData]) => {
        setDashboardData(dashboard);
        setRooms(roomData);
      })
      .catch(() => {
        setDashboardData({
          occupancyRate: 78,
          activeAppliances: 41,
          pendingRequests: 7,
          lastUpdated: 'Offline demo data',
        });
        setRooms([
          {
            id: 1,
            roomNumber: '101',
            hostel: 'Main Hostel',
            floor: 1,
            occupancy: { status: 'occupied', student: 'Aisha Khan', bed: 'B1' },
            light: true,
            fan: true,
            hasFault: false,
            temperature: 24,
            water: 'available',
            wifi: 'connected',
            maintenance: 'No issues',
          },
        ]);
      })
      .finally(() => setLoading(false));

    return () => clearInterval(messageTimer);
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.14),_transparent_45%),linear-gradient(135deg,_#f8fafc_0%,_#eef2ff_100%)] p-6 text-slate-800 dark:bg-[radial-gradient(circle_at_top,_rgba(45,212,191,0.16),_transparent_45%),linear-gradient(135deg,_#020617_0%,_#0f172a_100%)] dark:text-slate-100">
        <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.12)] backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
          <div className="flex items-center justify-center">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400">
              <LoaderCircle className="h-8 w-8 animate-spin" />
              <div className="absolute inset-0 rounded-full border-2 border-emerald-400/20" />
            </div>
          </div>

          <div className="mt-6 text-center">
            <div className="flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600">
              <Home size={16} /> Hostel EMS
            </div>
            <h2 className="mt-3 text-2xl font-semibold">Preparing your dashboard</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{loadingMessages[loadingMessageIndex]}</p>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3 text-center text-sm text-slate-500 dark:text-slate-400">
            <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/70">
              <div className="flex justify-center text-emerald-500"><BedSingle size={16} /></div>
              <p className="mt-2 font-medium">Rooms</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/70">
              <div className="flex justify-center text-sky-500"><Zap size={16} /></div>
              <p className="mt-2 font-medium">Power</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/70">
              <div className="flex justify-center text-amber-500"><AlertTriangle size={16} /></div>
              <p className="mt-2 font-medium">Alerts</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isStudentView) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 text-slate-800 dark:bg-slate-950 dark:text-slate-100">
        <div className="mx-auto flex max-w-7xl flex-col gap-6">
          <div className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-sky-50 p-6 shadow-sm dark:border-emerald-900/40 dark:from-emerald-950/50 dark:via-slate-900 dark:to-slate-900">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600">Student dashboard</p>
                <h1 className="mt-1 text-2xl font-semibold">Good Evening, {user?.name ?? 'Gurmanpreet'} 👋</h1>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Room {user?.roomNumber ?? '703A'} · Block {user?.block ?? 'A'} · Current status Occupied
                </p>
              </div>
              <div className="rounded-full bg-white px-3 py-1 text-sm font-medium text-emerald-700 shadow-sm dark:bg-slate-800 dark:text-emerald-400">
                Eco-conscious living mode
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-emerald-100 bg-white/80 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <Zap size={16} className="text-amber-500" /> Today’s energy usage
                </div>
                <p className="mt-3 text-2xl font-semibold">2.8 kWh</p>
              </div>
              <div className="rounded-2xl border border-emerald-100 bg-white/80 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <TrendingUp size={16} className="text-emerald-500" /> Energy score
                </div>
                <p className="mt-3 text-2xl font-semibold">92/100</p>
              </div>
              <div className="rounded-2xl border border-emerald-100 bg-white/80 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <Leaf size={16} className="text-sky-500" /> CO₂ saved
                </div>
                <p className="mt-3 text-2xl font-semibold">0.9 kg</p>
              </div>
              <div className="rounded-2xl border border-emerald-100 bg-white/80 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <Award size={16} className="text-violet-500" /> Eco rank
                </div>
                <p className="mt-3 text-2xl font-semibold">#12</p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-emerald-600">Energy usage</p>
                  <h2 className="text-lg font-semibold">Today · Last 7 Days · Last 30 Days</h2>
                </div>
                <div className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                  +12% vs yesterday
                </div>
              </div>
              <div className="mt-5 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/70">
                <svg viewBox="0 0 320 140" className="h-40 w-full">
                  <path d="M0 100 C40 90 60 80 90 82 C120 84 142 70 170 64 C205 55 240 48 280 52 C300 54 315 56 320 48" stroke="#10b981" strokeWidth="3" fill="none" />
                  <path d="M0 100 C40 90 60 80 90 82 C120 84 142 70 170 64 C205 55 240 48 280 52 C300 54 315 56 320 48 L320 140 L0 140 Z" fill="rgba(16,185,129,0.12)" />
                </svg>
                <div className="mt-2 flex justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-2 text-emerald-600">
                <Home size={16} />
                <p className="text-sm font-semibold">Room status</p>
              </div>
              <h2 className="mt-2 text-lg font-semibold">Your room at a glance</h2>
              <div className="mt-4 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/70">
                <div className="flex items-center gap-2 text-emerald-600">
                  <span className="h-3 w-3 rounded-full bg-emerald-500" />
                  <p className="font-semibold">Occupied</p>
                </div>
                <div className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  <div className="flex items-center justify-between"><span>💡 Lights</span><span>ON</span></div>
                  <div className="flex items-center justify-between"><span>🌀 Fan</span><span>OFF</span></div>
                  <div className="flex items-center justify-between"><span>🔌 Plug</span><span>ON</span></div>
                  <div className="flex items-center justify-between"><span>🌡 Temperature</span><span>26°C</span></div>
                  <div className="flex items-center justify-between"><span>🚶 Motion</span><span>Detected</span></div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
            <div className="grid gap-6">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center gap-2 text-emerald-600">
                  <Leaf size={16} />
                  <p className="text-sm font-semibold">Personal impact</p>
                </div>
                <div className="mt-4 rounded-2xl bg-emerald-50 p-4 dark:bg-emerald-950/40">
                  <p className="text-sm text-slate-600 dark:text-slate-300">You have saved</p>
                  <p className="mt-2 text-3xl font-semibold text-emerald-700 dark:text-emerald-400">18.7 kWh</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">₹165 saved · Equal to planting 3 trees</p>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center gap-2 text-emerald-600">
                  <Target size={16} />
                  <p className="text-sm font-semibold">Monthly goal</p>
                </div>
                <div className="mt-4 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/70">
                  <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                    <span>Goal 25 kWh</span>
                    <span>20.5 kWh saved</span>
                  </div>
                  <div className="mt-3 h-3 rounded-full bg-slate-200 dark:bg-slate-700">
                    <div className="h-3 w-[82%] rounded-full bg-gradient-to-r from-emerald-500 to-sky-500" />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-emerald-600">82% complete</p>
                </div>
              </div>
            </div>

            <div className="grid gap-6">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center gap-2 text-emerald-600">
                  <Award size={16} />
                  <p className="text-sm font-semibold">Achievements</p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {['Eco Beginner', 'Power Saver', 'Carbon Hero', 'Green Champion'].map((item) => (
                    <span key={item} className="rounded-full bg-emerald-50 px-3 py-1 text-sm text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center gap-2 text-emerald-600">
                  <Sparkles size={16} />
                  <p className="text-sm font-semibold">Eco points</p>
                </div>
                <div className="mt-4 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/70">
                  <p className="text-3xl font-semibold">1,250 XP</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Level 7 · 250 XP to next reward</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-2 text-emerald-600">
                <AlertTriangle size={16} />
                <p className="text-sm font-semibold">Notifications</p>
              </div>
              <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-800/70">• Lights were turned off automatically at 2:13 PM.</div>
                <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-800/70">• Your room consumed 15% less energy than yesterday.</div>
                <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-800/70">• You earned +20 Eco Points.</div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-2 text-emerald-600">
                <Clock3 size={16} />
                <p className="text-sm font-semibold">Recent activity</p>
              </div>
              <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-800/70">10:23 AM · Lights turned OFF automatically</div>
                <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-800/70">8:12 AM · Motion detected</div>
                <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-800/70">Yesterday · Saved 0.8 kWh</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 text-slate-800 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">Hostel EMS</p>
              <h1 className="text-2xl font-semibold">Room overview dashboard</h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Live room status and appliance control for the campus hostels.
              </p>
            </div>
            <div className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
              Updated {dashboardData?.lastUpdated}
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <BedDouble size={16} /> Occupancy
              </div>
              <p className="mt-3 text-2xl font-semibold">{dashboardData?.occupancyRate}%</p>
            </div>
            <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <Sparkles size={16} /> Active appliances
              </div>
              <p className="mt-3 text-2xl font-semibold">{dashboardData?.activeAppliances}</p>
            </div>
            <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <AlertTriangle size={16} /> Pending requests
              </div>
              <p className="mt-3 text-2xl font-semibold">{dashboardData?.pendingRequests}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {rooms.map((room, index) => (
            <RoomCard
              key={room.id}
              room={room}
              light={room.light}
              fan={room.fan}
              hasFault={room.hasFault}
              delay={0.08 * index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}