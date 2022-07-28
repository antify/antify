import { tenantContextMiddleware } from '../../guard/tenantContext.middleware';
import { useAuthorizationHeader } from '../../utils/useAuthorizationHeader';
import { useGuard } from '~~/composables/useGuard';
import { useTenantHeader } from '../../utils/useTenantHeader';
import { PermissionId } from '../../datasources/static/permissions';
import { HttpForbiddenError } from '../../errors';
import { Input } from '../../../glue/api/users/invite_user.post';
import { useMailer } from '../../utils/useMailer';
import prisma from '~~/server/datasources/db/client';
import { createInviteToken } from '../../utils/tokenUtil';

export default defineEventHandler(async (event) => {
  const requestData = await useBody<Input>(event);
  tenantContextMiddleware(event);

  const guard = useGuard(useAuthorizationHeader(event));
  const tenantId = useTenantHeader(event);

  if (!guard.hasPermissionTo(PermissionId.CAN_READ_USER, tenantId)) {
    throw new HttpForbiddenError();
  }

  // TODO:: check if e-mail already exists

  const mailTemplate = await prisma.mailTemplate.findUnique({
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

  const token = await createInviteToken(requestData.email, tenantId);
  const content = mailTemplate.content.replace(
    '${url}',
    `<a href="${baseUrl}register?token=${token}">Jetzt Registrieren</a>`
  );

  await useMailer().sendMail({
    from: systemMail,
    to: requestData.email,
    subject: mailTemplate.title,
    text: mailTemplate.content
      .replace(
        '${url}',
        `\nBitte Kopieren Sie folgenden Link in die adress Leiste in Ihrem Browser:\n ${baseUrl}register?token=${token}`
      )
      .replace(/<[^>]+>/g, ''),
    html: mailTemplate.content.replace(
      '${url}',
      `<a href="${baseUrl}register?token=${token}">Jetzt Registrieren</a>`
    ),
  });
});
