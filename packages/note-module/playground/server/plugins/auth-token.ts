import { setAuthorizationHeader, signToken } from "@antify/ant-guard"

export default defineNitroPlugin((nitroApp) => {
    nitroApp.hooks.hook('render:response', (response, { event }) => {
        setAuthorizationHeader(event, signToken({ id: '63f73526b5db16c4a92d6c33', isSuperAdmin: true, tenantsAccess: [] }, 'secret', 4 * 60 * 60));
    });
});
