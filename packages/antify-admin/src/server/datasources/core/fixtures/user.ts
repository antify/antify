import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import { User } from '../schemas/user';

export const userFixtures = {
  create(amount = 1, data = {}): User[] {
    const items = [];

    for (let i = 0; i < amount - 1; i++) {
      items.push(this.createOne(data));
    }

    return items;
  },

  createOne(data = {}): User {
    return {
      ...{
        _id: new mongoose.Types.ObjectId().toHexString(),
        email: faker.internet.email(),
        password: faker.random.words(),
        name: faker.name.findName(),
        isSuperAdmin: true,
        isBanned: true,
        tenantAccesses: [],
      },
      ...data,
    };
  },
};
