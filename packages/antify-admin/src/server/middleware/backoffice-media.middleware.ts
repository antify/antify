import { H3Event } from 'h3';
import { PermissionId } from '../datasources/static/permissions';
import { tenantContextMiddleware } from '../guard/tenantContext.middleware';
import { useAuthorizationHeader } from '../utils/useAuthorizationHeader';
import { useGuard } from '@antify/ant-guard';

export default defineEventHandler(() => {
  useNitroApp().hooks.hook('before:media-[mediaId].put', (event: H3Event) =>
    checkPermissionsHandler(event, PermissionId.CAN_EDIT_MEDIA)
  );
  useNitroApp().hooks.hook('before:media-[mediaId].get', (event: H3Event) =>
    checkPermissionsHandler(event, PermissionId.CAN_READ_MEDIA)
  );
  useNitroApp().hooks.hook('before:media-[mediaId].delete', (event: H3Event) =>
    checkPermissionsHandler(event, PermissionId.CAN_DELETE_MEDIA)
  );
  useNitroApp().hooks.hook('before:media.get', (event: H3Event) =>
    checkPermissionsHandler(event, PermissionId.CAN_READ_MEDIA)
  );
  useNitroApp().hooks.hook('before:media.post', (event: H3Event) =>
    checkPermissionsHandler(event, PermissionId.CAN_CREATE_MEDIA)
  );

  const checkPermissionsHandler = (
    event: H3Event,
    permission: PermissionId
  ) => {
    const tenantId = tenantContextMiddleware(event);
    const guard = useGuard(useAuthorizationHeader(event));

    if (!guard.hasPermissionTo(permission, tenantId)) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden',
      });
    }
  };
});
