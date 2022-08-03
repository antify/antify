import prisma from "~~/server/datasources/tenant/client";
import { useGuard } from "~~/composables/useGuard";
import { createForbiddenError, createNotFoundError, HttpForbiddenError } from '~~/server/errors';
import { useAuthorizationHeader } from '~~/server/utils/useAuthorizationHeader';
import { useTenantHeader } from "~~/server/utils/useTenantHeader";
import { PermissionId } from "~~/server/datasources/static/permissions";
import { Response } from "~~/glue/api/mail_templates/[mailTemplateId].get";

export default defineEventHandler<Response>(async (event) => {
  const guard = useGuard(useAuthorizationHeader(event));

  if (!guard.isUserLoggedIn) {
    throw new HttpForbiddenError();
  }

  const tenantId = useTenantHeader(event);

  if (!guard.hasPermissionTo(PermissionId.CAN_READ_MAIL_TEMPLATES, tenantId)) {
    throw new HttpForbiddenError();
  }

  const mailTemplate = await prisma.mailTemplate.findUnique({
    select: {
      id: true,
      title: true,
      content: true
    },
    where: {
      id: event.context.params.mailTemplateId
    }
  });

  // if (!mailTemplate) {
  //   return createNotFoundError();
  // }

  return { default: mailTemplate };
});
