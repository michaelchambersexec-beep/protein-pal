/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0a0a0a',
        card: '#1a1a1a',
        card2: '#222',
        accent: '#5b8dee',
        accentDim: '#3a6dd0',
        muted: '#9aa0aa',
        danger: '#ef4444',
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        app: '430px',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        pop: {
          '0%': { transform: 'scale(0.9)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
      },
      animation: {
        slideUp: 'slideUp 280ms cubic-bezier(0.22, 1, 0.36, 1)',
        fadeIn: 'fadeIn 200ms ease-out',
        pop: 'pop 180ms ease-out',
      },
    },
  },
  plugins: [],
};
