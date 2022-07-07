import { defineNuxtConfig } from "nuxt";
import AntifyUi from "..";

export default defineNuxtConfig({
  modules: [AntifyUi],
  anitfyUi: {
    addPlugin: true,
  },
  components: true,
});
