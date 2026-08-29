import { Command } from "@commander-js/extra-typings";
import { Context } from "../bundler/context.js";
import { DeploymentSelectionOptions, DetailedDeploymentCredentials } from "./lib/api.js";
export declare function selectEnvDeployment(options: DeploymentSelectionOptions): Promise<{
    ctx: Context;
    deployment: {
        deploymentUrl: string;
        adminKey: string;
        deploymentNotice: string;
        deploymentFields: DetailedDeploymentCredentials["deploymentFields"];
    };
}>;
export declare const env: Command<[], {
    envFile?: string;
    url?: string;
    adminKey?: string;
    prod?: boolean;
    previewName?: string;
    deploymentName?: string;
    deployment?: string;
}, {}>;
//# sourceMappingURL=env.d.ts.map