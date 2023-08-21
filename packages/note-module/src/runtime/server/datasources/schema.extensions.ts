import { Client } from '@antify/ant-database';

export const extendSchemas = (client: Client) => {
  client.getSchema('notes').add({
    content: {
      type: String,
      required: true,
    },
    owner: {
      type: String,
      required: true,
    },
    isGlobalVisible: {
      type: Boolean,
      required: true
    },
  });
};
