import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        purple1: "#7E5EF2",
        purple2: "#A38DF2",
        purple3: "#B3B6F2",
        green: "#62D98B",
        orange: "#FF6636",
        gray: {
          dark: "#1D2026",
          medium: "#6E7485",
          light: "#F5F7FA",
        },
        searchBackground: "#F5F7FA",
        background: "#F5F7FA",
      },
    },
  },
  plugins: [],
};
export default config;
