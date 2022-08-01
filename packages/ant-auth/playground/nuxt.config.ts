import { defineNuxtConfig } from 'nuxt';
import AntAuth from '..';
import AntDatabase from '@antify/ant-database';
import { resolve } from 'path';

export default defineNuxtConfig({
  modules: [AntAuth, AntDatabase],
  antDatabase: {
    schemas: {
      core: {
        inputs: [resolve('./playground/server/datasources/core/schema.prisma')],
        fragments: [
          resolve('./playground/server/datasources/core/schema.prisma')
        ],
        output: resolve(
          './playground/server/datasources/core/schema.merged.prisma'
        ),
      },
      tenant: {
        inputs: [
          resolve('./playground/server/datasources/tenant/schema.prisma'),
        ],
        output: resolve(
          './playground/server/datasources/tenant/schema.merged.prisma'
        ),
      },
    },
  },
});
