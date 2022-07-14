import { defineNuxtPlugin } from "#app";
import { Plugin } from "@antify/antify-ui";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Plugin);
});
