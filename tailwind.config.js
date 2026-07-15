/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#0a0a0f',
          card: 'rgba(255,255,255,0.03)',
          hover: 'rgba(255,255,255,0.06)',
        },
        accent: {
          from: '#6366f1',
          to: '#8b5cf6',
        },
        text: {
          primary: '#f1f5f9',
          secondary: '#94a3b8',
          muted: '#64748b',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-accent': 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        'gradient-surface': 'linear-gradient(180deg, #0a0a0f, #1a1a2e)',
      }
    },
  },
  plugins: [],
}
