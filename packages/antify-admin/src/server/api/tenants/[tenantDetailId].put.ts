import prisma from "~~/server/datasources/auth/client";
import { 
  Input, 
  validator,
  Response
} from '~~/glue/api/tenants/[tenantDetailId].put';

export default defineEventHandler<Response>(async (event) => {
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

  const tenant = await prisma.tenant.update({
    select: {
      id: true,
      name: true,
    },
    where: {
      id: event.context.params.tenantDetailId
    },
    data: {
      name: requestData.name,
    }
  });

  return {
    default: tenant
  }
});
