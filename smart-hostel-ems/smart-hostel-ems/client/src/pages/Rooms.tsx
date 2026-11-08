import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import RoomCard from "../components/ui/RoomCard";
import * as api from "../services/api";
import type { Room } from "../types";
import { useAuth } from "../context/AuthContext";

const HOSTEL_FILTERS = ["All", "Zakir Hostel", "NC Hostel"] as const;
const STATUS_FILTERS = ["All", "occupied", "vacant"] as const;

export default function Rooms() {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [hostel, setHostel] = useState<(typeof HOSTEL_FILTERS)[number]>("All");
  const [status, setStatus] = useState<(typeof STATUS_FILTERS)[number]>("All");
  const [query, setQuery] = useState("");

  useEffect(() => {
    api.getRooms().then(setRooms);
    const unsub = api.subscribeRoomUpdates((updated) => {
      setRooms(user?.role === "student" && user.roomNumber ? updated.filter((r) => r.roomNumber === user.roomNumber) : updated);
    });
    return unsub;
  }, [user]);

  async function handleToggle(roomNumber: string, type: "light" | "fan", state: "on" | "off") {
    const updated = await api.toggleAppliance(roomNumber, type, state);
    setRooms((prev) => prev.map((r) => (r.roomNumber === roomNumber ? updated : r)));
  }

  const filtered = useMemo(() => {
    return rooms.filter((r) => {
      if (hostel !== "All" && r.hostel !== hostel) return false;
      if (status !== "All" && r.occupancy.status !== status) return false;
      if (query && !r.roomNumber.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [rooms, hostel, status, query]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted dark:text-ink-muted-dark" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search room number…"
            className="w-full rounded-xl border border-border bg-surface-card py-2.5 pl-9 pr-3 text-sm outline-none focus:border-emerald dark:border-border-dark-default dark:bg-surface-card-dark"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {user?.role !== "student" && (
            <div className="flex rounded-xl bg-surface-secondary p-1 dark:bg-surface-secondary-dark">
              {HOSTEL_FILTERS.map((h) => (
                <button
                  key={h}
                  onClick={() => setHostel(h)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors duration-200 ${
                    hostel === h
                      ? "bg-surface-card text-ink-primary shadow-sm dark:bg-surface-card-dark dark:text-ink-primary-dark"
                      : "text-ink-muted dark:text-ink-muted-dark"
                  }`}
                >
                  {h}
                </button>
              ))}
            </div>
          )}
          <div className="flex rounded-xl bg-surface-secondary p-1 dark:bg-surface-secondary-dark">
            {STATUS_FILTERS.map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors duration-200 ${
                  status === s
                    ? "bg-surface-card text-ink-primary shadow-sm dark:bg-surface-card-dark dark:text-ink-primary-dark"
                    : "text-ink-muted dark:text-ink-muted-dark"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((room, i) => (
          <RoomCard key={room._id} room={room} onToggleAppliance={handleToggle} delay={Math.min(i * 0.03, 0.3)} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-12 text-center text-sm text-ink-muted dark:text-ink-muted-dark">
          No rooms match your filters.
        </p>
      )}
    </div>
  );
}
