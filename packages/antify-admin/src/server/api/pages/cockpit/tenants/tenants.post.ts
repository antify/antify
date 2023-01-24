import { Input, validator } from '~~/glue/api/cockpit/tenants/tenants.post';
import { isSuperAdminMiddleware } from '~~/server/guard/isSuperAdmin.middleware';
import { Tenant } from '~~/server/datasources/core/schemas/tenant';

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

  const tenant = new TenantModel({ name: requestData.name });

  await tenant.save();

  return {
    default: {
      id: tenant.id,
      name: tenant.name,
    },
  };
});
