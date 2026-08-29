import { type AiFilesState } from "./state.js";
export declare function hasGuidelinesInstalled(convexDir: string): Promise<boolean>;
/**
 * Download and write the guidelines file.
 * Guidelines live in `_generated/` so local edits are not expected and are
 * not preserved.
 */
export declare function installGuidelinesFile({ convexDir, state, }: {
    convexDir: string;
    state: AiFilesState;
}): Promise<void>;
//# sourceMappingURL=guidelinesmd.d.ts.map