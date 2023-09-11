import { handleCreateToken } from "~~/server/utils/tokenUtil";
import { useServerGuard } from '@antify/ant-guard';
import { authenticatedMiddleware } from "~~/server/guard/authenticated.middleware";
import { AuthRefreshTokenPostResponse } from "~~/glue/api/auth/refresh_token.post";

export default defineEventHandler<AuthRefreshTokenPostResponse>(async (event) => {
  await authenticatedMiddleware(event);

  const guard = await useServerGuard(event);
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
