import { tenantContextMiddleware } from '../../guard/tenantContext.middleware';
import { useServerGuard } from '@antify/ant-guard';
import { HttpForbiddenError } from '../../errors';
import { PermissionId } from '../../datasources/static/permissions';
import { useMediaService } from '../../service/useMediaService';
import { User } from '~~/server/datasources/core/schemas/user';
import { Media } from '~~/server/datasources/core/schemas/media';
import { useCoreClient } from '~~/server/service/useCoreClient';

/**
 * TODO:: remove this request and implement image remove logic in user.put request.
 */
export default defineEventHandler(async (event) => {
  const tenantId = await tenantContextMiddleware(event);
  const guard = await useServerGuard(event);
  const coreClient = await useCoreClient().connect();
  const user = await coreClient
    .getModel<User>('users')
    .findById(guard.token?.id)
    .populate('profilePicture');

  if (!user) {
    return {
      errors: ['Not Found'],
      errorType: 'NOT_FOUND',
    };
  }

  if (
    !guard.hasPermissionTo(PermissionId.CAN_REMOVE_PROFILE_PICTURE, tenantId)
  ) {
    throw new HttpForbiddenError();
  }

  if (!user.profilePicture) {
    return {};
  }

  // Delete from file system
  await useMediaService(user.profilePicture).deleteFile();

  // Delete in media table
  await coreClient.getModel<Media>('medias').remove(user.profilePicture);

  return {};
});
