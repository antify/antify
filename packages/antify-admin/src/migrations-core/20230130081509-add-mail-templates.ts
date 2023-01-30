import { defineMigration } from '@antify/ant-database';
import { MailTemplate } from '~~/server/datasources/core/schemas/mailTemplate';
import { MailTemplateId } from '~~/server/datasources/static/mailTemplates';

export default defineMigration({
  async up(client) {
    const mailTemplates = Object.keys(MailTemplateId).map((mailTemplateId) => ({
      title: mailTemplateId,
      // TODO:: import default content
      content: '',
    }));

    await client
      .getModel<MailTemplate>('mail_templates')
      .insertMany(mailTemplates);
  },

  async down(client) {
    await client.getModel<MailTemplate>('mail_templates').deleteMany();
  },
});
