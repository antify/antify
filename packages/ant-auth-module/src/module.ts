import { fileURLToPath } from 'url';
import {
  defineNuxtModule,
  createResolver,
  addComponentsDir,
  addServerHandler,
  addPlugin,
} from '@nuxt/kit';
import { type Context } from '@antify/context';

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

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'ant-auth-module',
    configKey: 'antAuthModule',
  },
  async setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url);
    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url));

    nuxt.options.runtimeConfig.antAuth = options;

    await addComponentsDir({
      path: resolve('./runtime/components'),
      pathPrefix: false,
      prefix: 'AntAuth',
      global: true,
    });

    addServerHandler({
      route: '/api/ant-auth-module/login',
      method: 'post',
      handler: resolve(runtimeDir, 'server/api/login.post'),
    });

    addServerHandler({
      route: '/api/ant-auth-module/register',
      method: 'post',
      handler: resolve(runtimeDir, 'server/api/register.post'),
    });

    addServerHandler({
      route: '/api/ant-auth-module/forgot-password',
      method: 'post',
      handler: resolve(runtimeDir, 'server/api/forgot-password.post'),
    });

    addServerHandler({
      route: '/api/ant-auth-module/reset-password',
      method: 'post',
      handler: resolve(runtimeDir, 'server/api/reset-password.post'),
    });

    addPlugin(resolve('./runtime/plugins/auth'));
  },
});
