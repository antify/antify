import { fileURLToPath } from 'url';
import {
  defineNuxtModule,
  createResolver,
  addComponentsDir,
  addServerHandler,
  addPlugin,
  resolveModule,
  addTemplate,
  addImports,
  addImportsSources,
} from '@nuxt/kit';
import { ContextConfiguration } from '@antify/context';
import { join } from 'pathe';
import type { Import, Preset } from 'unimport';
import defu from 'defu';
import type { ImportPresetWithDeprecation } from '@nuxt/schema';

type ModuleOptions = {
  context: ContextConfiguration[];
};

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'antify',
    configKey: 'antify',
  },
  async setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url);
    const resolveRuntimeModule = (path: string) =>
      resolveModule(path, { paths: resolve('./runtime') });
    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url));
    addImportsSources({
      from: '#antify',
      imports: [
        {
          name: 'useAntify',
          from: join(runtimeDir, 'server/useAntify'),
          as: 'useAntify',
        },
      ],
    });
    // TODO:: validate options
    nuxt.options.runtimeConfig.antify = options;

    // addPlugin(resolve(runtimeDir, 'server/plugins/client'));

    nuxt.hook('imports:dirs', (dirs) => {
      dirs.push(resolve(runtimeDir, 'composables'));
    });

    // TODO:: test it in project usage
    nuxt.options.alias['#antify'] = resolve('runtime/server/utils');

    nuxt.hook('nitro:config', (nitroConfig) => {
      // if (!nitroConfig.autoImport) {
      //   nitroConfig.autoImport = {
      //     imports: [],
      //   };
      // }

      // nitroConfig.autoImport.imports.push({
      //   name: 'useFooApp',
      //   as: 'useFooApp',
      //   from: join(runtimeDir, 'server/useFooApp'),
      // });

      nitroConfig.externals = defu(
        typeof nitroConfig.externals === 'object' ? nitroConfig.externals : {},
        {
          inline: [resolve('./runtime/server/utils')],
        }
      );
    });

    // nuxt.hook('nitro:config', (nitroConfig) => {
    //   nitroConfig.alias = nitroConfig.alias || {};

    //   // Inline module runtime in Nitro bundle
    //   nitroConfig.externals = defu(
    //     typeof nitroConfig.externals === 'object' ? nitroConfig.externals : {},
    //     {
    //       inline: [resolve('./runtime')],
    //     }
    //   );

    //   nitroConfig.alias['#antify'] = resolveRuntimeModule('./server/useAntify');
    // });

    // addTemplate({
    //   filename: 'types/antify.d.ts',
    //   getContents: () =>
    //     [
    //       "declare module '#antify' {",
    //       `  const useAntify: typeof import('${resolve(
    //         './runtime/server/useAntify'
    //       )}')`,
    //       '}',
    //     ].join('\n'),
    // });

    // nuxt.hook('prepare:types', (options) => {
    //   options.references.push({
    //     path: resolve(nuxt.options.buildDir, 'types/antify.d.ts'),
    //   });
    // });

    // nuxt.hook('imports:sources', (sources: (Import | Preset)[]) => {
    //   console.log(sources);
    //   sources.push({
    //     from: '#antify',
    //     imports: [],
    //   })

    //   console.log(sources);
    // });
  },
});
