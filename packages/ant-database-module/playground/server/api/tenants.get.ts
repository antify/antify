import { Tenant } from '../schemas/core/tenant.extension';

export default defineEventHandler(async (event) => {
  const coreClient = useCoreClient();

  await coreClient.connect();

  const TenantModel = coreClient.getModel<Tenant>('tenants');

  await new TenantModel({
    name: 'foo',
    color: '#fff',
  }).save();

  return await TenantModel.find({});
});
