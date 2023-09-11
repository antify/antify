import { H3Event } from 'h3';
import { PermissionId } from '../datasources/static/permissions';
import { tenantContextMiddleware } from '../guard/tenantContext.middleware';
import { useServerGuard } from '@antify/ant-guard';

export default defineEventHandler(async () => {
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

  const checkPermissionsHandler = async (
    event: H3Event,
    permission: PermissionId
  ) => {
    const tenantId = await tenantContextMiddleware(event);
    const guard = await useServerGuard(event);

    if (!guard.hasPermissionTo(permission, tenantId)) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden',
      });
    }
  };
});
