import prisma from "~~/server/datasources/db/client";
import { useGuard } from "~~/composables/useGuard";
import { PermissionId } from '~~/server/datasources/static/permissions';
import { createBadRequestError, createForbiddenError, createNotFoundError, createUnauthorizedError } from '~~/server/errors';
import { tenantContextMiddleware } from '~~/server/guard/tenantContext.middleware';
import { useAuthorizationHeader } from '~~/server/utils/useAuthorizationHeader';
import { useTenantHeader } from '~~/server/utils/useTenantHeader';

export type UserResponse = {
    id: string,
    email: string,
    name: string | null,
    roleId: string | null
}
export type UserInput = {
    email: string,
    name: string | null,
    roleId: string
}

export const validate = (data: Record<string, string>): UserInput => {
    if (!data.email) {
        throw new Error('Missing required email');
    }

    if (!data.name) {
        throw new Error('Missing required name');
    }

    if (!data.roleId) {
        throw new Error('Missing required role');
    }

    return data as UserInput;
}

export default defineEventHandler(async (event) => {
    tenantContextMiddleware(event);
  
    const guard = useGuard(useAuthorizationHeader(event));
    const tenantId = useTenantHeader(event);
    const user = await prisma.user.findUnique({
        select: {
            id: true,
            email: true,
            name: true
        },
        where: {
            id: event.context.params.userId
        }
    });

    if (!user) {
        return createNotFoundError();
    }

    if (!guard.hasPermissionTo(PermissionId.CAN_UPDATE_USER, tenantId) &&
        !(user.id === guard.token.id && guard.hasPermissionTo(PermissionId.CAN_UPDATE_SELF, tenantId))) {
        return createForbiddenError();
    }

    const requestBody = await useBody<UserInput>(event);
    let requestUser;

    try {
        requestUser = validate(requestBody);
    } catch (e) {
        return createBadRequestError({ message: e.message });
    }

    const updatedUser = await prisma.user.update({
        select: {
            id: true,
            email: true,
            name: true,
            tenantAccesses: {
                select: {
                    tenantId: true,
                    roleId: true
                }
            }
        },
        where: {
            id: event.context.params.userId
        },
        data: {
            email: requestUser.email,
            name: requestUser.name,
            tenantAccesses: {
                delete: {
                    userId_tenantId: {
                        tenantId: tenantId,
                        userId: requestUser.id
                    }
                },
                create: {
                    tenantId: tenantId,
                    roleId: requestUser.roleId
                }
            }
        }
    });

    return {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        roleId: updatedUser.tenantAccesses.find(tenantAccess => tenantAccess.tenantId === tenantId)?.roleId
    };
});
