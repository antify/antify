import prisma from "~~/server/datasources/core/client";
import { useGuard } from "~~/composables/useGuard";
import { PermissionId } from '~~/server/datasources/static/permissions';
import { HttpForbiddenError } from '~~/server/errors';
import { authenticatedMiddleware } from '~~/server/guard/authenticated.middleware';
import { useAuthorizationHeader } from '~~/server/utils/useAuthorizationHeader';
import { useTenantHeader } from '~~/server/utils/useTenantHeader';
import { Response } from "~~/glue/api/tenants/tenants.get";

export default defineEventHandler<Response>(async (event) => {
    authenticatedMiddleware(event);

    const guard = useGuard(useAuthorizationHeader(event));
    const tenantId = useTenantHeader(event);

    if (!guard.hasPermissionTo(PermissionId.CAN_READ_TENANT, tenantId)) {
        throw new HttpForbiddenError();
    }

    let where = {};

    if (!guard.token.isSuperAdmin) {
        where = {
            id: {
                in: guard.token.tenantsAccess.map(tenantAccess => tenantAccess.tenantId)
            }
        }
    }

    const tenants = await prisma.tenant.findMany({
        select: {
            id: true,
            name: true
        },
        where,
        orderBy: { name: 'asc' }
    });

    return {
        default: tenants
    }
});
