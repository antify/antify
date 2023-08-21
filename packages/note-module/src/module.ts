import { fileURLToPath } from 'url';
import {
  defineNuxtModule,
  createResolver,
  addComponentsDir,
  addPlugin,
  addServerHandler,
} from '@nuxt/kit';
import { type ContextConfigurationItem } from '@antify/context';

type ModuleOptions = {
  providers: ContextConfigurationItem[];
};

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'note-module',
    configKey: 'antNoteModule',
  },
  async setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url);
    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url));

    nuxt.options.runtimeConfig.antNote = options;

    await addComponentsDir({
      path: resolve('./runtime/components'),
      pathPrefix: false,
      prefix: '',
      global: true,
    });

    nuxt.hook('imports:dirs', (dirs) => {
      dirs.push(resolve(runtimeDir, 'composables'));
    });

    addServerHandler({
      route: '/api/note-module/notes',
      method: 'get',
      handler: resolve(runtimeDir, 'server/api/notes/index.get'),
    });

    addServerHandler({
      route: '/api/note-module/notes',
      method: 'post',
      handler: resolve(runtimeDir, 'server/api/notes/index.post'),
    });

    addServerHandler({
      route: '/api/note-module/notes/:noteId',
      method: 'put',
      handler: resolve(runtimeDir, 'server/api/notes/[noteId].put'),
    });

    addServerHandler({
      route: '/api/note-module/notes/:noteId',
      method: 'delete',
      handler: resolve(runtimeDir, 'server/api/notes/[noteId].delete'),
    });
  },
});
