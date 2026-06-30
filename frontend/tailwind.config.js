/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        cream: "#F9F6F0",
        espresso: "#2C241B",
        stone: "#57534E",
        parchment: "#F4F1EA",
        teak: "#4A3525",
        walnut: "#3A291C",
        brass: "#C59D5F",
        terracotta: "#B35D43",
        borderSubtle: "#E5E0D8"
      },
      fontFamily: {
        serif: ["'Cormorant Garamond'", "serif"],
        sans: ["'Outfit'", "sans-serif"],
        devanagari: ["'Tiro Devanagari Hindi'", "serif"]
      }
    },
  },
  plugins: [],
};
