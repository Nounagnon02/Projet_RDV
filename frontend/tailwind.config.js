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
        // Elsa Coiffure Brand Colors
        primary: '#ca8349',
        'primary-light': '#d89a66',
        'primary-dark': '#b56f35',
        'maroon-dark': '#422927',
        'maroon-light': '#5a3835',
        'background-light': '#f8f7f6',
        'background-dark': '#1f1813',
        'text-dark': '#191410',
        'text-light': '#f8f7f6',
        'accent-bronze': '#8c705a',
        'accent-cream': '#e3dbd3',
      },
      fontFamily: {
        display: ['Newsreader', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.1)',
        'glass-dark': '0 8px 32px rgba(0, 0, 0, 0.3)',
        'primary-glow': '0 4px 14px rgba(202, 131, 73, 0.25)',
      },
      backdropBlur: {
        'glass': '10px',
      },
    },
  },
  plugins: [],
}