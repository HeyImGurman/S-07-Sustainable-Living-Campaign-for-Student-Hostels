import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { useTheme } from "../../context/ThemeContext";

interface BarUsageChartProps {
  data: Record<string, any>[];
  xKey: string;
  yKey: string;
  color?: string;
  xFormatter?: (v: any) => string;
}

export default function BarUsageChart({ data, xKey, yKey, color = "#3B82F6", xFormatter }: BarUsageChartProps) {
  const { theme } = useTheme();
  const gridColor = theme === "dark" ? "#27272A" : "#F1F5F9";
  const textColor = theme === "dark" ? "#A1A1AA" : "#94A3B8";

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
        <XAxis
          dataKey={xKey}
          tickFormatter={xFormatter}
          tick={{ fill: textColor, fontSize: 11 }}
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
        />
        <Bar dataKey={yKey} fill={color} radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
