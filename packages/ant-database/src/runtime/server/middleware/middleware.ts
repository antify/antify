export default defineEventHandler(async (event) => {
  useTenantClient()
    .getSchema('settings')
    .add({
      language: {
        type: String,
        required: true,
      },
    });

  useCoreClient()
    .getSchema('tenants')
    .add({
      name: {
        type: String,
        required: true,
      },
    });
});
