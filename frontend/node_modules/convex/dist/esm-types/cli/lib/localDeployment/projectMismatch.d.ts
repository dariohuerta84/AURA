import { ProjectResponse } from "@convex-dev/platform/managementApi";
import { Context } from "../../../bundler/context.js";
import { DeploymentSelection } from "../deploymentSelection.js";
import { ParsedDeploymentSelector } from "../deploymentSelector.js";
import { LocalDeploymentConfig } from "./filePaths.js";
/**
 * Returns the cloud project the user is targeting with a `[team:project:]local`
 * selector, or `null` if the project context can't be determined (e.g.
 * anonymous mode, no current project).
 */
export declare function targetProjectForLocalSelector(ctx: Context, parsed: ParsedDeploymentSelector, currentSelection: DeploymentSelection): Promise<ProjectResponse | null>;
/**
 * Compares the cloud project association stored in `config.json` against the
 * cloud project the user is asking about. Returns `"skip"` when the on-disk
 * config has no `cloudProjectId` (older configs, anonymous mode).
 */
export declare function checkLocalConfigMatchesProject(_ctx: Context, localConfig: LocalDeploymentConfig, target: {
    id: number;
}): "match" | "mismatch" | "skip";
/**
 * Best-effort lookup of a cloud project's team/project slugs by id. Returns
 * `null` if the project can't be resolved (e.g. it was deleted from the
 * dashboard).
 */
export declare function getCloudProjectSlugsBestEffort(ctx: Context, cloudProjectId: number): Promise<{
    teamSlug: string;
    slug: string;
} | null>;
/**
 * Best-effort call to `local_deployment/pause` for the local deployment
 * associated with the given cloud project. Swallows any errors.
 */
export declare function pauseLocalDeploymentBestEffort(ctx: Context, project: {
    teamSlug: string;
    slug: string;
} | null): Promise<void>;
//# sourceMappingURL=projectMismatch.d.ts.map