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
        background: "#f8faf8",
        surface: "#ffffff",
        "surface-light": "#f0f4f0",
        border: "#d0dcd0",
        primary: "#16a34a",
        "primary-dark": "#15803d",
        success: "#16a34a",
        danger: "#dc2626",
        text: {
          primary: "#0f172a",
          secondary: "#475569",
          tertiary: "#64748b",
        },
      },
    },
  },
  plugins: [],
};
export default config;
