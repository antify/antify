import { fileURLToPath } from 'url';
import { defineNuxtModule, createResolver, addServerHandler } from '@nuxt/kit';
import { join } from 'path';
import { ModuleOptions, validateModuleOptions } from './buildtime/options';

export { Setting } from './runtime/server/datasources/tenant/setting';
export { Tenant } from './runtime/server/datasources/core/tenant';
export { useCoreClient, Client } from './runtime/server/useCoreClient';
export {
  useTenantClient,
  TenantClient,
} from './runtime/server/useTenantClient';

export interface SomeType {
  id: number;
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'ant-database',
    configKey: 'antDatabase',
  },
  async setup(options, nuxt) {
    validateModuleOptions(options);

    const { resolve } = createResolver(import.meta.url);
    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url));
    nuxt.options.build.transpile.push(runtimeDir);

    nuxt.options.runtimeConfig.antDatabase = options;

    addServerHandler({
      middleware: true,
      handler: resolve(runtimeDir, 'server/middleware/middleware'),
    });

    nuxt.hook('nitro:config', (nitroConfig) => {
      if (!nitroConfig.imports) {
        nitroConfig.imports = {
          imports: [],
        };
      }

      nitroConfig.imports.imports.push({
        name: 'useTenantClient',
        as: 'useTenantClient',
        from: join(runtimeDir, 'server/useTenantClient'),
      });

      nitroConfig.imports.imports.push({
        name: 'useCoreClient',
        as: 'useCoreClient',
        from: join(runtimeDir, 'server/useCoreClient'),
      });
    });
  },
});
