import { defineMigration } from '@antify/ant-database';
import { MailTemplateId } from '../../static/mailTemplates';
import { extendSchemas } from '../schema.extensions';
import { MailTemplate } from '../schemas/mailTemplate';

export default defineMigration({
  async up(client) {
    extendSchemas(client);

    await client.getModel<MailTemplate>('mail_templates').insertMany([
      {
        mailTemplateId: MailTemplateId.RESET_PASSWORD,
        title: 'Passwort zurücksetzen',
        content: '<div>Passwort zurücksetzten</div>',
        info: 'Wird versendet, wenn der Nutzer auf "Paswort vergessen" klickt.',
      },
      {
        mailTemplateId: MailTemplateId.INVITE_USER,
        title: 'Neuen Benutzer einladen',
        content: `
            <div contenteditable="true" translate="no" class="ProseMirror" tabindex="0">
              <p>Hallo $\{email}</p>
              <p><br class="ProseMirror-trailingBreak"></p>
              <p>sie wurden bei $\{env} dem Mandanten $\{tenant} als $\{role} zugewiesen.</p>
              <p><br class="ProseMirror-trailingBreak"></p>
              <p>Melden Sie sich jetzt über folgenden Link an um Ihren Zugriff freizuschalten.</p>
              <p>$\{url}</p>
              <p><br class="ProseMirror-trailingBreak"></p>
              <p>Viele Grüße</p>
            </div>`,
        info: 'Wird versendet, wenn ein neuer Nutzer eingeladen wird.',
      },
    ]);
  },

  async down(client) {},
});
