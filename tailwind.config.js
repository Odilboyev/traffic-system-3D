/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");
module.exports = withMT({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // ringColor: {
      //   "green-300": "#3b82f6",
      //   "gray-300": "#e5e7eb",
      //   "yellow-300": "#fbbf24",
      //   "red-300": "#f87171",
      // },
      boxShadow: {
        neon: "0 0 10px rgba(255, 255, 255, 0.3)",
      },
    },
  },
  darkMode: "class",
});
