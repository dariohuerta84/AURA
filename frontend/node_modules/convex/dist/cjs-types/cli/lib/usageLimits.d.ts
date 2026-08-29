import type { GetCurrentUsageResponse, UsageLimitConfigRequest, UsageLimitConfigResponse, UsageLimitMetric } from "@convex-dev/platform/deploymentApi";
import { Context } from "../../bundler/context.js";
export type UsageLimitDeployment = {
    deploymentUrl: string;
    adminKey: string;
};
export declare const USAGE_LIMIT_METRICS: readonly ["functionCalls", "queryMutationComputeGbHours", "actionComputeConvexGbHours", "actionComputeNodeJsGbHours", "actionComputeCpuGbHours", "databaseIoGb", "searchQueryGb", "dataEgressGb"];
export declare const USAGE_LIMIT_WINDOWS: readonly ["day", "month"];
export type UsageLimitWindow = (typeof USAGE_LIMIT_WINDOWS)[number];
export declare const USAGE_LIMIT_TYPES: readonly ["warning", "disable"];
export type UsageLimitType = (typeof USAGE_LIMIT_TYPES)[number];
export declare const METRIC_LABELS: Record<UsageLimitMetric, string>;
export declare function metricLabel(metric: string): string;
export declare function listUsageLimits(ctx: Context, deployment: UsageLimitDeployment): Promise<UsageLimitConfigResponse[]>;
export declare function createUsageLimit(ctx: Context, deployment: UsageLimitDeployment, config: UsageLimitConfigRequest): Promise<UsageLimitConfigResponse>;
export declare function updateUsageLimit(ctx: Context, deployment: UsageLimitDeployment, id: string, config: UsageLimitConfigRequest): Promise<UsageLimitConfigResponse>;
export declare function deleteUsageLimit(ctx: Context, deployment: UsageLimitDeployment, id: string): Promise<void>;
export declare function getCurrentUsage(ctx: Context, deployment: UsageLimitDeployment): Promise<GetCurrentUsageResponse>;
export declare function compareUsageLimits(a: {
    metric: string;
    window: string;
    limitType: string;
}, b: {
    metric: string;
    window: string;
    limitType: string;
}): number;
export declare function compareMetricNames(a: string, b: string): number;
export type UsageLimitStatus = UsageLimitConfigResponse & {
    currentUsage: number | null;
    unit: string | null;
    triggered: boolean;
};
export declare function listUsageLimitsWithStatus(ctx: Context, deployment: UsageLimitDeployment): Promise<{
    limits: UsageLimitStatus[];
    seedStatus: GetCurrentUsageResponse["seedStatus"];
}>;
export type UsageLimitKey = {
    metric: UsageLimitMetric;
    window: string;
    limitType: string;
};
export declare function findUsageLimitByKey(ctx: Context, deployment: UsageLimitDeployment & {
    deploymentNotice: string;
}, key: UsageLimitKey): Promise<UsageLimitConfigResponse>;
//# sourceMappingURL=usageLimits.d.ts.map