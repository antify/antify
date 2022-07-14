// TODO:: split an bring a system into it
(async () => {
    const { PrismaClient } = require('../../node_modules/@internal/prisma/tenantClient/index.js');
    const { faker } = require("@faker-js/faker");

    const prisma = new PrismaClient({ datasources: { db: { url: process.env.TENANT_DATABASE_URL }} });

    console.log("Load fixtures");

    console.log("Fixtures loaded 🐅🐅🐅🐈🐈🐆🐆🐈🐆");
})();