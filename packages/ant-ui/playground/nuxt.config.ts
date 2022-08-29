import { defineNuxtConfig } from 'nuxt';
import AntUi from '..';

export default defineNuxtConfig({
  modules: [AntUi, '@nuxtjs/tailwindcss'],

  tailwindcss: {
    config: {
      content: [],
      theme: {
        extend: {
          colors: {
            primary: '#2563eb',
            'primary-light': '#f88b3d',
            'primary-dark': '#1d4ed8',
            secondary: '',
          },
        },
      },
    },
  },
});
