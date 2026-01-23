/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'cad': {
          'steel': '#475569',
          'blue': '#2563eb',
          'orange': '#ea580c',
          'bg': '#f1f5f9',
          'dark': '#0f172a',
        }
      },
      fontFamily: {
        'mono': ['"JetBrains Mono"', 'monospace'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
