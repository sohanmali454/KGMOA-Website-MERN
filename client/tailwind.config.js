/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/tw-elements/dist/js/**/*.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Times New Roman"', "Times", "serif"], // Define the custom font family
      },
    },
  },
  plugins: [],
};
