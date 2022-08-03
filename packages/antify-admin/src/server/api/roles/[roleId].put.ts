import prisma from "~~/server/datasources/core/client";
import { useGuard } from "~~/composables/useGuard";
import { PermissionId } from '~~/server/datasources/static/permissions';
import { HttpBadRequestError, HttpForbiddenError, HttpNotFoundError } from '~~/server/errors';
import { tenantContextMiddleware } from '~~/server/guard/tenantContext.middleware';
import { useAuthorizationHeader } from '~~/server/utils/useAuthorizationHeader';
import { useTenantHeader } from '~~/server/utils/useTenantHeader';

export type RoleResponse = {
  id: string,
  name: string,
  isAdmin: boolean,
  permissions: string[]
}
export type RoleInput = {
  name: string,
  permissions: string[]
}

export const validate = (data: Record<string, string>): RoleInput => {
  if (!data.name) {
    throw new HttpBadRequestError('Missing required name');
  }

  if (!Array.isArray(data.permissions)) {
    throw new HttpBadRequestError('Missing required permissions');
  }

  return data as RoleInput;
}

export default defineEventHandler<RoleResponse>(async (event) => {
  tenantContextMiddleware(event);

  const guard = useGuard(useAuthorizationHeader(event));
  const tenantId = useTenantHeader(event);

  if (!guard.hasPermissionTo(PermissionId.CAN_UPDATE_ROLE, tenantId)) {
    throw new HttpForbiddenError();
  }

  const role = await prisma.role.findUnique({
    select: {
      id: true
    },
    where: {
      id: event.context.params.roleId
    }
  });

  if (!role) {
    throw new HttpNotFoundError();
  }

  const requestBody = await useBody(event);
  const requestData = validate(requestBody);
  const updatedRole = await prisma.role.update({
    select: {
      id: true,
      name: true,
      isAdmin: true,
      permissions: {
        select: {
          permissionId: true
        }
      }
    },
    where: {
      id: event.context.params.roleId
    },
    data: {
      name: requestData.name,
      permissions: {
        deleteMany: {},
        create: requestData.permissions.map((permissionId: string) => {
          return {
            permissionId: permissionId
          }
        })
      }
    }
  });

  return {
    ...updatedRole,
    permissions: updatedRole.permissions
      .map(permission => permission.permissionId)
  };
});
