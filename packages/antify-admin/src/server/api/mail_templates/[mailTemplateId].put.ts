import prisma from "~~/server/datasources/tenant/client";
import { 
  Input, 
  validator,
  Response
} from '~~/glue/api/mail_templates/[mailTemplateId].put';
import { useAuthorizationHeader } from "~~/server/utils/useAuthorizationHeader";
import { HttpForbiddenError } from "~~/server/errors";
import { useTenantHeader } from "~~/server/utils/useTenantHeader";
import { PermissionId } from "~~/server/datasources/static/permissions";

export default defineEventHandler<Response>(async (event) => {
  const guard = useGuard(useAuthorizationHeader(event));

  if (!guard.isUserLoggedIn) {
    throw new HttpForbiddenError();
  }

  const tenantId = useTenantHeader(event);

  if (!guard.hasPermissionTo(PermissionId.CAN_EDIT_MAIL_TEMPLATES, tenantId)) {
    throw new HttpForbiddenError();
  }

  const requestData = await useBody<Input>(event);

  validator.validate(requestData);

  if (validator.hasErrors()) {
    return {
      badRequest: {
        errors: validator.getErrors()
      }
    }
  }

  // TODO:: what if not exists?

  const mailTemplate = await prisma.mailTemplate.update({
    select: {
      id: true,
      title: true,
      content: true,
    },
    where: {
      id: event.context.params.mailTemplateId
    },
    data: {
      title: requestData.title,
      content: requestData.content
    }
  });

  return {
    default: mailTemplate
  }
});
