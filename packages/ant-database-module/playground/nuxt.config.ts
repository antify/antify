import AntDatabase from '..';

export default defineNuxtConfig({
  modules: [AntDatabase],
  antDatabase: {
    coreMongoUrl: 'mongodb://core:core@localhost:27017/core',
    tenantMongoUrl: 'mongodb://root:root@127.0.0.1:27017',
  },
});
