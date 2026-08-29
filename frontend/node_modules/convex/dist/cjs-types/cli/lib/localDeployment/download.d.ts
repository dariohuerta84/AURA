import { Context } from "../../../bundler/context.js";
export declare function ensureBackendBinaryDownloaded(ctx: Context, version: {
    kind: "latest";
    allowedVersion?: string | undefined;
} | {
    kind: "version";
    version: string;
}): Promise<{
    binaryPath: string;
    version: string;
}>;
/**
 * Finds the latest version of the Convex local backend through
 * version.convex.dev, caching the resolved version for the lifetime of the
 * process so repeated lookups hit the network at most once.
 *
 * Wraps {@link _findLatestVersionWithBinary}. Only successful (non-null)
 * results are cached, so a failed `requireSuccess: false` lookup can be retried
 * by a later call.
 */
export declare function findLatestVersionWithBinary<RequireSuccess extends boolean>(ctx: Context, requireSuccess: RequireSuccess): Promise<RequireSuccess extends true ? string : string | null>;
/**
 * Finds the latest version of the Convex local backend
 * through version.convex.dev
 */
export declare function _findLatestVersionWithBinary<RequireSuccess extends boolean>(ctx: Context, requireSuccess: RequireSuccess): Promise<RequireSuccess extends true ? string : string | null>;
export declare function ensureDashboardDownloaded(ctx: Context, version: string): Promise<void>;
//# sourceMappingURL=download.d.ts.map