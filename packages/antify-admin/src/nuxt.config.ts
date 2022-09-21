import { defineNuxtConfig } from 'nuxt';
import { resolve } from 'path';
import AntDatabase from '@antify/ant-database';
import AntAuth from '@antify/ant-auth';
import AntUi from '@antify/ant-ui';

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: [AntAuth, AntDatabase, AntUi, '@nuxtjs/tailwindcss'],

  privateRuntimeConfig: {
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
