import {
  Input,
  validator,
} from '~~/glue/api/cockpit/tenants/[tenantDetailId].put';
import { isSuperAdminMiddleware } from '~~/server/guard/isSuperAdmin.middleware';
import { Tenant } from '~~/server/datasources/core/schemas/tenant';
import { useCoreClient } from '~~/server/service/useCoreClient';

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

  const TenantModel = (await useCoreClient().connect()).getModel<Tenant>(
    'tenants'
  );
  const tenant = await TenantModel.findById(
    event.context.params.tenantDetailId
  );

  if (!tenant) {
    return {
      notFound: {
        errors: ['Not Found'],
      },
    };
  }

  await TenantModel.updateOne({ id: event.context.params?.tenantDetailId }, { name: requestData.name });

  return {
    default: {
      id: tenant.id,
      name: tenant.name,
    },
  };
});
