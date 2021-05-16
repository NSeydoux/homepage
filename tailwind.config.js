const colors = require('tailwindcss/colors')

module.exports = {
  purge: [
    './_site/**/*.html',
    './_site/**/*.js',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      black: colors.black,
      red: {
        dark: '#e43d40',
        main: '#f37970',
        bright: '#f85c70',
        light: '#fabec0',
      }
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    // preflight: false,
  }
}