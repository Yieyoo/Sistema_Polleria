/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          50:  '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#d4a017',
          600: '#b8860b',
          700: '#92690a',
          800: '#713f12',
          900: '#422006',
        },
        brand: {
          50:  '#f8f8f8',
          100: '#e8e8e8',
          200: '#d1d1d1',
          300: '#a3a3a3',
          400: '#737373',
          500: '#404040',
          600: '#2d2d2d',
          700: '#1a1a1a',
          800: '#111111',
          900: '#0a0a0a',
        },
      },
      fontFamily: {
        display: ['Georgia', 'serif'],
      },
      animation: {
        'slide-in':  'slideIn 0.3s ease-out',
        'fade-in':   'fadeIn 0.4s ease-out',
        'bounce-in': 'bounceIn 0.35s ease-out',
      },
      keyframes: {
        slideIn: {
          from: { transform: 'translateX(100%)' },
          to:   { transform: 'translateX(0)' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        bounceIn: {
          '0%':   { transform: 'scale(0.8)', opacity: '0' },
          '70%':  { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)',   opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
