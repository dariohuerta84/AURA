import { Context } from "../../../bundler/context.js";
import { DeploymentDetails } from "../deployment.js";
export declare function handleLocalDeployment(ctx: Context, options: {
    teamSlug: string;
    projectSlug: string;
    ports: {
        cloud: number | undefined;
        site: number | undefined;
    };
    backendVersion?: string | undefined;
    forceUpgrade: boolean;
}): Promise<DeploymentDetails>;
export declare function loadLocalDeploymentCredentials(ctx: Context, deploymentName: string): Promise<{
    deploymentName: string;
    deploymentUrl: string;
    adminKey: string;
}>;
/** Copies the default dev env vars from big brain the first time the local dev backend is started */
export declare function importDefaultEnvVars(ctx: Context, { teamSlug, projectSlug, deploymentName, deploymentUrl, adminKey, }: {
    teamSlug: string;
    projectSlug: string;
    deploymentName: string;
    deploymentUrl: string;
    adminKey: string;
}): Promise<undefined>;
//# sourceMappingURL=localDeployment.d.ts.map