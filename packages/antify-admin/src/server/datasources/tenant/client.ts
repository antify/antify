class PrismaClient {}

// add prisma to the NodeJS global type
interface CustomNodeJsGlobal extends NodeJS.Global {
  tenantClient: PrismaClient;
}

// // Prevent multiple instances of Prisma Client in development
// declare const global: CustomNodeJsGlobal

const tenantClient = global.tenantClient || new PrismaClient();

if (process.env.NODE_ENV === 'development') {
  global.tenantClient = tenantClient;
}

export default tenantClient;
