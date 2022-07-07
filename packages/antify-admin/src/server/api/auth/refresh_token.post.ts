import { handleCreateToken } from "~~/server/utils/tokenUtil";
import { useAuthorizationHeader } from '~~/server/utils/useAuthorizationHeader';
import { useGuard } from "~~/composables/useGuard";
import { authenticatedMiddleware } from "~~/server/guard/authenticated.middleware";
import { AuthRefreshTokenPostResponse } from "~~/glue/api/auth/refresh_token.post";

export default defineEventHandler<AuthRefreshTokenPostResponse>(async (event) => {
  authenticatedMiddleware(event);

  const guard = useGuard(useAuthorizationHeader(event));
  const token = await handleCreateToken(event, {
    id: guard.token.id
  });

  if (!token) {
    return {
      invalidCredentials: {
        errors: [
          // TODO:: translate me
          'Invalid credentials - please try again'
        ]
      }
    }
  }

  return {
    default: {
      token
    }
  }
});
