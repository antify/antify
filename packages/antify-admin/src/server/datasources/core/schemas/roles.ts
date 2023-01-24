import { Tenant } from './tenant';

export interface Role {
  isAdmin: boolean;
  name: string;
  permissions: string[];
  // TODO:: Rly a date? Its a timestamp right?
  createdAt: Date;
  // TODO:: Rly a date? Its a timestamp right?
  updatedAt: Date;
  tenant: Tenant;
}
