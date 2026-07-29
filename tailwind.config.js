/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#182347',
        muted: '#68728f',
        line: '#e3def2',
        mist: '#fffaf0',
        teal: '#16a99a',
        green: '#22a866',
        amber: '#e99a1c',
        blue: '#3857df',
        danger: '#e65266',
      },
      boxShadow: {
        panel: '0 12px 30px rgba(54, 68, 163, 0.12)',
      },
      borderRadius: {
        app: '16px',
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};
