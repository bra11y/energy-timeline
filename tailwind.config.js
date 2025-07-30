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
      colors: {
        energy: {
          high: '#256EFF',
          medium: '#DC8F69',
          low: '#B7148E',
        }
      },
      spacing: {
        'timeline-margin-left': '80px',
        'timeline-margin-right': '200px',
        'timeline-margin-top': '40px',
        'timeline-margin-bottom': '40px',
      },
      zIndex: {
        'timeline-grid': '10',
        'timeline-highlights': '30',
        'timeline-tooltip': '40',
        'timeline-calendar': '50',
      },
      opacity: {
        'grid': '0.04',
        'grid-tick': '0.3',
        'time-label': '0.7',
        'current-time': '0.8',
      },
      backdropBlur: {
        'timeline': '4px',
      }
    },
  },
  plugins: [],
}

