import { PrismaClient } from '~~/node_modules/@internal/prisma/authClient/index.js'
// TODO:: https://github.com/nuxt/framework/issues/4797
// import { PrismaClient } from './generated'

// add prisma to the NodeJS global type
interface CustomNodeJsGlobal extends NodeJS.Global {
    authClient: PrismaClient
}

// Prevent multiple instances of Prisma Client in development
declare const global: CustomNodeJsGlobal

const authClient = global.authClient || new PrismaClient()

if (process.env.NODE_ENV === 'development') {
    global.authClient = authClient
}

export default authClient