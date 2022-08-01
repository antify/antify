import { PrismaClient } from '~~/node_modules/@internal/prisma/core/index.js';
// TODO:: https://github.com/nuxt/framework/issues/4797
// import { PrismaClient } from './generated'

export default useCoreClient<PrismaClient>(PrismaClient);
