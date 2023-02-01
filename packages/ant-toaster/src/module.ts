import { fileURLToPath } from 'url';
import { defineNuxtModule, createResolver, addPlugin } from '@nuxt/kit';

type ModuleOptions = {
  messageShowTime: number;
};

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'ant-toaster-module',
    configKey: 'antToasterModule',
  },
  async setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url);
    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url));
    const defaultOptions: ModuleOptions = {
      messageShowTime: 4000,
    };

    addPlugin(resolve(runtimeDir, 'plugins/toaster'));

    nuxt.options.runtimeConfig.public.antToaster = {
      ...defaultOptions,
      ...options,
    };
  },
});
