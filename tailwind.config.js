module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        Inter: ["Inter"],
      },
      fontSize: {
        mob: "20px",
      },
    },
  },

  variants: {
    extend: {
      fontFamily: ["hover", "focus"],
    },
  },

  plugins: [require("@tailwindcss/typography")],
  corePlugins: {
    fontFamily: true,
  },
};
