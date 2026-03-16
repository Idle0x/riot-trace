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
        bg: {
          base: '#07070f',
          surface: '#0c0c18',
          'surface-2': '#111120',
          'surface-3': '#161628',
        },
        border: {
          dim: '#0d0d1a',
          base: '#111120',
          mid: '#1a1a30',
          strong: '#252540',
        },
        text: {
          primary: '#e4e4f0',
          secondary: '#888898',
          muted: '#555568',
          dim: '#333348',
        },
        accent: {
          green: '#00ffaa',
          blue: '#4da6ff',
          yellow: '#ffd166',
          purple: '#c77dff',
          red: '#ff4466',
          orange: '#ff7b47',
          teal: '#4ecdc4',
          pink: '#f72585',
        },
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '14px',
        xl: '20px',
      },
      animation: {
        fadeUp: 'fadeUp 0.35s ease both',
        fadeIn: 'fadeIn 0.3s ease both',
        scaleIn: 'scaleIn 0.25s ease both',
        scaleInSpring: 'scaleInSpring 0.4s ease both',
        slideInRight: 'slideInRight 0.3s ease both',
        shimmer: 'shimmer 1.8s linear infinite',
        float: 'float 3s ease infinite',
        floatSlow: 'floatSlow 5s ease infinite',
        pulse: 'pulse 2s ease infinite',
        spin: 'spin 0.7s linear infinite',
        glow: 'glow 2s ease infinite',
        gradientShift: 'gradientShift 4s ease infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        scaleInSpring: {
          '0%': { opacity: '0', transform: 'scale(0.88)' },
          '60%': { transform: 'scale(1.03)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(110%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-6px) rotate(1deg)' },
          '66%': { transform: 'translateY(-3px) rotate(-1deg)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 8px rgba(0,255,170,0.2)' },
          '50%': { boxShadow: '0 0 24px rgba(0,255,170,0.5), 0 0 48px rgba(0,255,170,0.15)' },
        },
        gradientShift: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
      backgroundImage: {
        'dots': "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)",
        'dots-green': "radial-gradient(rgba(0,255,170,0.06) 1.5px, transparent 1.5px)",
        'grid': "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
        'glow-green': "radial-gradient(ellipse 60% 40% at 50% -10%, rgba(0,255,170,0.12), transparent)",
        'glow-blue': "radial-gradient(ellipse 60% 40% at 80% 20%, rgba(77,166,255,0.08), transparent)",
        'aurora': "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0,255,170,0.08), transparent 70%), radial-gradient(ellipse 60% 40% at 80% 100%, rgba(77,166,255,0.06), transparent 70%)",
      },
      backgroundSize: {
        'dots': '24px 24px',
        'dots-lg': '32px 32px',
        'grid': '40px 40px',
      },
      boxShadow: {
        'glow-green': '0 0 20px rgba(0,255,170,0.15), 0 0 40px rgba(0,255,170,0.05)',
        'glow-blue': '0 0 20px rgba(77,166,255,0.15), 0 0 40px rgba(77,166,255,0.05)',
        'card': '0 4px 20px rgba(0,0,0,0.4)',
        'card-hover': '0 12px 40px rgba(0,0,0,0.5)',
        'inner-top': 'inset 0 1px 0 rgba(255,255,255,0.05)',
      },
    },
  },
  plugins: [],
} satisfies Config;
