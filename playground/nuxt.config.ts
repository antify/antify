import { defineNuxtConfig } from 'nuxt';
import { resolve } from 'path';

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  extends: [
    // '../packages/antify-admin/src',
    './node_modules/@antify/antify-admin',
  ],
  alias: {
    // '~~': resolve(__dirname, '../packages/antify-admin/src'),
    '~~': resolve(__dirname, './node_modules/@antify/antify-admin'),
  },
  antDatabase: {
    schemas: {
      tenant: {
        inputs: [resolve('./server/datasources/tenant/schema.prisma')],
        output: resolve('./server/datasources/tenant/schema.merged.prisma'),
      },
    },
  },
});
