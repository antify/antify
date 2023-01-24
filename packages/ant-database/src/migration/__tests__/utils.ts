import { defineMigration } from '../../types';

export const generateMigrationMock = (name: string) => {
  return defineMigration({
    name,
    async up() {},
    async down() {},
  });
};

export const generateMigrationMocks = (nameList: string[]) => {
  return nameList.map((name) => generateMigrationMock(name));
};
