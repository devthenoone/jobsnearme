import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#1a73e8",
          dark: "#1557b0",
          light: "#e8f0fe",
        },
      },
      keyframes: {
        pulseIn: {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        pulseIn: "pulseIn 0.4s ease-out",
      },
    },
  },
  plugins: [],
} satisfies Config;
