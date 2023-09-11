import { fileURLToPath } from 'url';
import {
  defineNuxtModule,
  createResolver,
  addComponentsDir,
  addServerHandler
} from '@nuxt/kit';

export default defineNuxtModule({
  meta: {
    name: 'dev-module',
    configKey: 'devModule'
  },
  async setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url);
    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url));

    await addComponentsDir({
      path: resolve('./runtime/components'),
      pathPrefix: false,
      prefix: 'AntDev',
      global: true
    });

    addServerHandler({
      route: '/api/dev-module/create-jwt',
      method: 'post',
      handler: resolve(runtimeDir, 'server/api/create-jwt.post')
    });
  }
});
