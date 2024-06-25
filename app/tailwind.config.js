/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontSize: {
        sm: "0.3em",
        base: "0.5em",
        lg: "0.75em",
        xl: "1em",
      },
    },
  },
  plugins: [],
};
