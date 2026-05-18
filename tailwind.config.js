/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Extend with custom colors if needed
      },
      spacing: {
        // Extend with custom spacing if needed
      },
    },
  },
  plugins: [],
  darkMode: 'class', // Enable dark mode using class strategy
}
