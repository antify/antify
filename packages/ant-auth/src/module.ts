import { resolve } from 'path';
import { fileURLToPath } from 'url';
import {
  defineNuxtModule,
  addPlugin,
  addAutoImport,
  extendViteConfig,
  resolveModule,
} from '@nuxt/kit';
import { join } from 'pathe';
import { name, version } from '../package.json';

export interface ModuleOptions {
  addPlugin: boolean;
}

const CONFIG_KEY = 'ant-auth' as const;

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    configKey: CONFIG_KEY,
  },
  setup(options, nuxt) {
    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url));

    nuxt.hook('nitro:config', (nitroConfig) => {
      if (!nitroConfig.autoImport) {
        nitroConfig.autoImport = {
          imports: [],
        };
      }

      // nitroConfig.autoImport.imports.push({
      //   name: 'useValidator',
      //   as: 'useValidator',
      //   from: join(runtimeDir, 'glue', 'useValidator'),
      // });
    });

    nuxt.hook('antDatabase:before:loadSchemas', (schemas) => {
      schemas.core.inputs.push(resolve(runtimeDir, 'core', 'schema.prisma'));
    });
  },
});
