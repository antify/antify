import { fileURLToPath } from 'url';
import {
  defineNuxtModule,
  createResolver,
  addComponentsDir,
  addPlugin,
  addServerHandler,
} from '@nuxt/kit';
import { ContextConfigurationItem } from '@antify/context';

type Provider = {
  // TODO:: change to a name which say that it is a files provider
  serverUrl: string;
} & ContextConfigurationItem;

type ModuleOptions = {
  providers: Provider[];
};

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'ant-media-module',
    configKey: 'antMediaModule',
  },
  async setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url);
    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url));

    // TODO:: validate options
    nuxt.options.runtimeConfig.antMedia = options;

    // Make sure only serverUrl get to public runtimeConfig.
    nuxt.options.runtimeConfig.public.antMedia = { providers: {} };

    options.providers.forEach((provider) => {
      nuxt.options.runtimeConfig.public.antMedia.providers[provider.id] = {
        serverUrl: provider.serverUrl,
      };
    });

    await addComponentsDir({
      path: resolve('./runtime/components'),
      pathPrefix: false,
      prefix: '',
      global: true,
    });

    addPlugin(resolve(runtimeDir, 'plugins/document-storage-client'));

    nuxt.hook('imports:dirs', (dirs) => {
      dirs.push(resolve(runtimeDir, 'composables'));
    });

    addServerHandler({
      route: '/api/ant-media-module/media',
      method: 'get',
      handler: resolve(runtimeDir, 'server/api/media/index.get'),
    });

    addServerHandler({
      route: '/api/ant-media-module/media',
      method: 'post',
      handler: resolve(runtimeDir, 'server/api/media/index.post'),
    });

    addServerHandler({
      route: '/api/ant-media-module/media/:mediaId',
      method: 'put',
      handler: resolve(runtimeDir, 'server/api/media/[mediaId].put'),
    });

    addServerHandler({
      route: '/api/ant-media-module/media/:mediaId',
      method: 'get',
      handler: resolve(runtimeDir, 'server/api/media/[mediaId].get'),
    });

    addServerHandler({
      route: '/api/ant-media-module/media/:mediaId',
      method: 'delete',
      handler: resolve(runtimeDir, 'server/api/media/[mediaId].delete'),
    });
  },
});
