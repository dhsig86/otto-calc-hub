/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        otto: {
          primary: '#00A0AF',
          secondary: '#5CC6BA',
          accent: '#00BCD4'
        }
      }
    },
  },
  plugins: [],
}
