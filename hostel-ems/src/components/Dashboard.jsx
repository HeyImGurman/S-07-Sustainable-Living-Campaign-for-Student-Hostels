import { useEffect, useState } from 'react';
import { AlertTriangle, BedDouble, Sparkles, LoaderCircle, BedSingle, Home, Zap } from 'lucide-react';
import RoomCard from './UI/RoomCard';

const API_URL = 'http://localhost:5000';

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

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