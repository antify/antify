import { PrismaClient } from '../../../node_modules/@internal/prisma/tenant/index.js';
import { MailTemplateId } from '../static/mailTemplates';

export async function seedTenant() {
  const prisma = new PrismaClient({
    datasources: { db: { url: process.env.TENANT_DATABASE_URL } },
  });

  // Load required application data
  const defaultMailTemplates = [
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
  ];

  await Promise.all(
    defaultMailTemplates.map((mailTemplate) => {
      return prisma.mailTemplate.create({
        data: {
          id: mailTemplate.id,
          title: mailTemplate.title,
          content: mailTemplate.content,
        },
      });
    })
  );

  console.log('Tenant seeds sucessfully loaded 🌱🌱🌱');
}


