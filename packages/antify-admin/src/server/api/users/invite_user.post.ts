import { tenantContextMiddleware } from '../../guard/tenantContext.middleware';
import { useAuthorizationHeader } from '../../utils/useAuthorizationHeader';
import { useGuard } from '~~/composables/useGuard';
import { useTenantHeader } from '../../utils/useTenantHeader';
import { PermissionId } from '../../datasources/static/permissions';
import { HttpForbiddenError, HttpBadRequestError } from '../../errors';
import { Input } from '../../../glue/api/users/invite_user.post';
import { useMailer } from '../../utils/useMailer';
import { createInviteToken } from '../../utils/tokenUtil';
import tenantPrisma from '~~/server/datasources/db/client';
import authPrisma from '~~/server/datasources/auth/client';

export default defineEventHandler(async (event) => {
  const requestData = await useBody<Input>(event);
  tenantContextMiddleware(event);

  const guard = useGuard(useAuthorizationHeader(event));
  const tenantId = useTenantHeader(event);

  if (!guard.hasPermissionTo(PermissionId.CAN_READ_USER, tenantId)) {
    throw new HttpForbiddenError();
  }

  if (!requestData.email || !requestData.roleId) {
    throw new HttpBadRequestError();
  }

  // get user (new or updated)
  const data = await getUser(requestData.email, requestData.roleId, tenantId);

  if (!data) {
    // User has already access to this tenant
    return;
  }

  const tenant = await authPrisma.tenant.findUnique({
    select: {
      id: true,
      name: true,
    },
    where: {
      id: tenantId,
    },
  });
  const role = await authPrisma.role.findUnique({
    select: {
      id: true,
      name: true,
    },
    where: {
      id: requestData.roleId,
    },
  });
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
