import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/***/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      keyframes: {
        shake: {
          'from': { rotate: "0%" },
          'to': { rotate: '-10%' },
          // '0%, 100%': { rotate: "0%" },
          // '10%, 30%, 50%, 70%, 90%': { rotate: '-10%' },
          // '20%, 40%, 60%, 80%': { rotate: '10%' },
        }
      },
      animation: {
        shake: 'shake 0.5s ease-in-out infinite',
      }
    },
  },
  plugins: [],
};
export default config;
