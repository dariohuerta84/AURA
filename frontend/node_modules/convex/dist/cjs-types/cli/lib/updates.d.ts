import type { Context } from "../../bundler/context.js";
/**
 * Fetch the latest version data, log any server nag message, and warn if
 * Convex AI files are out of date. Both checks share the one getVersion()
 * round-trip.
 */
export declare function checkVersionAndAiFilesStaleness(ctx: Context): Promise<void>;
//# sourceMappingURL=updates.d.ts.map