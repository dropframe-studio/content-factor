/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        // Pipeline stage colors
        build: '#F97316',
        capture: '#06B6D4',
        transform: '#84CC16',
        publish: '#2563EB',
        measure: '#EC4899',
        // Semantic colors
        background: '#F9FAFB',
        surface: '#FFFFFF',
        border: '#E5E7EB',
      },
      borderRadius: {
        'sm': '0.25rem',
        'md': '0.5rem',
        'lg': '1rem',
        'full': '9999px',
      },
      boxShadow: {
        'sm': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px rgba(0, 0, 0, 0.15)',
        'xl': '0 20px 25px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [],
}