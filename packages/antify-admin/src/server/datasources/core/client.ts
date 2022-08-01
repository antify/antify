import { PrismaClient } from '~~/node_modules/@internal/prisma/core/index.js'
// TODO:: https://github.com/nuxt/framework/issues/4797
// import { PrismaClient } from './generated'

// add prisma to the NodeJS global type
interface CustomNodeJsGlobal extends NodeJS.Global {
    coreClient: PrismaClient
}

// Prevent multiple instances of Prisma Client in development
declare const global: CustomNodeJsGlobal

const coreClient = global.coreClient || new PrismaClient()

if (process.env.NODE_ENV === 'development') {
    global.coreClient = coreClient
}

export default coreClient