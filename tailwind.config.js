/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: 'var(--color-brand-50, #f0f9ff)',
          100: 'var(--color-brand-100, #e0f2fe)',
          200: 'var(--color-brand-200, #bae6fd)',
          300: 'var(--color-brand-300, #7dd3fc)',
          400: 'var(--color-brand-400, #38bdf8)',
          500: 'var(--color-brand-500, #0284c7)',
          600: 'var(--color-brand-600, #0369a1)',
          700: 'var(--color-brand-700, #075985)',
          800: 'var(--color-brand-800, #0c4a6e)',
          900: 'var(--color-brand-900, #0a3651)',
        },
        accent: {
          500: 'var(--color-accent-500, #f59e0b)',
          600: 'var(--color-accent-600, #d97706)',
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.08)',
        'premium': '0 20px 40px -15px rgba(2, 132, 199, 0.15)',
      }
    },
  },
  plugins: [],
};
