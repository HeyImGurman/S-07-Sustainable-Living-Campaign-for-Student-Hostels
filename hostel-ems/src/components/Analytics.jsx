import { ArrowDownRight, Zap } from 'lucide-react';

const monthlyData = [
  { month: 'Jan', baseline: 210, current: 154 },
  { month: 'Feb', baseline: 198, current: 142 },
  { month: 'Mar', baseline: 224, current: 161 },
  { month: 'Apr', baseline: 216, current: 155 },
  { month: 'May', baseline: 205, current: 148 },
  { month: 'Jun', baseline: 230, current: 164 },
];

const totalBaseline = monthlyData.reduce((sum, item) => sum + item.baseline, 0);
const totalCurrent = monthlyData.reduce((sum, item) => sum + item.current, 0);
const totalSaved = totalBaseline - totalCurrent;
const savingsPercent = Math.round((totalSaved / totalBaseline) * 100);
const maxValue = Math.max(...monthlyData.map((item) => Math.max(item.baseline, item.current)));

function buildPoints(items, key) {
  return items
    .map((item, index) => {
      const x = 35 + index * 55;
      const y = 180 - (item[key] / maxValue) * 120;
      return `${x},${y}`;
    })
    .join(' ');
}

export default function Analytics() {
  return (
    <div className="min-h-screen bg-slate-50 p-6 text-slate-800 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">Energy analytics</p>
              <h1 className="text-2xl font-semibold">Electricity consumption overview</h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                The hardware-assisted control system is reducing consumption while keeping rooms comfortable.
              </p>
            </div>
            <div className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
              Saved {totalSaved} kWh this term
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
            <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Electricity consumption</h2>
                <span className="text-sm text-slate-500 dark:text-slate-400">Last 6 months</span>
              </div>

              <svg viewBox="0 0 360 220" className="mt-4 h-56 w-full">
                {[0, 1, 2, 3].map((line) => (
                  <line
                    key={line}
                    x1="30"
                    x2="330"
                    y1={40 + line * 40}
                    y2={40 + line * 40}
                    stroke="#cbd5e1"
                    strokeDasharray="4 4"
                  />
                ))}

                <polyline
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="3"
                  points={buildPoints(monthlyData, 'baseline')}
                />
                <polyline
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                  points={buildPoints(monthlyData, 'current')}
                />

                {monthlyData.map((item, index) => {
                  const x = 35 + index * 55;
                  const baselineY = 180 - (item.baseline / maxValue) * 120;
                  const currentY = 180 - (item.current / maxValue) * 120;
                  return (
                    <g key={item.month}>
                      <circle cx={x} cy={baselineY} r="4" fill="#f59e0b" />
                      <circle cx={x} cy={currentY} r="4" fill="#10b981" />
                      <text x={x} y="206" textAnchor="middle" className="fill-slate-500 text-[11px]">
                        {item.month}
                      </text>
                    </g>
                  );
                })}
              </svg>

              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Standard usage
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Hardware-assisted usage
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border border-slate-200 bg-emerald-50 p-4 dark:border-slate-800 dark:bg-emerald-950/40">
                <div className="flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-400">
                  <Zap size={16} /> Electricity saved
                </div>
                <p className="mt-3 text-3xl font-semibold text-emerald-700 dark:text-emerald-300">
                  {totalSaved} kWh
                </p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  About {savingsPercent}% less energy than the standard campus baseline.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <ArrowDownRight size={16} /> Monthly impact
                </div>
                <p className="mt-3 text-2xl font-semibold">{Math.round(totalSaved / monthlyData.length)} kWh</p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  Average savings per month with the installed hardware system.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
