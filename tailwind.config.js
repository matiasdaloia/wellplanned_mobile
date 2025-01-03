const colors = require("./components/ui/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        sans: ["OpensansRegular", "sans-serif"],
        bodyLight: ["OpensansLight", "sans-serif"],
        bodyRegular: ["OpensansRegular", "sans-serif"],
        bodyBold: ["OpensansBold", "sans-serif"],
        titleRegular: ["PlayfairRegular", "serif"],
        titleBold: ["PlayfairBold", "serif"],
        titleBlack: ["PlayfairBlack", "serif"],
      },
      colors,
    },
  },
  plugins: [],
};

