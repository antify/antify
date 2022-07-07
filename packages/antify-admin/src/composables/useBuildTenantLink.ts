import { LocationAsRelativeRaw, RouteLocationNormalizedLoaded } from 'vue-router';

export const useBuildTenantLink = (to: LocationAsRelativeRaw, route: RouteLocationNormalizedLoaded): LocationAsRelativeRaw => {
    const tenantId = route.params.tenantId;

    if (!tenantId) {
        throw new Error('Can not build tenant link outside of tenant context. Make sure the page which is using TenantLink is under the [tenantId] folder.');
    }

    return {
        ...to,
        params: { ...to.params, tenantId }
    };
}