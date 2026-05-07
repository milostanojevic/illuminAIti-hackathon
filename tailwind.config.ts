import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bk: {
          primary: "#1a2b6b",
          accent: "#00d8c8",
          mint: "#4dd9ac",
          red: "#c8102e",
          dark: "#0d1a3a",
          onAccent: "#003030",
        },
        ss: {
          primary: "#1a2db8",
          accent: "#FFCD00",
          deep: "#0d1580",
          blue: "#2a3dc8",
          /** Selection chips, soft panels (MUI-ish surface tint) */
          muted: "#eef2ff",
          /** Carousel / pills on white */
          navWell: "#eef1fb",
          /** Primary headings on light surfaces */
          ink: "#1a1a2e",
          /** Label on amber primary CTA — matches deep blue */
          onAccent: "#0d1580",
          dotMuted: "#d8dbe5",
        },
      },
      keyframes: {
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
        spin: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        pulse: "pulse 1.8s infinite",
        spin: "spin 0.8s linear infinite",
        fadeUp: "fadeUp 0.35s ease both",
      },
    },
  },
  plugins: [],
};

export default config;
