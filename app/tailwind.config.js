/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontSize: {
        base: "0.5em",
        lg: "0.7em",
        xl: "1em",
      },
    },
  },
  plugins: [],
};
