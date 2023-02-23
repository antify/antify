import { ContextConfigurationItem } from '@antify/context';

const coreContext: ContextConfigurationItem = {
  id: 'core',
  isSingleTenancy: true,
};
const tenantContext: ContextConfigurationItem = {
  id: 'tenant',
  isSingleTenancy: false,
};

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  tailwindcss: {
    config: {
      // plugins: [tailwindForms],
      content: [
        // TODO:: find a smarter way
        '../../packages/**/components/**/*.{js,vue,ts}',
        '../../packages/**/layouts/**/*.vue',
        '../../packages/**/pages/**/*.vue',
        '../../packages/**/plugins/**/*.{js,ts}',
        // "../../packages/**/nuxt.config.{js,ts}",

        '../../playground/**/components/**/*.{js,vue,ts}',
        '../../playground/**/layouts/**/*.vue',
        '../../playground/**/pages/**/*.vue',
        '../../playground/**/plugins/**/*.{js,ts}',
        // Next line throw an error. Discussion here https://github.com/nuxt-community/tailwindcss-module/issues/429
        // "../../playground/**/nuxt.config.{js,ts}",

        './node_modules/@antify/antify-ui/dist/components/**/*.{js,vue,ts}',
        './node_modules/@antify/antify-ui/dist/index.{js,vue,ts}',
      ],
    },
  },
  modules: [
    // TODO:: remove me and replace with antify-ui
    '@nuxtjs/tailwindcss',
    '@antify/ant-media-module',
    '@antify/ant-mailer-module',
  ],
  runtimeConfig: {
    baseUrl: process.env.BASE_URL,
    systemMail: process.env.SYSTEM_MAIL,
    passwordSalt: process.env.PASSWORD_SALT,
    contextConfig: [coreContext, tenantContext],
  },
  antMediaModule: {
    providers: [
      {
        ...coreContext,
        serverUrl: 'http://localhost:4000',
      },
      {
        ...tenantContext,
        serverUrl: 'http://localhost:4000',
      },
    ],
  },
  antMailerModule: {
    providers: [
      {
        ...coreContext,
        smtpHost: 'localhost',
        smtpPort: '1025',
      },
      {
        ...tenantContext,
        smtpHost: 'localhost',
        smtpPort: '1025',
      },
    ],
  },
});
