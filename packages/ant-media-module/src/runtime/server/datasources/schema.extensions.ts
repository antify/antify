import { Client } from '@antify/ant-database';

export const extendSchemas = (client: Client) => {
  // TODO:: Add alt text and more media meta data like filesize, image width and height etc.
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
};
