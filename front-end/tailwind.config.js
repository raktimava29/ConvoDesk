/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      backgroundImage: {
        'custom-bg': "url('./clouds.jpg')",
      },
      fontFamily:{
        suse: ['SUSE'],
      }
    },
  },
  plugins: [],
}

