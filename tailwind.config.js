/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'inclusive': ['Inclusive Sans', 'sans-serif'],
      },
      animation: {
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      colors: {
        energy: {
          high: '#256EFF',
          medium: '#DC8F69',
          low: '#B7148E'
        }
      },
    },
  },
  plugins: [],
}

