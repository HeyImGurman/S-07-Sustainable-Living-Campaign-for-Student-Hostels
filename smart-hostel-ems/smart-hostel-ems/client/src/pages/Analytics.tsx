import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Leaf, Zap, CloudFog, TrendingUp } from "lucide-react";
import EnergyChart from "../components/charts/EnergyChart";
import BarUsageChart from "../components/charts/BarUsageChart";
import StatCard from "../components/ui/StatCard";
import * as api from "../services/api";
import type { DailyUsagePoint, HourlyUsagePoint, TopRoom } from "../types";

export default function Analytics() {
  const [daily, setDaily] = useState<DailyUsagePoint[]>([]);
  const [hourly, setHourly] = useState<HourlyUsagePoint[]>([]);
  const [topRooms, setTopRooms] = useState<TopRoom[]>([]);

  useEffect(() => {
    api.getDailyUsage(7).then(setDaily);
    api.getHourlyUsage().then(setHourly);
    api.getTopRooms(6).then(setTopRooms);
    const interval = setInterval(() => {
      api.getDailyUsage(7).then(setDaily);
      api.getHourlyUsage().then(setHourly);
      api.getTopRooms(6).then(setTopRooms);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const totalUsed = daily.reduce((s, d) => s + d.kwhUsed, 0);
  const totalSaved = daily.reduce((s, d) => s + d.kwhSaved, 0);
  const totalCo2 = daily.reduce((s, d) => s + d.co2ReducedKg, 0);
  const savingsRate = totalUsed + totalSaved > 0 ? Math.round((totalSaved / (totalUsed + totalSaved)) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Used (7 days)" value={totalUsed.toFixed(1)} suffix="kWh" icon={Zap} gradient={["#2563EB", "#60A5FA"]} />
        <StatCard label="Saved (7 days)" value={totalSaved.toFixed(1)} suffix="kWh" icon={Leaf} gradient={["#10B981", "#34D399"]} delay={0.05} />
        <StatCard label="CO₂ Reduced" value={totalCo2.toFixed(1)} suffix="kg" icon={CloudFog} gradient={["#7C3AED", "#A78BFA"]} delay={0.1} />
        <StatCard label="Savings Rate" value={savingsRate} suffix="%" icon={TrendingUp} gradient={["#F59E0B", "#FBBF24"]} delay={0.15} />
      </div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card p-5">
        <h3 className="mb-1 font-display text-sm font-semibold text-ink-primary dark:text-ink-primary-dark">
          Weekly electricity usage vs. energy saved
        </h3>
        <p className="mb-4 text-xs text-ink-muted dark:text-ink-muted-dark">Last 7 days, aggregated across both hostels</p>
        <EnergyChart data={daily} />
      </motion.div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="card p-5">
          <h3 className="mb-1 font-display text-sm font-semibold text-ink-primary dark:text-ink-primary-dark">
            Today's usage by hour
          </h3>
          <p className="mb-4 text-xs text-ink-muted dark:text-ink-muted-dark">Electricity used, in kWh</p>
          <BarUsageChart data={hourly} xKey="hour" yKey="kwhUsed" color="#3B82F6" xFormatter={(h) => `${h}:00`} />
        </div>
        <div className="card p-5">
          <h3 className="mb-1 font-display text-sm font-semibold text-ink-primary dark:text-ink-primary-dark">
            Most energy-consuming rooms
          </h3>
          <p className="mb-4 text-xs text-ink-muted dark:text-ink-muted-dark">Last 7 days, kWh used</p>
          <BarUsageChart data={topRooms} xKey="roomNumber" yKey="kwhUsed" color="#8B5CF6" />
        </div>
      </div>
    </div>
  );
}
