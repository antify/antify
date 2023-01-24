import { resolve } from 'path';
import AntDatabase from '@antify/ant-database-module';

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
    AntDatabase,
    // TODO:: remove me and replace with antify-ui
    '@nuxtjs/tailwindcss',
  ],
  runtimeConfig: {
    baseUrl: process.env.BASE_URL,
    systemMail: process.env.SYSTEM_MAIL,
    passwordSalt: process.env.PASSWORD_SALT,
    smtpHost: process.env.SMTP_HOST,
    smtpPort: process.env.SMTP_PORT,
    smtpUser: process.env.SMTP_USER,
    smtpPassword: process.env.SMTP_PASSWORD,
    mediaUploadDir: process.env.MEDIA_UPLOAD_DIR,
  },
  antDatabase: {
    coreMongoUrl: 'mongodb://core:core@localhost:27017/core',
    tenantMongoUrl: 'mongodb://root:root@127.0.0.1:27017',
  },
});
