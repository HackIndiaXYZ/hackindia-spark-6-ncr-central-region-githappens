/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          glow: "var(--primary-glow)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          glow: "var(--secondary-glow)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          glow: "var(--accent-glow)",
        },
        surface: {
          DEFAULT: "var(--surface)",
          low: "var(--surface-low)",
          high: "var(--surface-high)",
          highest: "var(--surface-highest)",
        },
        muted: "var(--text-muted)",
        border: {
          DEFAULT: "var(--border)",
          muted: "var(--border-muted)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui"],
        headline: ["var(--font-headline)", "system-ui"],
        mono: ["var(--font-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};
