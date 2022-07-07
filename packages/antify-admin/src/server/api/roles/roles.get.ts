import prisma from "~~/server/datasources/db/client";
import { useGuard } from "~~/composables/useGuard";
import { createForbiddenError } from '~~/server/errors';
import { useAuthorizationHeader } from '~~/server/utils/useAuthorizationHeader';

export default defineEventHandler(async (event) => {
    const guard = useGuard(useAuthorizationHeader(event));

    if (!guard.isUserLoggedIn) {
        return createForbiddenError();
    }

    // TODO:: check permission

    const roles = await prisma.role.findMany({
        select: {
            id: true,
            name: true,
            isAdmin: true,
            permissions: {
                select: {
                    permissionId: true
                }
            }
        }
    });

    return roles.map(role => {
        return {
            ...role,
            permissions: role.permissions
                .map(permission => permission.permissionId)
        }
    });
});
