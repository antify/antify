import { defineNuxtPlugin } from "#app";
import { AntifyUi } from "@antify/antify-ui";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(AntifyUi);
});
