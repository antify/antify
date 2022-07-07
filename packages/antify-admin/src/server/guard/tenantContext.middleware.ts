import { CompatibilityEvent } from "h3";
import { HttpBadRequestError } from "../errors";
import { useTenantHeader } from "../utils/useTenantHeader";
import { authenticatedMiddleware } from "./authenticated.middleware";

export const tenantContextMiddleware = (event: CompatibilityEvent): void => {
    authenticatedMiddleware(event);

    const tenantId = useTenantHeader(event);

    if (!tenantId) {
        throw new HttpBadRequestError();
    }
}