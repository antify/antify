import { defineNuxtConfig } from 'nuxt';
import { resolve } from 'path';
import AntDatabase from '@antify/ant-database';
import AntAuth from '@antify/ant-auth';

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
    AntAuth,
    AntDatabase,
    // TODO:: remove me and replace with antify-ui
    '@nuxtjs/tailwindcss',
  ],
  privateRuntimeConfig: {
    passwordSalt: process.env.PASSWORD_SALT,
    smtpHost: process.env.SMTP_HOST,
    smtpPort: process.env.SMTP_PORT,
    smtpUser: process.env.SMTP_USER,
    smtpPassword: process.env.SMTP_PASSWORD,
    mediaUploadDir: process.env.MEDIA_UPLOAD_DIR,
  },
  antDatabase: {
    schemas: {
      core: {
        inputs: [resolve('./server/datasources/core/schema.prisma')],
        output: resolve('./server/datasources/core/schema.merged.prisma'),
      },
      tenant: {
        inputs: [resolve('./server/datasources/tenant/schema.prisma')],
        output: resolve('./server/datasources/tenant/schema.merged.prisma'),
      },
    },
  },
});
