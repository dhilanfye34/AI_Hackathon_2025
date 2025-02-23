/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'eco-green': {
          50: '#ebf9eb',
          100: '#d1f2d1',
          200: '#a4e5a4',
          300: '#6ed66e',
          400: '#3fc43f',
          500: '#2ba22b',
          600: '#228222',
          700: '#1d661d',
          800: '#1a4f1a',
          900: '#163f16',
        },
        'earth': {
          100: '#f7e9d7',
          200: '#e8cba6',
          300: '#d4a97c',
          400: '#c08b5a',
          500: '#a66f3e',
        },
      },
      backgroundImage: {
        'leaf-pattern': "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M30 0c16.569 0 30 13.431 30 30 0 16.569-13.431 30-30 30C13.431 60 0 46.569 0 30 0 13.431 13.431 0 30 0zm0 8c-12.15 0-22 9.85-22 22s9.85 22 22 22 22-9.85 22-22-9.85-22-22-22z\" fill=\"%23198754\" fill-opacity=\"0.05\"/%3E%3C/svg%3E')",
      },
    },
  },
  plugins: [],
}