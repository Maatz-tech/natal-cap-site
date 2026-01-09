/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./*/index.html",
    "./script/**/*.js",
    "./*.js",
    "./*/index.js"
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors
        primary: {
          DEFAULT: '#db1526',
          dark: '#8a0900',
        },
        secondary: {
          DEFAULT: '#fcc200',
          dark: '#fc9700',
        },
        // Surface/Background colors
        surface: {
          white: '#ffffff',
          light: '#f9fafb',
          muted: '#f3f4f6',
          gray: '#f5f5f5',
        },
        'surface-gray': '#f5f5f5',
        // Text colors
        heading: '#19191a',
        body: '#7b7d84',
        muted: '#9ca3af',
        subtle: '#797979',
        label: '#6b7280',
        // Border colors
        border: {
          DEFAULT: '#e5e5e6',
          light: '#f3f4f6',
          muted: '#e5e7eb',
        },
      },
      fontFamily: {
        figtree: ['Figtree', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
