import { MailTemplateId } from '../static/mailTemplates';
import { MultiConnectionClient } from '@antify/ant-db';
import { MailTemplate } from './schemas/mailTemplate';

export async function seedTenant(
  tenantId: string,
  client: MultiConnectionClient
) {
  console.log('Load tenant seeds 🌱');

  await client.connect(tenantId);

  client.getModel<MailTemplate>('mail_templates').insertMany([
    {
      id: MailTemplateId.RESET_PASSWORD,
      title: 'Passwort zurücksetzen',
      content: '<div>Passwort zurücksetzten</div>',
      info: 'Wird versendet, wenn der Nutzer auf "Paswort vergessen" klickt.',
    },
    {
      id: MailTemplateId.INVITE_USER,
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

  console.log('Tenant seeds sucessfully loaded 🌱🌱🌱');
}
