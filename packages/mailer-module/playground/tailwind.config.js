// TODO:: remove it if default config comes from antify ui
module.exports = {
  content: ['./**/*.vue'],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        'primary-light': '#f88b3d',
        'primary-dark': '#1d4ed8',
        secondary: '',
      },
      minHeight: {
        2: '0.5rem',
        14: '3.5rem',
        16: '4rem',
        32: '8rem',
        48: '12rem',
      },
      minWidth: {
        16: '4rem',
        32: '8rem',
        48: '12rem',
        80: '20rem',
        96: '24rem',
      },
      maxWidth: {
        16: '4rem',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
