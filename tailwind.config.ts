import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ["IBM Plex Mono", "Fira Code", "monospace"],
        sans: ["IBM Plex Sans", "system-ui", "sans-serif"],
      },
      colors: {
        bg: "#05050A",
        surf: "#0A0A12",
        surf2: "#12121D",
        border: "#1A1A2A",
        border2: "#2A2A3A",
        text: "#E0E0E0",
        muted: "#6B6B80",
        riotGreen: "#00FF66",
        riotBlue: "#00E5FF",
        riotRed: "#FF3366",
        riotYellow: "#FFCC00",
      },
      animation: {
        fadeUp: "fadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
