/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#102033',
        muted: '#66758a',
        line: '#dce4ee',
        mist: '#f4f8fb',
        teal: '#007f8c',
        green: '#078548',
        amber: '#b77700',
        blue: '#0b5fc1',
        danger: '#c93535',
      },
      boxShadow: {
        panel: '0 10px 30px rgba(18, 40, 67, 0.08)',
      },
      borderRadius: {
        app: '8px',
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
