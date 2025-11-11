// tailwind.config.js
export default {
    darkMode: 'media', // uses prefers-color-scheme
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
      extend: {
        keyframes: {
          floatY: {
            '0%, 100%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(-20px)' },
          },
        },
        animation: {
          float: 'floatY 4s ease-in-out infinite',
        },
      },
    },
    plugins: [],
  }