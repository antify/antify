// TODO:: Finish implementation

import { useMailer } from '../../../../utils/useMailer';
import { createInviteToken } from '../../../../utils/tokenUtil';
import tenantPrisma from '~~/server/datasources/tenant/client';
import authPrisma from '~~/server/datasources/core/client';
import { isSuperAdminMiddleware } from '~~/server/guard/isSuperAdmin.middleware';
import { validator, Input } from '~~/glue/api/cockpit/users/invite_user.post';
import { User } from '~~/server/datasources/core/schemas/user';

export default defineEventHandler(async (event) => {
  isSuperAdminMiddleware(event);

  const requestData = await readBody<Input>(event);

  validator.validate(requestData);

  if (validator.hasErrors()) {
    return {
      badRequest: {
        errors: validator.getErrors(),
      },
    };
  }

  const coreClient = await useCoreClient().connect();
  const UserModel = coreClient.getModel<User>('users');
  const user = await UserModel.findOne({ email: requestData.email });

  if (user) {
    return {
      badRequest: {
        message: `User with mail ${requestData.email} is already invited`,
      },
    };
  }

  const mailTemplate = await tenantPrisma.mailTemplate.findUnique({
    select: {
      id: true,
      title: true,
      content: true,
    },
    where: {
      id: 'INVITE_USER',
    },
  });

  const { systemMail, baseUrl } = useRuntimeConfig();

  const token = await createInviteToken(data.user, tenantId);
  const link = `${baseUrl}${
    data.isNew ? 'register' : 'login'
  }?inviteToken=${token}`;

  // $\{email} $\{env} $\{tenant} $\{role} $\{url}
  const content = mailTemplate.content
    .replace('${email}', data.user.email)
    .replace('${env}', 'Testumgebung') // TODO:: load from env
    .replace('${tenant}', tenant.name)
    .replace('${role}', role.name);

  await useMailer().sendMail({
    from: systemMail,
    to: data.user.email,
    subject: mailTemplate.title,
    text: getPlainContent(content, link),
    html: getHtmlContent(content, link),
  });
});

function getPlainContent(content: string, link: string): string {
  return content
    .replace(
      '${url}',
      `\nBitte klicken Sie auf folgenden Link oder kopieren Sie ihn in die adress Leiste in Ihrem Browser:\n ${link}`
    )
    .replace(/<[^>]+>/g, '');
}

function getHtmlContent(content: string, link: string): string {
  return content.replace('${url}', `<a href="${link}">Jetzt Anmelden</a>`);
}

async function getUser(email: string, roleId: string, tenantId: string) {
  const user = await authPrisma.user.findUnique({
    select: {
      id: true,
      email: true,
      tenantAccesses: true,
    },
    where: {
      email: email,
    },
  });

  if (user) {
    // check if has already access to tenant, or add isPending#
    const index = user.tenantAccesses.findIndex(
      (tenant) => tenant.tenantId === tenantId
    );

    if (index !== -1) {
      // already has access to tenant (TODO:: inform user)
      return null;
    }

    // add new tenantAccess and sent e-mail
    return {
      user: await authPrisma.user.update({
        select: {
          id: true,
          email: true,
          name: true,
          tenantAccesses: true,
        },
        where: {
          id: user.id,
        },
        data: {
          tenantAccesses: {
            create: {
              roleId: roleId,
              tenantId: tenantId,
              isPending: true,
            },
          },
        },
      }),
      isNew: false,
    };

    // need to go to login to activate
  } else {
    // need to go to register to activate

    // create new user
    return {
      user: await authPrisma.user.create({
        select: {
          id: true,
          email: true,
          name: true,
          tenantAccesses: true,
        },
        data: {
          email: email,
          name: email.split('@')[0],
          isSuperAdmin: false,
          tenantAccesses: {
            create: {
              roleId: roleId,
              tenantId: tenantId,
              isPending: true,
            },
          },
        },
      }),
      isNew: true,
    };
  }
}
