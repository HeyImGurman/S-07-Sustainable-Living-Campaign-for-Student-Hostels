import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Fan, Lightbulb, Users, Waves, Wifi, WifiOff, Zap } from 'lucide-react';
import Badge from './Badge';

export default function RoomCard({ room, light, fan, hasFault, onToggleAppliance, delay }) {
  const occupancyTone = room.occupancy?.status === 'occupied' ? 'occupied' : 'vacant';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: delay }}
      whileHover={{ y: -2 }}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <Link
            to={`/rooms/${room.roomNumber}`}
            className="text-lg font-semibold text-slate-900 hover:text-emerald-600 dark:text-slate-100 dark:hover:text-emerald-400"
          >
            Room {room.roomNumber}
          </Link>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {room.hostel} · Floor {room.floor}
          </p>
        </div>
        <Badge tone={occupancyTone}>{room.occupancy?.status === 'occupied' ? 'Occupied' : 'Vacant'}</Badge>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/70">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Users size={16} /> Resident
          </div>
          <p className="mt-2 font-medium text-slate-800 dark:text-slate-200">
            {room.occupancy?.student ?? 'No resident'}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Bed {room.occupancy?.bed ?? 'N/A'}</p>
        </div>

        <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/70">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Zap size={16} /> Environment
          </div>
          <p className="mt-2 font-medium text-slate-800 dark:text-slate-200">{room.temperature}°C</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Water: {room.water}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <div className={`flex items-center gap-2 rounded-full px-3 py-1 text-sm ${light ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>
          <Lightbulb size={16} /> {light ? 'Light ON' : 'Light OFF'}
        </div>
        <div className={`flex items-center gap-2 rounded-full px-3 py-1 text-sm ${fan ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>
          <Fan size={16} /> {fan ? 'Fan ON' : 'Fan OFF'}
        </div>
        <div className={`flex items-center gap-2 rounded-full px-3 py-1 text-sm ${hasFault ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>
          <Waves size={16} /> {hasFault ? 'Fault detected' : 'Healthy'}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
        <div className="flex items-center gap-2">
          {room.wifi === 'connected' ? <Wifi size={16} /> : <WifiOff size={16} />} {room.wifi}
        </div>
        <button
          type="button"
          onClick={() => onToggleAppliance?.(room.id)}
          className="rounded-full bg-slate-900 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300"
        >
          Manage room
        </button>
      </div>
    </motion.div>
  );
}