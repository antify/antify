export default defineEventHandler(async (event) => {
  useTenantClient()
    .getSchema('mail_templates')
    .add({
      templateId: {
        type: String,
        required: true,
        unique: true,
      },
      title: {
        type: String,
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
    });

  useTenantClient()
    .getSchema('medias')
    .add({
      title: {
        type: String,
        required: true,
      },
      fileName: {
        type: String,
        required: true,
      },
      fileType: {
        type: String,
        required: true,
      },
    });

  // useTenantClient()
  //   .getSchema('settings')
  //   .add({
  //     timezone: {
  //       type: String,
  //       required: true,
  //     },
  //   });
});
