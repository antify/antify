import {
  Input,
  validator,
  Response,
} from '~~/glue/api/backoffice/[tenantId]/tenant/index.put';
import { Tenant } from '~~/server/datasources/core/schemas/tenant';
import { useCoreClient } from '~~/server/service/useCoreClient';

export default defineEventHandler<Response>(async (event) => {
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

  tenant.name = requestData.name;

  await tenant.save();

  return {
    default: {
      id: tenant.id,
      name: tenant.name,
    },
  };
});
