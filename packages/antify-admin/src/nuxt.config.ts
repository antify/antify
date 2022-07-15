import { defineNuxtConfig } from "nuxt";

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  tailwindcss: {
    config: {
      // plugins: [tailwindForms],
      content: [
        // TODO:: find a smarter way
        "../../packages/**/components/**/*.{js,vue,ts}",
        "../../packages/**/layouts/**/*.vue",
        "../../packages/**/pages/**/*.vue",
        "../../packages/**/plugins/**/*.{js,ts}",
        // "../../packages/**/nuxt.config.{js,ts}",

        "../../playground/**/components/**/*.{js,vue,ts}",
        "../../playground/**/layouts/**/*.vue",
        "../../playground/**/pages/**/*.vue",
        "../../playground/**/plugins/**/*.{js,ts}",
        // Next line throw an error. Discussion here https://github.com/nuxt-community/tailwindcss-module/issues/429
        // "../../playground/**/nuxt.config.{js,ts}",

        "./node_modules/@antify/antify-ui/dist/components/**/*.{js,vue,ts}",
        "./node_modules/@antify/antify-ui/dist/index.{js,vue,ts}",
      ],
    },
  },
  // TODO:: remove me an replace with antify-ui
  buildModules: ["@nuxtjs/tailwindcss"],
  plugins: ["~/plugins/antify-ui.ts"],
  privateRuntimeConfig: {
    passwordSalt: process.env.PASSWORD_SALT,
  },

  modules: [
  ],
});
