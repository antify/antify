import { loadCoreFixtures } from '../datasources/core/fixtures';
import { loadTenantFixtures } from '../datasources/tenant/fixtures';

const init = async () => {
  const { tenants } = await loadCoreFixtures();

  await Promise.all(tenants.map((tenant) => loadTenantFixtures(tenant.id)));
};

init();
