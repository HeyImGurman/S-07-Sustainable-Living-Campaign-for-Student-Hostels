import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  gradient: [string, string];
  suffix?: string;
  delay?: number;
}

export default function StatCard({ label, value, icon: Icon, gradient, suffix, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      whileHover={{ y: -2 }}
      className="card card-hover relative overflow-hidden p-5"
    >
      <div
        className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full opacity-15 blur-xl"
        style={{ background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})` }}
      />
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-ink-secondary dark:text-ink-secondary-dark">{label}</p>
        <div
          className="flex h-9 w-9 items-center justify-center rounded-xl text-white"
          style={{ background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})` }}
        >
          <Icon size={17} strokeWidth={2.2} />
        </div>
      </div>
      <p className="mt-3 font-mono text-2xl font-semibold tabular-nums text-ink-primary dark:text-ink-primary-dark">
        {value}
        {suffix && <span className="ml-1 text-sm font-normal text-ink-muted dark:text-ink-muted-dark">{suffix}</span>}
      </p>
    </motion.div>
  );
}
