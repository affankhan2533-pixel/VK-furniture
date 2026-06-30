/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        "primary-dark": "var(--primary-dark)",
        dark: "var(--dark)",
        "dark-light": "var(--dark-light)",
        light: "var(--light)",
        brandGray: "var(--gray)",
        white: "var(--white)",
        // Compatibility variables
        cream: "var(--light)",
        espresso: "var(--dark)",
        stone: "var(--gray)",
        parchment: "rgba(176, 141, 87, 0.05)",
        teak: "var(--primary-dark)",
        walnut: "#8C6A3F",
        brass: "var(--primary)",
        borderSubtle: "var(--border-theme)"
      },
      fontFamily: {
        serif: ["'Playfair Display'", "serif"],
        sans: ["'Inter'", "sans-serif"],
        devanagari: ["'Tiro Devanagari Hindi'", "serif"]
      }
    },
  },
  plugins: [],
};
