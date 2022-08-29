import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { defineNuxtModule, addPlugin } from '@nuxt/kit';
import tailwindcssForms from '@tailwindcss/forms';

export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'ant-ui',
    configKey: 'antUi',
  },
  defaults: {},
  async setup(options, nuxt) {
    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url));
    nuxt.options.build.transpile.push(runtimeDir);

    console.log(import.meta.url);
    addPlugin(resolve(runtimeDir, 'plugin'));

    // @ts-ignore
    nuxt.hook('tailwindcss:config', function (tailwindConfig) {
      tailwindConfig.content.push(
        resolve(
          runtimeDir,
          '../../node_modules/@antify/antify-ui/dist/components/**/*.{js,vue,ts}'
        )
      );
      tailwindConfig.content.push(
        resolve(
          runtimeDir,
          '../../node_modules/@antify/antify-ui/dist/index.{js,vue,ts}'
        )
      );

      tailwindConfig.plugins.push(tailwindcssForms);

      if (!tailwindConfig.theme) {
        tailwindConfig.theme = {};
      }

      if (!tailwindConfig.theme.extend) {
        tailwindConfig.theme.extend = {};
      }

      tailwindConfig.theme.extend.minHeight = {
        2: '0.5rem',
        14: '3.5rem',
        16: '4rem',
        32: '8rem',
        48: '12rem',
      };
      tailwindConfig.theme.extend.minWidth = {
        16: '4rem',
        32: '8rem',
        48: '12rem',
        80: '20rem',
        96: '24rem',
      };
      tailwindConfig.theme.extend.maxWidth = {
        16: '4rem',
      };

      tailwindConfig.theme.extend.colors = {
        primary: '#2563eb',
        'primary-light': '#f88b3d',
        'primary-dark': '#1d4ed8',
        secondary: '',
      };

      tailwindConfig._hash = String(Date.now());

      console.log('new config, ', tailwindConfig);
    });
  },
});
