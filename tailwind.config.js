/** @type {import('tailwindcss').Config} */

// import { Colors } from './constants/Colors'

module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        light: {
          primaryText: 'rgb(110,110,110)',
          secondaryText: 'rgb(155,155,155)',
          highlightedText: 'rgb(20,20,20)',
          primaryBackground: 'rgb(255,255,255)',
          secondaryBackground: 'rgb(235,235,235)',
          highlightedBackground: 'rgb(245,245,245)',
        },
        dark: {
          primaryText: 'rgb(195,195,195)',
          secondaryText: 'rgb(110,110,110)',
          highlightedText: 'rgb(245,245,245)',
          primaryBackground: 'rgb(30,30,30)',
          secondaryBackground: 'rgb(20,20,20)',
          highlightedBackground: 'rgb(45,45,45)',
        },
      },
    },
  },
  plugins: [],
}

