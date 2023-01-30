import { defineMigration } from '@antify/ant-database';

export default defineMigration({
  async up(client) {
    throw new Error('Fail!');
  },

  async down(client) {},
});
