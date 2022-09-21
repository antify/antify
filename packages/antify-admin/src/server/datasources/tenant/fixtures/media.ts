import { faker } from '@faker-js/faker';

export const mediaFixtures = {
  create(amount = 1, data = {}) {
    const items = [];

    for (let i = 0; i < amount - 1; i++) {
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
        fileType: 'image/png',
      },
      ...data,
    };
  },
};
