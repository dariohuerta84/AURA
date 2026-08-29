import { type AiFilesState } from "./state.js";
import { type InjectResult, type StripResult } from "./utils.js";
export declare function injectClaudeMdSection({ section, projectDir, }: {
    section: string;
    projectDir?: string;
}): Promise<InjectResult>;
export declare function attemptToStripClaudeMdSection(projectDir: string): Promise<StripResult>;
export declare function attemptToRemoveClaudeMdSection(projectDir: string): Promise<boolean>;
export declare function hasClaudeMdInstalled(projectDir: string): Promise<boolean>;
/**
 * Inject (or update) the Convex section in CLAUDE.md and record the hash.
 * Returns true if the file was actually written.
 */
export declare function applyClaudeMdSection({ projectDir, state, convexDirName, }: {
    projectDir: string;
    state: AiFilesState;
    convexDirName: string;
}): Promise<boolean>;
//# sourceMappingURL=claudemd.d.ts.map