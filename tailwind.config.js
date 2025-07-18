/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    fontFamily: {
      sans: ['Tajawal', 'sans-serif'],
    },
    extend: {
      colors: {
        'primary-purple': '#6B46C1',
        'secondary-purple': '#8B5CF6',
        'accent-orange': '#facc15',
        'header-blue': '#2B2A7F',
        'light-purple': '#F3F4FF',
        'text-dark': '#1F2937',
        'background': '#FFFFFF',
        'border-purple': '#6B46C1',
        'button-blue': '#2B2A7F',
        'button-yellow': '#facc15',
      },
      borderWidth: {
        '3': '3px',
        '6': '6px',
      },
      fontWeight: {
        'extrabold': '800',
      },
      boxShadow: {
        'card': '0 4px 16px 0 rgba(107,70,193,0.08)',
        'button': '0 2px 8px 0 rgba(107,70,193,0.12)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
} 