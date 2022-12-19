class PrismaClient {

}

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