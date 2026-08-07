import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        farm: {
          green: "#4E9F3D",
          darkGreen: "#1E5128",
          soil: "#8B5E3C",
          wetSoil: "#4A3222",
          harvest: "#F4C430",
          wood: "#A0522D",
          skyDay: "#87CEEB",
          skyDusk: "#FF7F50",
          skyNight: "#0B1D3A",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
