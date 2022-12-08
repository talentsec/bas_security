/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      letterSpacing: {
        "1rem": "1em"
      }
    }
  },
  plugins: [require("@tailwindcss/line-clamp")],
  corePlugins: {
    preflight: false
  }
};
