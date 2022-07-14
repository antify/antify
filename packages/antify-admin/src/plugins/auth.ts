import { TOKEN_COOKIE_KEY } from "../composables/useGuard";

export default defineNuxtPlugin(nuxtApp => {
  return {
    provide: {
      auth: {
        async login(identifier: String, password: String) {
          return useFetch('/api/auth/login', {
            method: 'POST',
            body: {
              email: identifier,
              password
            },
            headers: {
              'Content-Type': 'application/json'
            }
          });
        },
        async refreshToken(): Promise<void> {
          await useFetch('/api/auth/refresh_token', {
            method: 'POST',
            body: {},
            headers: {
              'Content-Type': 'application/json'
            }
          });
        },
        async logout() {
          useCookie(TOKEN_COOKIE_KEY).value = null;
          await navigateTo({name: 'login'});
        },
        getGuard() {
          return useGuard(useCookie(TOKEN_COOKIE_KEY).value || null);
        }
      }
    }
  }
});
