import { Tenant } from './tenant';

export interface Role {
  isAdmin: boolean;
  name: string;
  permissions: string[];
  tenant: Tenant;
}
