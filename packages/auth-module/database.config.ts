import { defineDatabaseConfig } from '@antify/ant-database';

export default defineDatabaseConfig({
  core: {
    databaseUrl: 'mongodb://core:core@localhost:27017/core',
    isSingleConnection: true,
    migrationDir: './migrations/core',
    fixturesDir: './src/runtime/server/datasources/fixtures',
  }
});
