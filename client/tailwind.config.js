/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        lck: {
          dark: '#0c0e14',
          card: '#161922',
          gold: '#c8aa6e',
          accent: '#00c3ff',
        },
      },
    },
  },
  plugins: [],
};
