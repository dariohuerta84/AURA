import { Command } from "@commander-js/extra-typings";
import { Context } from "../bundler/context.js";
import { DeploymentSelection } from "./lib/deploymentSelection.js";
export declare const deploymentSelect: Command<[string], {}, {}>;
export declare function saveSelectedDeployment(ctx: Context, selector: string, selection: DeploymentSelection, previousDeploymentName: string | null): Promise<import("./lib/api.js").DetailedDeploymentCredentials>;
//# sourceMappingURL=deploymentSelect.d.ts.map