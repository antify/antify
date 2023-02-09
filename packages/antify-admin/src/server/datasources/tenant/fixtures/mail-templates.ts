import { defineFixture } from '@antify/ant-database';
import { extendSchemas } from '../schema.extensions';
import { MailTemplate } from '../schemas/mailTemplate';

export default defineFixture({
  async load(client) {
    extendSchemas(client);

    await client
      .getModel<MailTemplate>('mail_templates')
      .insertMany([
        { templateId: 'FROM_FIXTURE', title: 'Fixture', content: 'asdf' },
      ]);
  },

  dependsOn() {
    return [];
  },
});
