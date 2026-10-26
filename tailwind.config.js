/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        parchment: '#F5F2EB',
        cream: '#FAF8F5',
        surface: '#EFEAE0',
        ink: {
          DEFAULT: '#16120E',
          secondary: '#5C554E',
          muted: '#8C847A',
        },
        gold: {
          DEFAULT: '#D4AF37',
          deep: '#9C7238',
          light: '#EED9A0',
        },
        crimson: {
          DEFAULT: '#6E141B',
          deep: '#520E14',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['Outfit', 'Inter', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
