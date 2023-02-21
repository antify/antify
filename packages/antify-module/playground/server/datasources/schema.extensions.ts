import { Client } from '@antify/ant-database';

export const extendSchemas = (client: Client) => {
  client.getSchema('test').add({
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
    },
  });
};
