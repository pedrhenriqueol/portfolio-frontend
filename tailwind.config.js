/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: '#0B0C10',
        darker: '#1F2833',
        primary: '#C5C6C7',
        secondary: '#66FCF1',
        accent: '#45A29E',
        light: '#E0E2E4',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
