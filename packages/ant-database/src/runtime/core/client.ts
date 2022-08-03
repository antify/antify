// import { PrismaClient } from '~~/node_modules/@internal/prisma/core/index.js';
// TODO:: https://github.com/nuxt/framework/issues/4797
// import { PrismaClient } from './generated'

import { PrismaClient } from '@prisma/client';

// add prisma to the NodeJS global type
interface CustomNodeJsGlobal extends NodeJS.Global {
  coreClient: PrismaClient;
}

// Prevent multiple instances of Prisma Client in development
declare const global: CustomNodeJsGlobal;

export const useCoreClient = <T>(PrismaClient: T): T => {
  // @ts-ignore
  const coreClient = global.coreClient || new PrismaClient();

  if (process.env.NODE_ENV === 'development') {
    global.coreClient = coreClient;
  }

  // @ts-ignore
  return global.coreClient as T;
};
