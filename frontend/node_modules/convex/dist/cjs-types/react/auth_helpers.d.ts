import React from "react";
import { ReactNode } from "react";
/**
 * Renders children if the client is authenticated.
 *
 * @public
 */
export declare function Authenticated({ children }: {
    children: ReactNode;
}): React.JSX.Element | null;
/**
 * Renders children if the client is using authentication but is not authenticated.
 *
 * @public
 */
export declare function Unauthenticated({ children }: {
    children: ReactNode;
}): React.JSX.Element | null;
/**
 * Renders children if the client isn't using authentication or is in the process
 * of authenticating.
 *
 * @public
 */
export declare function AuthLoading({ children }: {
    children: ReactNode;
}): React.JSX.Element | null;
/**
 * Renders children while the client is refreshing the auth token for an
 * already-authenticated session (the server rejected the current token and
 * the socket is paused while a new one is fetched). Routine background
 * token rotation does not trigger this state.
 *
 * Whether used inside of `<Authenticated>` or not, children will only be
 * rendered if the user is authenticated.
 *
 * @public
 */
export declare function AuthRefreshing({ children }: {
    children: ReactNode;
}): React.JSX.Element | null;
//# sourceMappingURL=auth_helpers.d.ts.map