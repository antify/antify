// TODO:: split an bring a system into it
(async () => {
    const { PrismaClient } = require('../../node_modules/@internal/prisma/tenantClient/index.js');
    const { faker } = require("@faker-js/faker");

    const prisma = new PrismaClient({ datasources: { db: { url: process.env.TENANT_DATABASE_URL } } });

    const mediaFixtures = {
        create(amount = 1, data = {}) {
            const items = [];

            for (let i = 0; i < (amount - 1); i++) {
                items.push(this.createOne(data));
            }

            return items;
        },

        createOne(data = {}) {
            const fileName = faker.system.commonFileName('png');

            return {
                ...{
                    id: faker.datatype.uuid(),
                    title: fileName,
                    fileName: fileName,
                    fileType: 'image/png'
                },
                ...data
            };
        }
    }

    console.log("Load fixtures");

    await prisma.media.create({
        data: mediaFixtures.createOne({
            id: "1039fc07-7bf9-4dd4-b299-26addb875123",
            title: "__test image"
        })
    });

    await prisma.media.createMany({
        data: mediaFixtures.create(50)
    });

    console.log("Fixtures loaded 🐅🐅🐅🐈🐈🐆🐆🐈🐆");
})();