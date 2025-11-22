/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // ensures Tailwind scans React components
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        pureblack: '#000000',
        blaze: {
          DEFAULT: '#FF6700',
          50: '#FFF4ED',
          100: '#FFE5D6',
          200: '#FFC7AD',
          300: '#FFA984',
          400: '#FF8B5B',
          500: '#FF6700',
          600: '#E65A00',
          700: '#CC4D00',
          800: '#B34000',
          900: '#993300',
        },
        hunter: {
          DEFAULT: '#FF6700',
          orange: '#FF6700',
        },
        gray: {
          950: '#0a0a0a',
        }
      },
      transitionDuration: {
        '400': '400ms',
      },
      scale: {
        '102': '1.02',
      }
    },
  },
  plugins: [],
}
