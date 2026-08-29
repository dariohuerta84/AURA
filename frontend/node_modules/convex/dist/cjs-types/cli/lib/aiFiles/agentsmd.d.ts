import { type AiFilesState } from "./state.js";
import { type InjectResult, type StripResult } from "./utils.js";
export declare function injectAgentsMdSection({ section, projectDir, }: {
    section: string;
    projectDir?: string;
}): Promise<InjectResult>;
export declare function attemptToStripAgentsMdSection(projectDir: string): Promise<StripResult>;
export declare function attemptToRemoveAgentsMdSection(projectDir: string): Promise<boolean>;
export declare function hasAgentsMdInstalled(projectDir: string): Promise<boolean>;
/**
 * Inject (or update) the Convex section in AGENTS.md and record the hash.
 * Returns true if the file was actually written.
 */
export declare function applyAgentsMdSection({ projectDir, state, convexDirName, }: {
    projectDir: string;
    state: AiFilesState;
    convexDirName: string;
}): Promise<boolean>;
//# sourceMappingURL=agentsmd.d.ts.map