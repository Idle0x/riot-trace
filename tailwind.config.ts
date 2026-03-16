import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#020205",
        surf: "#0A0A0F",
        surf2: "#12121A",
        border: "#1A1A24",
        border2: "#2A2A35",
        text: "#EAEAEA",
        muted: "#8A8A9E",
        riotGreen: "#00FF66",
        riotBlue: "#00E5FF",
        riotRed: "#FF3366",
        riotYellow: "#FFD600"
      },
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'monospace'],
      }
    },
  },
  plugins: [],
};
export default config;
