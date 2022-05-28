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
        mob: "2.5em",
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
