export default defineNuxtRouteMiddleware((nuxtApp) => {
    if (!useNuxtApp().$auth.getGuard().isUserLoggedIn) {
        return navigateTo({name: 'login'});
    }
});
