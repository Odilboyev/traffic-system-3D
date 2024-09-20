/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");
module.exports = withMT({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      dropShadow: {
        neon: "0 0 8px rgba(255, 255, 255, 0.4)",
        neonDark: "0 0 5px rgba(0, 0, 0, 0.5)",
      },
      colors: {
        green: "#4ade80",
      },
    },
  },
  darkMode: "class",
});
