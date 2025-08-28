/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // ensures Tailwind scans React components
  ],
  theme: {
    extend: {
      colors: {
        pureblack: '#000000'
      }
    },
  },
  plugins: [],
}
