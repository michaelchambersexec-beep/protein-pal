/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Surfaces (dark base so colors pop)
        bg:      'oklch(0.12 0.025 280)',   // page (dark plum)
        surface: 'oklch(0.16 0.025 280)',   // card
        raised:  'oklch(0.20 0.025 280)',   // input / chip
        line:    'oklch(0.26 0.025 280)',   // divider

        // Ink
        ink:   'oklch(0.97 0.01 280)',
        ink2:  'oklch(0.82 0.01 280)',
        ink3:  'oklch(0.62 0.01 280)',
        ink4:  'oklch(0.42 0.01 280)',

        // Brand vibrants (use sparingly, with intention)
        violet:  'oklch(0.66 0.22 295)',
        purple:  'oklch(0.58 0.24 305)',
        indigo:  'oklch(0.58 0.22 270)',
        sky:     'oklch(0.74 0.16 230)',
        cyan:    'oklch(0.80 0.15 200)',
        mint:    'oklch(0.83 0.16 165)',
        lime:    'oklch(0.88 0.20 130)',
        yellow:  'oklch(0.88 0.18 90)',
        orange:  'oklch(0.74 0.20 50)',
        coral:   'oklch(0.72 0.22 25)',
        pink:    'oklch(0.78 0.20 0)',
        hotpink: 'oklch(0.70 0.25 350)',

        // Legacy aliases (don't break existing class names)
        card:   'oklch(0.16 0.025 280)',
        card2:  'oklch(0.20 0.025 280)',
        muted:  'oklch(0.62 0.01 280)',
        accent: 'oklch(0.66 0.22 295)',
        danger: 'oklch(0.66 0.22 22)',
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }],
      },
      letterSpacing: {
        micro: '0.16em',
      },
      maxWidth: {
        app: '430px',
      },
      backgroundImage: {
        'hero-stage-0': 'linear-gradient(140deg, oklch(0.78 0.12 280) 0%, oklch(0.62 0.18 260) 100%)',
        'hero-stage-1': 'linear-gradient(140deg, oklch(0.86 0.14 95)  0%, oklch(0.70 0.20 45)  100%)',
        'hero-stage-2': 'linear-gradient(140deg, oklch(0.86 0.16 160) 0%, oklch(0.64 0.20 200) 100%)',
        'hero-stage-3': 'linear-gradient(140deg, oklch(0.78 0.18 220) 0%, oklch(0.58 0.24 280) 100%)',
        'hero-stage-4': 'linear-gradient(140deg, oklch(0.70 0.22 320) 0%, oklch(0.55 0.24 290) 100%)',
        'hero-stage-5': 'linear-gradient(140deg, oklch(0.88 0.18 80)  0%, oklch(0.70 0.22 30)  100%)',
        'hero-stage-6': 'linear-gradient(140deg, oklch(0.74 0.24 12)  0%, oklch(0.55 0.26 350) 100%)',
      },
      keyframes: {
        slideUp:  { '0%': { transform: 'translateY(100%)' }, '100%': { transform: 'translateY(0)' } },
        fadeIn:   { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        pop:      { '0%': { transform: 'scale(0.94)', opacity: 0 }, '60%': { transform: 'scale(1.04)', opacity: 1 }, '100%': { transform: 'scale(1)', opacity: 1 } },
        wiggle:   { '0%,100%': { transform: 'rotate(-2deg)' }, '50%': { transform: 'rotate(2deg)' } },
        twinkle:  { '0%,100%': { opacity: 0.35, transform: 'scale(0.9)' }, '50%': { opacity: 1, transform: 'scale(1.1)' } },
      },
      animation: {
        slideUp: 'slideUp 360ms cubic-bezier(0.16, 1, 0.3, 1)',
        fadeIn:  'fadeIn 220ms ease-out',
        pop:     'pop 380ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        wiggle:  'wiggle 600ms ease-in-out',
        twinkle: 'twinkle 1600ms ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
