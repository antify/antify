import { defineNuxtConfig } from 'nuxt';
import AntDatabase from '..';
import { resolve } from 'path';

export default defineNuxtConfig({
  modules: [AntDatabase],
  antDatabase: {
    schemas: {
      core: {
        inputs: [
          resolve('./playground/server/datasources/core/schema.prisma'),
          resolve(
            './playground/server/datasources/core-extension/schema.prisma'
          ),
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
