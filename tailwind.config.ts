import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/***/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      keyframes: {
        shake: {
          "0%, 40%, 100%": { rotate: "0deg" },
          "50%, 70%, 90%": { rotate: "10deg" },
          "60%, 80%": { rotate: "-10deg" },
        }
      },
      animation: {
        shake: 'shake 3s ease infinite',
      }
    },
  },
  plugins: [],
};
export default config;
