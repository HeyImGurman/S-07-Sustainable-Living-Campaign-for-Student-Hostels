const TONE_CLASSES = {
  occupied: "bg-status-occupied/10 text-status-occupied dark:bg-status-occupied-dark/15 dark:text-status-occupied-dark",
  vacant: "bg-status-vacant/10 text-status-vacant dark:bg-status-vacant-dark/15 dark:text-status-vacant-dark",
  offline: "bg-status-sensor-offline/10 text-status-sensor-offline dark:bg-status-sensor-offline-dark/15 dark:text-status-sensor-offline-dark",
  active: "bg-status-relay-active/10 text-status-relay-active dark:bg-status-relay-active-dark/15 dark:text-status-relay-active-dark",
  override: "bg-status-manual-override/10 text-status-manual-override dark:bg-status-manual-override-dark/15 dark:text-status-manual-override-dark",
  warning: "bg-warning-light/10 text-warning-light dark:bg-warning-dark/15 dark:text-warning-dark",
  fault: "bg-danger-light/10 text-danger-light dark:bg-danger-dark/15 dark:text-danger-dark",
};

export default function Badge({ children, tone }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${TONE_CLASSES[tone]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}