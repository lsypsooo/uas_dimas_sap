/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}", // Perhatikan, kita ganti .ts/.tsx menjadi .js/.jsx
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
