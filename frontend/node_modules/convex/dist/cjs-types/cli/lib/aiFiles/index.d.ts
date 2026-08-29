import { Context } from "../../../bundler/context.js";
import { type AiFilesPaths } from "./paths.js";
import { type AiFilesProjectConfig } from "../config.js";
/**
 * Install or refresh all Convex AI files.
 *
 * Reads the existing state if present, or starts from a blank one for a
 * fresh install.
 */
export declare function installAiFiles({ projectDir, convexDir, aiFilesConfig, }: AiFilesPaths & {
    aiFilesConfig?: AiFilesProjectConfig | undefined;
}): Promise<void>;
export declare function isAiFilesDisabled(aiFilesConfig: AiFilesProjectConfig | undefined): boolean;
/**
 * Check whether the Convex AI files are out of date and log a nag message
 * if so.
 */
export declare function checkAiFilesStalenessAndLog(opts: {
    canonicalGuidelinesHash: string | null;
    canonicalAgentSkillsSha: string | null;
    aiFilesConfig?: AiFilesProjectConfig | undefined;
} & AiFilesPaths): Promise<void>;
/**
 * Installs AI files and returns the aiFiles config to write.
 */
export declare function enableAiFiles({ projectDir, convexDir, aiFilesConfig, }: AiFilesPaths & {
    aiFilesConfig?: AiFilesProjectConfig | undefined;
}): Promise<AiFilesProjectConfig>;
/**
 * Returns the aiFiles config to write when disabling AI files.
 */
export declare function disableAiFiles(aiFilesConfig?: AiFilesProjectConfig | undefined): AiFilesProjectConfig;
export type RemoveAiFilesResult = {
    kind: "success";
} | {
    kind: "error";
    message: string;
};
/**
 * Remove all Convex AI files from the project.
 * Called by `npx convex ai-files remove`.
 */
export declare function removeAiFiles({ projectDir, convexDir, }: AiFilesPaths): Promise<RemoveAiFilesResult>;
export declare function attemptSetupAiFiles({ ctx, convexDir, projectDir, aiFilesConfig, }: {
    ctx: Context;
    aiFilesConfig?: AiFilesProjectConfig | undefined;
} & AiFilesPaths): Promise<void>;
//# sourceMappingURL=index.d.ts.map