/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");
module.exports = withMT({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      dropShadow: {
        neon: "0 0 8px rgba(255, 255, 255, 0.4)",
        neonDark: "0 0 5px rgba(0, 0, 0, 0.5)",
        'neon-cyan': "0 0 8px rgba(34,211,238,0.5)",
        'neon-cyan-sm': "0 0 5px rgba(34,211,238,0.3)",
        'neon-cyan-lg': "0 0 15px rgba(34,211,238,0.5)",
      },
      colors: {
        'neon-cyan': {
          light: 'rgba(34,211,238,0.3)',
          DEFAULT: 'rgba(34,211,238,0.5)',
          dark: 'rgba(34,211,238,0.7)',
        },
      },
      boxShadow: {
        'neon-cyan': '0 0 15px rgba(34,211,238,0.3)',
        'neon-cyan-lg': '0 0 30px rgba(34,211,238,0.15)',
        'neon-cyan-inset': 'inset 0 0 20px rgba(34,211,238,0.1)',
        'glow': '0 0 8px rgba(107, 114, 128, 0.6)',
      },
      keyframes: {
        'pulse-gold': {
          '0%': { boxShadow: '0 0 0 0 rgba(255, 215, 0, 0.7)' },
          '70%': { boxShadow: '0 0 0 10px rgba(255, 215, 0, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(255, 215, 0, 0)' },
        },
      },
      animation: {
        'pulse-gold': 'pulse-gold 2s ease-in-out',
      },
    },
  },
  darkMode: "class",
  plugins: [require("tailwind-scrollbar-hide")],
});
