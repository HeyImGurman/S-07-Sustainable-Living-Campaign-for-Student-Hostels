import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, Wifi, WifiOff, Zap, Lightbulb, Fan } from 'lucide-react'; // Assuming lucide-react
import Badge from './Badge'; // Adjust path

export default function RoomCard({ room, light, fan, hasFault, onToggleAppliance, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: delay }}
      whileHover={{ y: -2 }}
      className="card card-hover flex flex-col gap-4 p-5"
    >
      <div className="flex items-start justify-between">
        <div>
          <Link
            to={`/rooms/${room.roomNumber}`}
            className="font-display text-base font-semibold text-ink-primary hover:text-emerald dark:text-ink-primary-dark dark:hover:text-emerald-light"
          >
            {room.roomNumber}
          </Link>
          <p className="text-xs text-ink-muted dark:text-ink-muted-dark">
            {room.hostel} · Floor {room.floor}
          </p>
        </div>
        {room.occupancy.status === "occupied" ? (
          <Badge tone="occupied">Occupied</Badge>
        ) : (
          <Badge tone="vacant">Vacant</Badge>
        )}
      </div>

      {/* ... (rest of your logic remains the same) ... */}
    </motion.div>
  );
}