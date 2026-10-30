/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#10243A',
          'navy-light': '#1A3654',
          'navy-dark': '#0B1827',
          orange: '#F97316',
          'orange-hover': '#EA580C',
          'orange-light': '#FFF7ED',
          'orange-border': '#FED7AA',
          surface: '#F8FAFC',
          card: '#FFFFFF',
          border: '#E2E8F0',
          muted: '#64748B',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(16, 36, 58, 0.05), 0 1px 2px -1px rgba(16, 36, 58, 0.05)',
        'premium': '0 4px 20px -2px rgba(16, 36, 58, 0.08), 0 2px 6px -1px rgba(16, 36, 58, 0.04)',
        'elevated': '0 20px 25px -5px rgba(16, 36, 58, 0.1), 0 8px 10px -6px rgba(16, 36, 58, 0.06)',
      }
    },
  },
  plugins: [],
}
