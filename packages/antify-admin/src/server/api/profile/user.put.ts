import prisma from "~~/server/datasources/core/client";
import { useGuard } from "~~/composables/useGuard";
import { PermissionId } from '~~/server/datasources/static/permissions';
import { HttpForbiddenError } from '~~/server/errors';
import { tenantContextMiddleware } from '~~/server/guard/tenantContext.middleware';
import { useAuthorizationHeader } from '~~/server/utils/useAuthorizationHeader';
import { useTenantHeader } from '~~/server/utils/useTenantHeader';
import { Input, Response, validator } from "~~/glue/api/profile/user.put";

export default defineEventHandler<Response>(async (event) => {
    tenantContextMiddleware(event);

    const guard = useGuard(useAuthorizationHeader(event));
    const tenantId = useTenantHeader(event);
    const userId = guard.token.id;
    const user = await prisma.user.findUnique({
        select: {
            id: true,
            email: true,
            name: true
        },
        where: {
            id: userId
        }
    });

    if (!user) {
        throw new HttpForbiddenError();
    }

    if (!guard.hasPermissionTo(PermissionId.CAN_UPDATE_USER, tenantId) &&
        !(user.id === userId && guard.hasPermissionTo(PermissionId.CAN_UPDATE_SELF, tenantId))) {
        throw new HttpForbiddenError();
    }

    const requestData = await useBody<Input>(event);

    validator.validate(requestData);

    if (validator.hasErrors()) {
        return {
            badRequest: {
                errors: validator.getErrors()
            }
        }
    }

    const updatedUser = await prisma.user.update({
        select: {
            id: true,
            email: true,
            name: true
        },
        where: {
            id: userId
        },
        data: {
            email: requestData.email,
            name: requestData.name
        }
    });

    return {
        default: updatedUser
    };
});
