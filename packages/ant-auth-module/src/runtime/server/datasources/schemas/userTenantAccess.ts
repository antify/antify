import { Role } from './roles';
import { Tenant } from './tenant';
import { User } from './user';

export interface UserTenantAccess {
  user: User;
  tenant: Tenant;
  role: Role;
  isBanned: Boolean;
  isPending: Boolean;
}
