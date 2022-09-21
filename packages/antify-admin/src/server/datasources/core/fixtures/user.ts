import { faker } from '@faker-js/faker';

export const userFixtures = {
  create(amount = 1, data = {}) {
    const items = [];

    for (let i = 0; i < amount - 1; i++) {
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
      ...data,
    };
  },
};
