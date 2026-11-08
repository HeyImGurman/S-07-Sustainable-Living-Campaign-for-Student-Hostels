import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import type { DailyUsagePoint } from "../../types";
import { useTheme } from "../../context/ThemeContext";

export default function EnergyChart({ data }: { data: DailyUsagePoint[] }) {
  const { theme } = useTheme();
  const gridColor = theme === "dark" ? "#27272A" : "#F1F5F9";
  const textColor = theme === "dark" ? "#A1A1AA" : "#94A3B8";

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <defs>
          <linearGradient id="usedGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="savedGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10B981" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={(d) => new Date(d).toLocaleDateString(undefined, { weekday: "short" })}
          tick={{ fill: textColor, fontSize: 12 }}
          axisLine={{ stroke: gridColor }}
          tickLine={false}
        />
        <YAxis tick={{ fill: textColor, fontSize: 12 }} axisLine={false} tickLine={false} width={36} />
        <Tooltip
          contentStyle={{
            backgroundColor: theme === "dark" ? "#18181B" : "#FFFFFF",
            border: `1px solid ${gridColor}`,
            borderRadius: 12,
            fontSize: 12,
          }}
          labelFormatter={(d) => new Date(d).toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}
        />
        <Area type="monotone" dataKey="kwhUsed" name="Electricity used (kWh)" stroke="#3B82F6" fill="url(#usedGradient)" strokeWidth={2} />
        <Area type="monotone" dataKey="kwhSaved" name="Energy saved (kWh)" stroke="#10B981" fill="url(#savedGradient)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
