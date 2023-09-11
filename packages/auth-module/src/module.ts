import { fileURLToPath } from 'url';
import {
  defineNuxtModule,
  createResolver,
  addComponentsDir,
  addServerHandler,
  addPlugin,
  addTemplate,
  addImports
} from '@nuxt/kit';
import { type Context } from '@antify/context';
import { mailTemplates } from './runtime/server/mailTemplates';
import jiti from 'jiti';

// export { useDatabaseHandler } from './runtime/types';

export type Provider = {
  /**
   * Salt to hash the password stored in database
   */
  passwordSalt: string;

  /**
   * Secret to hash the json web token
   */
  jwtSecret: string;

  /**
   * Expiration time in seconds for the json web token
   */
  jwtExpiration: number;

  /**
   * Defines if new users can register self to this context.
   */
  canRegister: boolean;
} & Context;

export type ModuleOptions = {
  providers: Provider[];
};

async function readConfigFile(path: string) {
  return await jiti(import.meta.url, { esmResolve: true, interopDefault: true, requireCache: false })(path);
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'auth-module',
    configKey: 'antAuthModule'
  },
  async setup(options, nuxt) {
    // TODO:: Find a way to check this
    // if (!hasNuxtModule('auth-mailer')) {
    //   throw new Error('Missing required module "auth-mailer". Make sure it is configured in nuxt.config modules property.');
    // }

    const { resolve } = createResolver(import.meta.url);
    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url));

    nuxt.options.runtimeConfig.antAuth = options;

    const databaseHandlerPath = resolve('../playground/server/datasources/database-handler');

    nuxt.hook('nitro:config', (nitroConfig) => {
      nitroConfig.alias = nitroConfig.alias || {};

      // nitroConfig.alias['#authModule'] = resolve(databaseHandlerPath);
      nitroConfig.alias['#authModule'] = resolve('./runtime/server/services');
      nitroConfig.alias['#authModuleDatabaseHandler'] = resolve(databaseHandlerPath);

      // console.log(nitroConfig.alias);
    });

    // TODO:: fix types in Intelij
    const template = addTemplate({
      filename: 'types/auth-module.d.ts',
        getContents: () => [
          'declare module \'#authModule\' {',
          `  const defineDatabaseHandler: typeof import("${resolve('./runtime/server/services')}").defineDatabaseHandler`,
          // TODO:: check if this works
          `  export * from "${resolve('./runtime/types.ts')}"`,
          '}',
          'declare module \'#authModuleDatabaseHandler\' {',
          // `  const default: typeof import("${resolve('./runtime/types')}").DatabaseHandler`,
          // TODO:: check if this works
          `  const default: typeof import("${resolve(databaseHandlerPath)}").default`,
          '}'
        ].join('\n')
    });

    // addImports({
    //   name: 'defineDatabaseHandler', // name of the composable to be used
    //   as: 'useDatabaseHandler',
    //   from: resolve(databaseHandlerPath) // path of composable
    // });
    //
    // addTemplate({
    //   getContents: await jiti(import.meta.url, { esmResolve: true, interopDefault: true, requireCache: false })(resolve(databaseHandlerPath))
    // });

    // const template = addTemplate({
    //   filename: 'types/auth-module.d.ts',
    //   getContents: () => [
    //     'declare module \'#authModule\' {',
    //     // `  const * from '${resolve('./runtime/types')}'`,
    //     `  const useDatabaseHandler = import('${resolve(databaseHandlerPath)}')`,
    //     '}'
    //   ].join('\n')
    // });

    nuxt.hook('prepare:types', (options) => {
      options.references.push({ path: template.dst });
    });

    await addComponentsDir({
      path: resolve('./runtime/components'),
      pathPrefix: false,
      prefix: 'AntAuth',
      global: true
    });

    addServerHandler({
      route: '/api/auth-module/login',
      method: 'post',
      handler: resolve(runtimeDir, 'server/api/login.post')
    });

    addServerHandler({
      route: '/api/auth-module/register',
      method: 'post',
      handler: resolve(runtimeDir, 'server/api/register.post')
    });

    addServerHandler({
      route: '/api/auth-module/forgot-password',
      method: 'post',
      handler: resolve(runtimeDir, 'server/api/forgot-password.post')
    });

    addServerHandler({
      route: '/api/auth-module/reset-password',
      method: 'post',
      handler: resolve(runtimeDir, 'server/api/reset-password.post')
    });

    addPlugin(resolve('./runtime/plugins/auth'));

    nuxt.hook('antMailerModule:registerTemplates', () => mailTemplates);
  }
});
