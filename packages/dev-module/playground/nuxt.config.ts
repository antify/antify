import Module from '..';

export default defineNuxtConfig({
  modules: [
    Module,
    // TODO:: remove me and replace with antify-ui
    '@nuxtjs/tailwindcss'
  ],
  antDev: {

  },
  tailwindcss: {
    config: {
      // plugins: [tailwindForms],
      content: [
        // TODO:: find a smarter way
        '../../../packages/**/components/**/*.{js,vue,ts}',
        '../../../packages/**/layouts/**/*.vue',
        '../../../packages/**/pages/**/*.vue',
        '../../../packages/**/plugins/**/*.{js,ts}',
        // "../../../packages/**/nuxt.config.{js,ts}",

        '../../../playground/**/components/**/*.{js,vue,ts}',
        '../../../playground/**/layouts/**/*.vue',
        '../../../playground/**/pages/**/*.vue',
        '../../../playground/**/plugins/**/*.{js,ts}',
        // Next line throw an error. Discussion here https://github.com/nuxt-community/tailwindcss-module/issues/429
        // "../../../playground/**/nuxt.config.{js,ts}",

        './node_modules/@antify/antify-ui/dist/components/**/*.{js,vue,ts}',
        './node_modules/@antify/antify-ui/dist/index.{js,vue,ts}'
      ]
    }
  }
});
