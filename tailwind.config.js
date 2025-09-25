module.exports = {
  content: ["./src/components/**/*.{js,ts,jsx,tsx}", "./src/app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      xs: "320px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      fontFamily: {
        Inter: ["Inter"],
      },
      fontSize: {
        mob: "20px",
      },
      colors: {
        t: {
          darkgreen: "#18981a",
          lightgreen: "#0fd430",
          purple: "#4a2051",
          violet: "#880990",
        },
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
