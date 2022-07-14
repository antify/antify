// TODO:: split an bring a system into it
(async () => {
    const { PrismaClient } = require('../../node_modules/@internal/prisma/authClient/index.js');
    const { faker } = require("@faker-js/faker");

    const tenantFixtures = {
        create(amount = 1, data = {}) {
            const items = [];

            for (let i = 0; i < (amount - 1); i++) {
                items.push(this.createOne(data));
            }

            return items;
        },

        createOne(data = {}) {
            return {
                ...{
                    id: faker.datatype.uuid(),
                    name: faker.company.companyName(),
                },
                ...data
            };
        }
    }

    const userFixtures = {
        create(amount = 1, data = {}) {
            const items = [];

            for (let i = 0; i < (amount - 1); i++) {
                items.push(this.createOne(data));
            }

            return items;
        },

        createOne(data = {}) {
            return {
                ...{
                    id: faker.datatype.uuid(),
                    email: faker.internet.email(),
                    password: faker.random.words(),
                    name: faker.name.findName(),
                    isSuperAdmin: true,
                },
                ...data
            };
        }
    }

    const prisma = new PrismaClient({ datasources: { db: { url: process.env.AUTH_DATABASE_URL }} });

    console.log("Load fixtures");

    const tenant = await prisma.tenant.create({
        data: tenantFixtures.createOne({
            id: "1039fc07-7be9-4dd4-b299-26addb875111",
            name: "Demo Mandant"
        })
    });

    const user = await prisma.user.create({
        data: userFixtures.createOne({
            id: "1039fc07-7be9-4dd4-b299-26addb875771",
            name: 'Demo Benutzer',
            // Password is: admin
            password: "3ba0469d6c4724298538beb08d2e3f5120df0f7670c2a4ff2874cf55fbda5f634661a0ca6a0d17cafc3e05fbe9d8ad868c32c2438bd2ba653c467ba55e4695a1",
            email: "admin@admin.de",
            isSuperAdmin: true
        })
    });

    const adminRole = await prisma.role.findFirst({
        select: {
            id: true
        },
        where: {
            isAdmin: true
        }
    });

    await prisma.userTenantAccess.create({
        data: {
            tenantId: tenant.id,
            userId: user.id,
            roleId: adminRole.id
        }
    });

    // await Promise.all(userFixtures.create(50).map(async (data) => await prisma.user.create({ data })));
    await Promise.all(tenantFixtures.create(50).map(async (data) => await prisma.tenant.create({ data })));

    console.log("Fixtures loaded 🐅🐅🐅🐈🐈🐆🐆🐈🐆");
})();