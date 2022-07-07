import { resolve } from "path";
import { fileURLToPath } from "url";
import { defineNuxtModule, addPlugin, addComponentsDir } from "@nuxt/kit";
import * as path from "path";

export interface ModuleOptions {
  addPlugin: boolean;
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "antify-ui",
    configKey: "anitfyUi",
  },
  defaults: {
    addPlugin: true,
  },
  setup(options, nuxt) {
    console.log("options", options);

    if (options.addPlugin) {
      const runtimeDir = fileURLToPath(new URL("./runtime", import.meta.url));

      nuxt.options.build.transpile.push(runtimeDir);

      addPlugin(resolve(runtimeDir, "plugin"));
    }

    addComponentsDir({ path: resolve("runtime/components") });
  },
});
