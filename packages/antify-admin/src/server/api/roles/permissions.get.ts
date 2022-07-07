import { useGuard } from "~~/composables/useGuard";
import { permissions } from '~~/server/datasources/static/permissions';
import { createForbiddenError } from '~~/server/errors';
import { useAuthorizationHeader } from '~~/server/utils/useAuthorizationHeader';

export default defineEventHandler(async (event) => {
    const guard = useGuard(useAuthorizationHeader(event));

    if (!guard.isUserLoggedIn) {
        return createForbiddenError();
    }

    // TODO:: check permission

    return permissions;
});
