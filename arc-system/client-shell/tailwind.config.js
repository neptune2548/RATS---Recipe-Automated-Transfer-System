/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        industrial: {
          dark: '#0f172a',
          surface: '#1e293b',
          border: '#334155',
          primary: '#0284c7',
          success: '#16a34a',
          warning: '#ca8a04',
          danger: '#dc2626'
        }
      }
    },
  },
  plugins: [],
}
