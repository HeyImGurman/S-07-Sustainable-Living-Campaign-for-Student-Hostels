import { useEffect, useState } from 'react';
import { AlertTriangle, Clock3, MapPin } from 'lucide-react';

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/logs.json')
      .then((response) => response.json())
      .then((data) => setLogs(data))
      .catch(() => {
        setLogs([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-6 text-sm text-slate-500">Loading logs...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 text-slate-800 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">System logs</p>
              <h1 className="text-2xl font-semibold">Recent automated events</h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Activity entries loaded locally from the hostel logs data file.
              </p>
            </div>
            <div className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
              {logs.length} entries
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {logs.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                No logs available yet.
              </div>
            ) : (
              logs.map((log) => (
                <div
                  key={log.id}
                  className="flex flex-col gap-3 rounded-xl border border-slate-200 p-4 shadow-sm dark:border-slate-800"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{log.title}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock3 size={14} /> {log.timestamp}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={14} /> {log.location}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold uppercase ${
                        log.severity === 'warning'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                      }`}
                    >
                      {log.severity}
                    </span>
                  </div>
                  {log.severity === 'warning' && (
                    <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                      <AlertTriangle size={16} /> Needs attention
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
