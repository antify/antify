import prisma from '~~/server/datasources/auth/client';
import { useGuard } from '~~/composables/useGuard';
import { PermissionId } from '~~/server/datasources/static/permissions';
import {
  HttpBadRequestError,
  HttpForbiddenError,
  HttpNotFoundError,
} from '~~/server/errors';
import { tenantContextMiddleware } from '~~/server/guard/tenantContext.middleware';
import { useAuthorizationHeader } from '~~/server/utils/useAuthorizationHeader';
import { useTenantHeader } from '~~/server/utils/useTenantHeader';
import { Response } from '~~/glue/api/admin/[tenantId]/roles/[roleId].get';

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

  return data as RoleInput;
};

export default defineEventHandler<Response>(async (event) => {
  tenantContextMiddleware(event);

  const guard = useGuard(useAuthorizationHeader(event));
  const tenantId = useTenantHeader(event);

  if (!guard.hasPermissionTo(PermissionId.CAN_UPDATE_ROLE, tenantId)) {
    throw new HttpForbiddenError();
  }

  const role = await prisma.role.findUnique({
    select: {
      id: true,
    },
    where: {
      id: event.context.params.roleId,
    },
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
          permissionId: true,
        },
      },
    },
    where: {
      id: event.context.params.roleId,
    },
    data: {
      name: requestData.name,
      permissions: {
        deleteMany: {},
        create: requestData.permissions.map((permissionId: string) => {
          return {
            permissionId: permissionId,
          };
        }),
      },
    },
  });
  await new Promise((resolve) => {
    setTimeout(() => resolve(true), 2000);
  });

  return {
    default: {
      ...updatedRole,
      permissions: updatedRole.permissions.map(
        (permission) => permission.permissionId
      ),
    },
  };
});
