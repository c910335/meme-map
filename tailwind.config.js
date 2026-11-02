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
        dark: {
          bg: '#0B0F17',
          surface: '#131A26',
          card: '#1B2433',
          border: '#2A3649',
          muted: '#8B9BB4'
        },
        brand: {
          accent: '#38BDF8', // Sky cyan
          gold: '#FBBF24',
          crimson: '#F43F5E',
          emerald: '#10B981',
          purple: '#A855F7'
        }
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Noto Sans TC"',
          '"PingFang TC"',
          '"Microsoft JhengHei"',
          'sans-serif'
        ]
      }
    },
  },
  plugins: [],
}
