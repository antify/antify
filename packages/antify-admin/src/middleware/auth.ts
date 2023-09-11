import { useGuard } from '@antify/ant-guard';

export default defineNuxtRouteMiddleware(() => {
  if (!useGuard(useNuxtApp()?.ssrContext?.event).isLoggedIn()) {
    return navigateTo({ name: 'login' });
  }
});
