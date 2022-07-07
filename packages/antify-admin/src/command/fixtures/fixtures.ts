// TODO:: split an bring a system into it
(async () => {
    const { PrismaClient } = require('@prisma/client');
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

    const prisma = new PrismaClient();

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
            password: "e827e7bd4001513072b33581d291cc590332ba6e2b5f5f9cca44c88b8c0f6bacb77648803ab8639ba87ac63f062dec35ff8a23e6f691d05d899e65a1740b10b2",
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