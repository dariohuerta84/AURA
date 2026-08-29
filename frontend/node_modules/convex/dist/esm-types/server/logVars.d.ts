declare const REQUEST_ID: unique symbol;
declare const IP: unique symbol;
declare const USER_AGENT: unique symbol;
declare const NOW: unique symbol;
declare const CONVEX_ACTOR: unique symbol;
export type LogVar = typeof REQUEST_ID | typeof IP | typeof USER_AGENT | typeof NOW | typeof CONVEX_ACTOR;
export declare const varNames: Record<symbol, string>;
export declare const vars: {
    /** Resolved to the request ID. */
    readonly requestId: typeof REQUEST_ID;
    /** Resolved to the client's IP address. */
    readonly ip: typeof IP;
    /** Resolved to the client's User-Agent header. */
    readonly userAgent: typeof USER_AGENT;
    /**
     * Resolved to the current server timestamp, as milliseconds from the
     * Unix epoch.
     */
    readonly now: typeof NOW;
    /**
     * If the function was invoked using admin auth (either directly or while
     * acting as an end user, e.g. from the dashboard), resolved to information
     * about the admin. Otherwise, resolved to `null`.
     */
    readonly convexActor: typeof CONVEX_ACTOR;
};
export {};
//# sourceMappingURL=logVars.d.ts.map