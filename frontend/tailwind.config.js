/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#075C35',
          dark: '#063D29',
          light: '#0b7947',
          hover: '#053121',
        },
        cream: {
          DEFAULT: '#FAF8F1',
          card: '#FFFFFF',
          dark: '#F3EFE3',
        },
        mustard: {
          DEFAULT: '#E8C928',
          hover: '#d4b71f',
          light: '#FBF4CC',
        },
        charcoal: {
          DEFAULT: '#20251F',
          muted: '#72776F',
          border: '#E3E0D6',
        },
        veg: '#15803d',
      },
      fontFamily: {
        serif: ['"Outfit"', 'ui-serif', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 20px -2px rgba(6, 61, 41, 0.06), 0 2px 6px -1px rgba(6, 61, 41, 0.04)',
        'card-hover': '0 12px 32px -4px rgba(6, 61, 41, 0.12), 0 4px 12px -2px rgba(6, 61, 41, 0.08)',
        modal: '0 20px 50px -12px rgba(6, 61, 41, 0.25)',
      },
    },
  },
  plugins: [],
}
