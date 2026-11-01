/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#8B5CF6',
          lavender: '#C4B5FD'
        },
        accent: {
          lime: '#C6F66A',
          green: '#A3E635'
        },
        background: '#F5F3EE',
        surface: '#FFFFFF',
        dark: '#171717',
        loss: '#FF6B6B',
        warning: '#FBBF24',
        neutral: '#94A3B8',
        info: '#60A5FA'
      },
      fontFamily: {
        'jakarta': ['Plus Jakarta Sans', 'sans-serif']
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '32px',
        '3xl': '40px'
      },
      borderRadius: {
        'card': '16px',
        'button': '12px'
      },
      boxShadow: {
        'brutal': '4px 4px 0px #171717',
        'brutal-lg': '5px 5px 0px #171717'
      }
    },
  },
  plugins: [],
}
