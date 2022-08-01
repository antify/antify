(async () => {
  const {
    PrismaClient,
  } = require('../../node_modules/@internal/prisma/tenantClient/index.js');
  const prisma = new PrismaClient({
    datasources: { db: { url: process.env.TENANT_DATABASE_URL } },
  });

  console.log('Install required data');

  const defaultMailTemplates = [
    {
      // TODO:: use MailTemplateId.RESET_PASSWORD from /server/datasources/static
      id: 'RESET_PASSWORD',
      title: 'Passwort zurücksetzen',
      content: '<div>Passwort zurücksetzten</div>',
      info: 'Wird versendet, wenn der Nutzer auf "Paswort vergessen" klickt.',
    },
    {
      // TODO:: use MailTemplateId.RESET_PASSWORD from /server/datasources/static
      id: 'INVITE_USER',
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

  console.log('Everything ready to go 🚀🚀🚀');
})();
