import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Syne', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      colors: {
        // Deep, oxidized slates—no pure black.
        base: '#090A0F',
        surface: {
          DEFAULT: '#12141A',
          hover: '#181A22',
          active: '#1E212B',
          sunken: '#050508', // For the code runner to sink into the screen
        },
        border: {
          dim: '#1A1C23',
          base: '#252830',
          strong: '#3A3F4C',
        },
        text: {
          primary: '#E4E4F0',
          secondary: '#888898',
          muted: '#555568',
        },
        accent: {
          green: '#00FF66',
          blue: '#4DA6FF',
          yellow: '#FFD166',
          red: '#FF4466',
          purple: '#C77DFF',
        },
      },
      boxShadow: {
        // Outer glows for active states
        'glow-green': '0 0 20px rgba(0,255,102,0.15), 0 0 40px rgba(0,255,102,0.05)',
        'glow-blue': '0 0 20px rgba(77,166,255,0.15), 0 0 40px rgba(77,166,255,0.05)',
        // Inner shadows for physical depth (hardware feel)
        'sunken': 'inset 0 2px 10px rgba(0,0,0,0.6), inset 0 1px 0 rgba(0,0,0,0.8)',
        'plate': 'inset 0 1px 0 rgba(255,255,255,0.04), 0 4px 12px rgba(0,0,0,0.4)',
      },
      animation: {
        'fade-up': 'fadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan-line': 'scan 2s linear infinite',
        'typewriter': 'typewriter 2s steps(40) forwards',
        'blink': 'blink 1s step-end infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
        typewriter: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        }
      },
    },
  },
  plugins: [],
} satisfies Config;
