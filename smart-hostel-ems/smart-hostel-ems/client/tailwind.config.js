/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Geist", "Inter", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        emerald: {
          DEFAULT: "#10B981",
          hover: "#059669",
          light: "#34D399",
        },
        success: { light: "#22C55E", dark: "#22C55E" },
        warning: { light: "#F59E0B", dark: "#FBBF24" },
        danger: { light: "#EF4444", dark: "#F87171" },
        info: { light: "#3B82F6", dark: "#60A5FA" },
        surface: {
          bg: "#F8FAFC",
          sidebar: "#FFFFFF",
          card: "#FFFFFF",
          navbar: "#FFFFFF",
          secondary: "#F1F5F9",
          "bg-dark": "#09090B",
          "sidebar-dark": "#111827",
          "card-dark": "#18181B",
          "navbar-dark": "#111827",
          "secondary-dark": "#27272A",
        },
        ink: {
          primary: "#0F172A",
          secondary: "#475569",
          muted: "#94A3B8",
          disabled: "#CBD5E1",
          "primary-dark": "#FAFAFA",
          "secondary-dark": "#D4D4D8",
          "muted-dark": "#A1A1AA",
          "disabled-dark": "#71717A",
        },
        border: {
          DEFAULT: "#E2E8F0",
          divider: "#F1F5F9",
          "dark-default": "#27272A",
          "dark-divider": "#3F3F46",
        },
        status: {
          occupied: "#22C55E",
          vacant: "#64748B",
          "sensor-offline": "#EF4444",
          "relay-active": "#10B981",
          "manual-override": "#3B82F6",
          "occupied-dark": "#4ADE80",
          "vacant-dark": "#A1A1AA",
          "sensor-offline-dark": "#F87171",
          "relay-active-dark": "#34D399",
          "manual-override-dark": "#60A5FA",
        },
        metric: {
          "energy-saved": "#10B981",
          "electricity-usage": "#3B82F6",
          occupancy: "#8B5CF6",
          "empty-rooms": "#94A3B8",
          alerts: "#F59E0B",
          critical: "#EF4444",
        },
      },
      boxShadow: {
        card: "0 1px 2px 0 rgba(15, 23, 42, 0.04), 0 1px 3px 0 rgba(15, 23, 42, 0.06)",
        "card-hover": "0 8px 24px -4px rgba(15, 23, 42, 0.10)",
      },
      borderRadius: {
        card: "18px",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [],
};
