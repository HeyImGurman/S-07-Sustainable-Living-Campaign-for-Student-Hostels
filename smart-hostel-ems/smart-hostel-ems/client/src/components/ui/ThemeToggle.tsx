import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle color theme"
      className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-border text-ink-secondary transition-colors duration-200 hover:bg-surface-secondary dark:border-border-dark-default dark:text-ink-secondary-dark dark:hover:bg-surface-secondary-dark"
    >
      <motion.div
        key={theme}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.25 }}
      >
        {theme === "light" ? <Moon size={17} /> : <Sun size={17} />}
      </motion.div>
    </button>
  );
}
