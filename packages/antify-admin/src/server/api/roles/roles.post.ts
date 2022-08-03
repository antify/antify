import prisma from "~~/server/datasources/core/client";
import { useGuard } from "~~/composables/useGuard";
import { PermissionId } from '~~/server/datasources/static/permissions';
import { HttpBadRequestError, HttpForbiddenError } from '~~/server/errors';
import { tenantContextMiddleware } from '~~/server/guard/tenantContext.middleware';
import { useAuthorizationHeader } from '~~/server/utils/useAuthorizationHeader';
import { useTenantHeader } from '~~/server/utils/useTenantHeader';

export type RoleResponse = {
  id: string;
  name: string;
  isAdmin: boolean;
  permissions: string[];
};
export type RoleInput = {
  name: string;
  permissions: string[];
};

export const validate = (data: RoleInput): RoleInput => {
  if (!data.name) {
    throw new HttpBadRequestError('Missing required name');
  }

  if (!Array.isArray(data.permissions)) {
    throw new HttpBadRequestError('Missing required permissions');
  }

  return data;
};

export default defineEventHandler<RoleResponse>(async (event) => {
  tenantContextMiddleware(event);

  const guard = useGuard(useAuthorizationHeader(event));
  const tenantId = useTenantHeader(event);

  if (!guard.hasPermissionTo(PermissionId.CAN_CREATE_ROLE, tenantId)) {
    throw new HttpForbiddenError();
  }

  const requestBody = await useBody(event);
  const requestData = validate(requestBody);
  const createdRole = await prisma.role.create({
    select: {
      id: true,
      name: true,
      isAdmin: true,
      permissions: {
        select: {
          permissionId: true,
        },
      },
    },
    data: {
      name: requestData.name,
      isAdmin: false,
      permissions: {
        create: requestData.permissions.map((permissionId: string) => {
          return {
            permissionId: permissionId,
          };
        }),
      },
    },
  });

  return {
    ...createdRole,
    permissions: createdRole.permissions.map(
      (permission) => permission.permissionId
    ),
  };
});
