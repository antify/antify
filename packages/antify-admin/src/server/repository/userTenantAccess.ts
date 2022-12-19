import { UserTenantAccess } from '../datasources/core/schemas/userTenantAccess';

export class UserTenantAccessRepository {
  async findByRole(roleId: string) {
    const UserTenantAccessModel = (
      await useCoreClient().connect()
    ).getModel<UserTenantAccess>('user_tenant_accesses');

    return await UserTenantAccessModel.find({
      role: roleId,
    });
  }
}
