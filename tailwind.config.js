/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  mode: "jit",
  theme: {
    extend: {
      gridTemplateColumns: {
        'auto-fit': 'repeat(auto-fit,minmax(15rem,1fr))', //to automatic adjust grid layout
      },

      animation: {
        blob: "bolb 7s infinite",
      },

      keyframes: {
        bolb: {
          "0%": {
            transform: "scale(1) translate(0px,0px)",
          },
          "33%": {
            transform: "scale(1.1) translate(10px,-10px)",
          },
          "66%": {
            transform: "scale(0.9) translate(-10px,10px)",
          },
          "100%": {
            transform: "scale(1) translate(0px,0px)",
          }
        }
      },

      width: {
        150: "150px",
        190: "190px",
        225: "225px",
        275: "275px",
        300: "300px",
        340: "340px",
        350: "350px",
        375: "375px",
        460: "460px",
        656: "656px",
        880: "880px",
        508: "508px",
      },
      height: {
        80: "80px",
        150: "150px",
        225: "225px",
        300: "300px",
        340: "340px",
        370: "370px",
        420: "420px",
        510: "510px",
        600: "600px",
        650: "650px",
        685: "685px",
        800: "800px",
        "90vh": "90vh",
      },

      colors: {
        primary: "#00040f",
        secondary: "#FF3c00",
        dimGray: "#E8E9ED",
        blackAplha100: "rgba(0, 0, 0, 0.06)",
        blackAplha200: "rgba(0, 0, 0, 0.08)",
        blackAplha300: "rgba(0, 0, 0, 0.16)",
        blackAplha400: "rgba(0, 0, 0, 0.24)",
        blackAplha500: "rgba(0, 0, 0, 0.36)",
        blackAplha600: "rgba(0, 0, 0, 0.48)",
        blackAplha700: "rgba(0, 0, 0, 0.64)",
        blackAplha800: "rgba(0, 0, 0, 0.80)",
        blackAplha900: "rgba(0, 0, 0, 0.90)",
        success: "rgba(34, 197, 94, 0.16)",
        error: "rgba(239, 68, 68, 0.16)",
        info: "rgba(59, 130, 246, 0.16)",
        header: "rgba(255, 255, 255, 0.4)",
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        caveat: ["Caveat", "cursive"],
        chillax: ["Chillax", "sans-serif"],
      },
    },
  },
  plugins: [],
}