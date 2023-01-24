export default defineEventHandler(async (event) => {
  // TODO:: do not call the add's all time if a connection already exists.
  // console.log('database-extensions');
  useTenantClient()
    .getSchema('settings')
    .add({
      timezone: {
        type: 'string',
        required: true,
      },
    });

  useCoreClient()
    .getSchema('tenants')
    .add({
      color: {
        type: 'string',
        required: true,
      },
    });
});
