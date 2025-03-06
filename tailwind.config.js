/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      textDirection: {
        rtl: 'rtl',
        ltr: 'ltr',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}