/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        sorbet: {
          dark: '#2d1a22', // Darker for better text contrast
          red: '#e04556',  // Slightly deeper red
          pink: '#fca59b', // Adjusted for visibility
          peach: '#ffdccc',
          cream: '#fff9ec',
        }
      },
      fontFamily: {
        sans: ['Timeburner', 'sans-serif'],
        display: ['Viafont', 'sans-serif'],
        title: ['Urba', 'sans-serif'],
        'timeburner-bold': ['TimeburnerBold', 'sans-serif'],
      }
    }
  },
  plugins: []
};
