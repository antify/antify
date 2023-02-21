import { TENANT_KEY } from '@antify/context';

export const useTenantHeader = (tenantId: string) => ({
  [TENANT_KEY]: tenantId,
});
