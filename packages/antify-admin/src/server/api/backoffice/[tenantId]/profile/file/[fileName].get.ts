import { useAuthorizationHeader } from '~~/server/utils/useAuthorizationHeader';
import { PermissionId } from '~~/server/datasources/static/permissions';
import { tenantContextMiddleware } from '~~/server/guard/tenantContext.middleware';
import { HttpForbiddenError, HttpNotFoundError } from '~~/server/errors';
import { sendStream } from 'h3';
import { useMediaService } from '~~/server/service/useMediaService';
import { useGuard } from '~~/composables/useGuard';
import { User } from '~~/server/datasources/core/schemas/user';
import { useCoreClient } from '~~/server/service/useCoreClient';

// TODO:: this endpoint makes no sense. Redesign it to use cockpit media endpoint
export default defineEventHandler(async (event) => {
  const tenantId = tenantContextMiddleware(event);
  const guard = useGuard(useAuthorizationHeader(event));

  if (!guard.hasPermissionTo(PermissionId.CAN_READ_MEDIA, tenantId)) {
    throw new HttpForbiddenError();
  }

  const user = await (await useCoreClient().connect())
    .getModel<User>('users')
    .findById(guard.token?.id);

  if (!user?.profilePicture) {
    throw new HttpNotFoundError();
  }

  return sendStream(
    event,
    useMediaService(user.profilePicture).createReadStream()
  );
});
