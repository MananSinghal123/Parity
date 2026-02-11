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
        background: "#0b0e11",
        surface: "#161a1e",
        "surface-light": "#1e2329",
        border: "#2b3139",
        primary: "#f0b90b",
        "primary-dark": "#c99400",
        success: "#0ecb81",
        danger: "#f6465d",
        text: {
          primary: "#eaecef",
          secondary: "#848e9c",
          tertiary: "#5e6673",
        },
      },
    },
  },
  plugins: [],
};
export default config;
