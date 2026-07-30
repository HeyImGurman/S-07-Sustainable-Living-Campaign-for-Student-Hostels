import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  BedDouble,
  BellRing,
  ClipboardList,
  Clock3,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import RoomCard from './UI/RoomCard';

const API_URL = 'http://localhost:5000';

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
          {
            id: 2,
            roomNumber: '204',
            hostel: 'North Hostel',
            floor: 2,
            occupancy: { status: 'vacant', student: null, bed: 'B2' },
            light: false,
            fan: false,
            hasFault: true,
            temperature: 27,
            water: 'low',
            wifi: 'stable',
            maintenance: 'Check fan',
          },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  const quickActions = [
    { label: 'Assign maintenance', icon: ShieldCheck },
    { label: 'Review requests', icon: ClipboardList },
    { label: 'Notify residents', icon: BellRing },
  ];

  const alerts = [
    { title: 'Water supply restored', detail: 'Main hostel line is stable again', tone: 'emerald' },
    { title: 'Inspection reminder', detail: 'Room 204 needs follow-up by noon', tone: 'amber' },
    { title: 'New resident check-in', detail: 'Two new occupants need room access setup', tone: 'sky' },
  ];

  const priorities = [
    { title: 'Inspect room 204', detail: 'Fan issue and low water pressure reported', time: 'Today · 11:30' },
    { title: 'Approve maintenance queue', detail: '3 requests are ready for engineer assignment', time: 'Today · 14:00' },
    { title: 'Send housekeeping update', detail: 'Common areas need final sweep before evening', time: 'Tonight · 18:00' },
  ];

  if (loading) {
    return <div className="p-6 text-sm text-slate-500">Loading hostel data...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 text-slate-800 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">Hostel EMS</p>
              <h1 className="text-2xl font-semibold">Room overview dashboard</h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Live room status, resident updates, and maintenance priorities for the hostel.
              </p>
            </div>
            <div className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
              Updated {dashboardData?.lastUpdated}
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <BedDouble size={16} /> Occupancy
              </div>
              <p className="mt-3 text-2xl font-semibold">{dashboardData?.occupancyRate}%</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Most rooms are occupied today</p>
            </div>
            <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <Sparkles size={16} /> Active appliances
              </div>
              <p className="mt-3 text-2xl font-semibold">{dashboardData?.activeAppliances}</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Lights and fans are running</p>
            </div>
            <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <AlertTriangle size={16} /> Pending requests
              </div>
              <p className="mt-3 text-2xl font-semibold">{dashboardData?.pendingRequests}</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">High priority cases are queued</p>
            </div>
            <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <Users size={16} /> Residents tracked
              </div>
              <p className="mt-3 text-2xl font-semibold">24</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Across active rooms and shared spaces</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.12fr_0.88fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-emerald-600">Live updates</p>
                <h2 className="text-lg font-semibold">Recent hostel activity</h2>
              </div>
              <button type="button" className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                View all
              </button>
            </div>
            <div className="mt-4 space-y-3">
              {alerts.map((alert) => (
                <div key={alert.title} className="flex items-start gap-3 rounded-xl border border-slate-200 p-3 dark:border-slate-800">
                  <div className={`mt-0.5 h-2.5 w-2.5 rounded-full ${alert.tone === 'emerald' ? 'bg-emerald-500' : alert.tone === 'amber' ? 'bg-amber-500' : 'bg-sky-500'}`} />
                  <div>
                    <p className="font-medium text-slate-800 dark:text-slate-200">{alert.title}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{alert.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2 text-emerald-600">
              <Clock3 size={16} />
              <p className="text-sm font-semibold">Quick actions</p>
            </div>
            <h2 className="mt-2 text-lg font-semibold">Useful shortcuts</h2>
            <div className="mt-4 space-y-2">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.label}
                    type="button"
                    className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-3 py-3 text-left text-sm font-medium text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <span className="flex items-center gap-2">
                      <Icon size={16} /> {action.label}
                    </span>
                    <ArrowRight size={16} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2 text-emerald-600">
              <ClipboardList size={16} />
              <p className="text-sm font-semibold">Today’s priorities</p>
            </div>
            <div className="mt-4 space-y-3">
              {priorities.map((item) => (
                <div key={item.title} className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/70">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-slate-800 dark:text-slate-200">{item.title}</p>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.detail}</p>
                    </div>
                    <span className="whitespace-nowrap text-xs font-medium text-slate-500 dark:text-slate-400">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2 text-emerald-600">
              <BellRing size={16} />
              <p className="text-sm font-semibold">Resident notes</p>
            </div>
            <div className="mt-4 rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300">
              <p className="font-medium text-slate-800 dark:text-slate-200">Maintenance window update</p>
              <p className="mt-2">
                Residents have been informed about the repair plan for common lighting and water pressure concerns.
              </p>
              <p className="mt-3 font-medium text-emerald-600">Next reminder: 4:00 PM</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-emerald-600">Room monitoring</p>
              <h2 className="text-lg font-semibold">Detailed room cards</h2>
            </div>
            <button type="button" className="rounded-full bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-emerald-500">
              View full report
            </button>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
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
    </div>
  );
}