import Module from '..';

export default defineNuxtConfig({
  modules: [Module],
  antify: {
    context: [
      {
        id: 'core',
        isSingleTenancy: true,
      },
      {
        id: 'tenant',
        isSingleTenancy: false,
      },
    ],
  },
});
