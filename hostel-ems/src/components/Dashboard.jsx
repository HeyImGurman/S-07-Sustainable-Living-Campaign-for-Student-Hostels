import { useEffect, useState } from 'react';
import { AlertTriangle, BedDouble, Sparkles } from 'lucide-react';
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
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-6 text-sm text-slate-500">Loading hostel data...</div>;
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