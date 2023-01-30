import { defineDatabaseConfig } from './src/';

export default defineDatabaseConfig({
  core: {
    databaseUrl: 'mongodb://core:core@localhost:27017/core',
    isSingleConnection: true,
    migrationDir: './migrations-core',
    fixturesDir: './fixtures-core',
  },
  tenant: {
    databaseUrl: 'mongodb://root:root@127.0.0.1:27017',
    isSingleConnection: false,
    migrationDir: './migrations-tenant',
    fixturesDir: './fixtures-tenant',
    fetchTenants: async () => [
      {
        id: '63c01b397e0e377e6647c013',
        name: 'First tenant',
      },
      {
        id: '63c01b397e0e377e6647c017',
        name: 'Second tenant',
      },
      {
        id: '63c01b397e0e377e6647c01a',
        name: 'Third tenant',
      },
    ],
  },
});
