import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { useTheme } from "../../context/ThemeContext";

interface OccupancyChartProps {
  occupied: number;
  vacant: number;
}

export default function OccupancyChart({ occupied, vacant }: OccupancyChartProps) {
  const { theme } = useTheme();
  const data = [
    { name: "Occupied", value: occupied, color: theme === "dark" ? "#4ADE80" : "#22C55E" },
    { name: "Vacant", value: vacant, color: theme === "dark" ? "#A1A1AA" : "#64748B" },
  ];

  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={62} outerRadius={90} paddingAngle={3} strokeWidth={0}>
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: theme === "dark" ? "#18181B" : "#FFFFFF",
            border: `1px solid ${theme === "dark" ? "#27272A" : "#F1F5F9"}`,
            borderRadius: 12,
            fontSize: 12,
          }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
