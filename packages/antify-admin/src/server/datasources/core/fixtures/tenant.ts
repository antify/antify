import { faker } from '@faker-js/faker';

export const tenantFixtures = {
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
        name: faker.company.companyName(),
      },
      ...data,
    };
  },
};
