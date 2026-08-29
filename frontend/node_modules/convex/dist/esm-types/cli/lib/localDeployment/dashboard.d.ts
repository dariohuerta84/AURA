import { Context } from "../../../bundler/context.js";
export declare const DEFAULT_LOCAL_DASHBOARD_PORT = 6790;
/**
 * This runs the `dashboard-self-hosted` app locally.
 * It's currently just used for the `anonymous` flow, while everything else
 * uses `dashboard.convex.dev`, and some of the code below is written
 * assuming this is only used for `anonymous`.
 */
export declare function handleDashboard(ctx: Context, deployment: {
    name: string;
    cloudPort: number;
    adminKey: string;
}, options: {
    /** The backend version to use if the user overrides the default version with the --local-backend-version flag */
    backendVersion: string | undefined;
}): Promise<{
    dashboardPort: number;
    cleanupHandle: string;
}>;
export declare function dashboardUrl(ctx: Context, deploymentName: string): string | null;
//# sourceMappingURL=dashboard.d.ts.map