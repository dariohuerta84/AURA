import { Command } from "@commander-js/extra-typings";
import { Context } from "../bundler/context.js";
import { DeploymentSelection } from "./lib/deploymentSelection.js";
export declare const deploymentCreate: Command<[string | undefined], {
    type?: "dev" | "prod" | "preview";
    region?: string;
    class?: string;
    select?: true;
    default?: true;
    expiration?: string;
    expiry?: string;
    expires?: string;
}, {}>;
export declare function createLocalDeployment(ctx: Context, currentDeployment: DeploymentSelection, select: boolean, baseDeployment: {
    teamSlug: string;
    projectSlug: string;
} | null): Promise<void>;
export declare function fetchAvailableRegions(ctx: Context, teamId: number): Promise<{
    available: boolean;
    displayName: string;
    name: "aws-us-east-1" | "aws-eu-west-1";
}[]>;
type AvailableRegion = Awaited<ReturnType<typeof fetchAvailableRegions>>[number];
export declare function resolveRegionDetails(availableRegions: AvailableRegion[], region: string): {
    available: boolean;
    displayName: string;
    name: "aws-us-east-1" | "aws-eu-west-1";
} | null;
export declare function fetchAvailableClasses(ctx: Context, teamId: number): Promise<{
    available: boolean;
    type: "s16" | "s256" | "d1024" | "d2048";
}[]>;
type AvailableClass = Awaited<ReturnType<typeof fetchAvailableClasses>>[number];
export declare function resolveClassDetails(availableClasses: AvailableClass[], className: string): {
    available: boolean;
    type: "s16" | "s256" | "d1024" | "d2048";
} | null;
export {};
//# sourceMappingURL=deploymentCreate.d.ts.map