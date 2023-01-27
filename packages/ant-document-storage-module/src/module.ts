import { fileURLToPath } from 'url';
import {
  defineNuxtModule,
  createResolver,
  addComponentsDir,
  addPlugin,
} from '@nuxt/kit';
import { join } from 'pathe';

export { useDocumentStorageClient } from './runtime/composables/useDocumentStorageClient';

type ModuleOptions = {
  provider: Record<string, { serverUrl: string }>;
};

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'ant-document-storage-module',
    configKey: 'antDocumentStorageModule',
  },
  async setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url);
    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url));
    nuxt.options.build.transpile.push(runtimeDir);

    // TODO:: validate options
    nuxt.options.runtimeConfig.public.antDocumentStorage = { provider: {} };

    // Make sure only serverUrl get to public runtimeConfig.
    Object.keys(options.provider).forEach((provider) => {
      nuxt.options.runtimeConfig.public.antDocumentStorage.provider[provider] =
        {
          serverUrl: options.provider[provider].serverUrl,
        };
    });

    await addComponentsDir({
      path: join(runtimeDir, 'components'),
      extensions: ['js', 'ts', 'mjs'],
    });

    addPlugin(resolve(runtimeDir, 'plugins', 'document-storage-client'));

    nuxt.hook('imports:dirs', (dirs) => {
      dirs.push(resolve(runtimeDir, 'composables'));
    });
  },
});
