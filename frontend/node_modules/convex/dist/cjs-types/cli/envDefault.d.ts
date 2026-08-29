import { Command } from "@commander-js/extra-typings";
import { EnvVarBackend } from "./lib/env.js";
import { CloudDeploymentType, DeploymentType } from "./lib/api.js";
import { Context } from "../bundler/context.js";
export declare const envDefault: Command<[], {}, {}>;
export declare function resolveDefaultEnvBackend(ctx: Context, deploymentFields: {
    deploymentName: string;
    deploymentType: DeploymentType;
} | null, dtypeOverride?: CloudDeploymentType): Promise<EnvVarBackend>;
//# sourceMappingURL=envDefault.d.ts.map