import Module from '..';
import {
  getDatabaseClient,
  SingleConnectionClient,
  truncateAllCollections,
} from '@antify/ant-database';
import { extendSchemas } from '../src/runtime/server/datasources/schema.extensions';
import { User } from '../src/runtime/server/datasources/schemas/user';
import { hashPassword } from '@antify/ant-guard';

const passwordSalt = '#a!SaveSalt123';

export default defineNuxtConfig({
  modules: [
    Module,
    // TODO:: remove me and replace with antify-ui
    '@nuxtjs/tailwindcss',
  ],
  antAuthModule: {
    providers: [
      {
        id: 'core',
        isSingleTenancy: true,
        jwtSecret: '#a!SuperSecret123',
        jwtExpiration: 14400,
        passwordSalt,
        canRegister: true,
      },
    ],
  },
  tailwindcss: {
    config: {
      // plugins: [tailwindForms],
      content: [
        // TODO:: find a smarter way
        '../../../packages/**/components/**/*.{js,vue,ts}',
        '../../../packages/**/layouts/**/*.vue',
        '../../../packages/**/pages/**/*.vue',
        '../../../packages/**/plugins/**/*.{js,ts}',
        // "../../../packages/**/nuxt.config.{js,ts}",

        '../../../playground/**/components/**/*.{js,vue,ts}',
        '../../../playground/**/layouts/**/*.vue',
        '../../../playground/**/pages/**/*.vue',
        '../../../playground/**/plugins/**/*.{js,ts}',
        // Next line throw an error. Discussion here https://github.com/nuxt-community/tailwindcss-module/issues/429
        // "../../../playground/**/nuxt.config.{js,ts}",

        './node_modules/@antify/antify-ui/dist/components/**/*.{js,vue,ts}',
        './node_modules/@antify/antify-ui/dist/index.{js,vue,ts}',
      ],
    },
  },
  hooks: {
    ready: async () => {
      const client = await (
        getDatabaseClient('core') as SingleConnectionClient
      ).connect();

      extendSchemas(client);

      await truncateAllCollections(client.getConnection());

      await client.getModel<User>('users').insertMany([
        {
          email: 'admin@admin.mail',
          password: await hashPassword('admin', passwordSalt),
          isSuperAdmin: true,
          isBanned: false,
          forgotPassword: null,
        },
      ]);
    },
  },
});
