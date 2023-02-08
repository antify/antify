import { Media } from '../../datasources/media.schema';
import { getDatabaseClientFromRequest } from '../../utils/getDatabaseClient';
import { isLoggedInHandler } from '@antify/ant-guard';

export default defineEventHandler(async (event) => {
  // const tenantId = tenantContextMiddleware(event);
  // const guard = useGuard(useAuthorizationHeader(event));

  // if (!guard.hasPermissionTo(PermissionId.CAN_CREATE_MEDIA, tenantId)) {
  //   throw new HttpForbiddenError();
  // }

  isLoggedInHandler(event);

  const response = await useNitroApp().hooks.callHook(
    'before:media.post',
    event
  );

  if (response) {
    return response;
  }

  const files = await readBody(event);
  // TODO:: validate files

  const client = await getDatabaseClientFromRequest(event);
  const MediaModel = client.getModel<Media>('medias');

  await MediaModel.insertMany(files);

  return {};
});
