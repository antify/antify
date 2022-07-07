(async () => {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    console.log('Install required data');

    const defaultMailTemplates = [
        {
            // TODO:: use MailTemplateId.RESET_PASSWORD from /server/datasources/static
            id: 'RESET_PASSWORD',
            title: 'Passwort zurücksetzen',
            content: '<div>Passwort zurücksetzten</div>',
            contentPlain: 'Passwort zurücksetzten',
            info: 'Wird versendet, wenn der Nutzer auf "Paswort vergessen" klickt.'
        },
        {
            // TODO:: use MailTemplateId.RESET_PASSWORD from /server/datasources/static
            id: 'INVITE_USER',
            title: 'Neuen Benutzer einladen',
            content: '<div>Neuen Benutzer einladen</div>',
            contentPlain: 'Neuen Benutzer einladen',
            info: 'Wird versendet, wenn ein neuer Nutzer eingeladen wird.'
        }
    ]

    await Promise.all(defaultMailTemplates.map((mailTemplate) => {
        return prisma.mailTemplate.create({
            data: {
                id: mailTemplate.id,
                title: mailTemplate.title,
                content: mailTemplate.content
            }
        });
    })
    )

    // TODO:: import and use from /server/datasources/static
    enum PermissionId {
        CAN_CREATE_USER = "CAN_CREATE_USER",
        CAN_READ_USER = "CAN_READ_USER",
        CAN_UPDATE_USER = "CAN_UPDATE_USER",
        CAN_DELETE_USER = "CAN_DELETE_USER",
        CAN_UPDATE_SELF = "CAN_UPDATE_SELF",
    };

    await prisma.role.create({
        data: {
            name: 'Administrator',
            isAdmin: true,
            // permissions: {
            //     create: Object.values(PermissionId).map((id) => ({
            //         permissionId: id
            //     }))
            // }
        }
    });

    await prisma.role.create({
        data: {
            name: 'Mitarbeiter',
            isAdmin: false,
            permissions: {
                create: Object.values(PermissionId).map((id) => ({
                    permissionId: id
                }))
            }
        }
    });

    console.log("Everything ready to go 🚀🚀🚀");
})();