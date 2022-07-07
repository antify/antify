import { CompatibilityEvent } from "h3";
import { HttpForbiddenError } from "../errors";
import { useAuthorizationHeader } from "../utils/useAuthorizationHeader";
import { useGuard } from "~~/composables/useGuard";
import { tokenValid } from "../utils/tokenUtil";

export const authenticatedMiddleware = (event: CompatibilityEvent): void => {
    const guard = useGuard(useAuthorizationHeader(event));

    // useGuard only url decode the token. Verify it is valid.
    if (!tokenValid(guard.rawToken) || !guard.isUserLoggedIn) {
        throw new HttpForbiddenError();
    }
}