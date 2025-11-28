/** @type {import('tailwindcss').Config} */

export default {

  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {

    extend: {

      colors: {

        petPink: '#EC4899',

        petYellow: '#F59E0B',

        petBlue: '#3B82F6',

      },

      animation: {

        'bounce-slow': 'bounce 3s infinite',

      }

    },

  },

  plugins: [],

}