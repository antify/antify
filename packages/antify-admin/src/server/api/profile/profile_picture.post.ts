import { tenantContextMiddleware } from '../../guard/tenantContext.middleware';
import { useAuthorizationHeader } from '../../utils/useAuthorizationHeader';
import { useTenantHeader } from '../../utils/useTenantHeader';
import { PermissionId } from '../../datasources/static/permissions';
import { HttpForbiddenError } from '../../errors';

export default defineEventHandler(async (event) => {
  tenantContextMiddleware(event);

  const guard = useGuard(useAuthorizationHeader(event));
  const tenantId = useTenantHeader(event);

  if (
    !guard.hasPermissionTo(PermissionId.CAN_UPLOAD_PROFILE_PICTURE, tenantId)
  ) {
    throw new HttpForbiddenError();
  }

  // TODO:: Check filetype (virus scanner?)

  // TODO:: Save file in storage

  
});
