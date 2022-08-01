// import { PrismaClient } from '~~/node_modules/@internal/prisma/core/index.js';
// TODO:: https://github.com/nuxt/framework/issues/4797
// import { PrismaClient } from './generated'

import { PrismaClient } from '@prisma/client';

// add prisma to the NodeJS global type
interface CustomNodeJsGlobal extends NodeJS.Global {
  tenantClient: PrismaClient;
}

// Prevent multiple instances of Prisma Client in development
declare const global: CustomNodeJsGlobal;

export const useTenantClient = <T>(PrismaClient: T): T => {
  // @ts-ignore
  const tenantClient = global.tenantClient || new PrismaClient();

  if (process.env.NODE_ENV === 'development') {
    global.tenantClient = tenantClient;
  }

  // @ts-ignore
  return global.tenantClient as T;
};
