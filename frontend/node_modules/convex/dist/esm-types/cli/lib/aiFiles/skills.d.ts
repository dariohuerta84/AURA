import { type AiFilesState } from "./state.js";
import { type AiFilesProjectConfig } from "../config.js";
/**
 * Install Convex agent skills and record the SHA into the state.
 * Handles the kill-switch check and all logging internally.
 */
export declare function installSkills({ projectDir, state, aiFilesConfig, }: {
    projectDir: string;
    state: AiFilesState;
    aiFilesConfig?: AiFilesProjectConfig | undefined;
}): Promise<void>;
export type RemoveInstalledSkillsStatus = "unchanged" | "removed" | "failed";
/**
 * Remove Convex-managed agent skills and clean up the lock file if empty.
 * Returns whether removal was skipped, succeeded, or failed.
 */
export declare function removeInstalledSkills({ projectDir, skillNames, }: {
    projectDir: string;
    skillNames: string[];
}): Promise<RemoveInstalledSkillsStatus>;
//# sourceMappingURL=skills.d.ts.map