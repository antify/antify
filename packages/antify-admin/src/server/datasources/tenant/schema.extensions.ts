// TODO:: Import from @antify/ant-database
import { Client } from '@antify/ant-database';

export const extendSchemas = (client: Client) => {
  client.getSchema('mail_templates').add({
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

  client.getSchema('medias').add({
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

  // client
  //   .getSchema('settings')
  //   .add({
  //     timezone: {
  //       type: String,
  //       required: true,
  //     },
  //   });
};
