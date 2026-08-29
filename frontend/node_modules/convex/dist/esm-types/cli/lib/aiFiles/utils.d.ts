export declare function isInInteractiveTerminal(): boolean;
export type ReadFileResult = {
    kind: "not-found";
} | {
    kind: "empty";
} | {
    kind: "content";
    content: string;
};
export declare function attemptReadFile(filePath: string): Promise<ReadFileResult>;
export declare function readFileOrNull(filePath: string): Promise<string | null>;
/**
 * Attempt to delete a file. Returns `true` if the file was deleted,
 * `false` if it didn't exist or the deletion failed.
 */
export declare function safelyDeleteFile(filePath: string): Promise<boolean>;
export type ManagedSectionTarget = {
    filePath: string;
    startMarker: string;
    endMarker: string;
};
export type InjectResult = {
    sectionHash: string;
    didWrite: boolean;
};
export declare const iife: <T>(fn: () => T) => T;
/**
 * Inject a managed section into a file. If the file already contains the
 * markers, the section between them is replaced. Otherwise the section is
 * appended (or the file is created). Only writes when content actually
 * changes.
 */
export declare function injectManagedSection(opts: ManagedSectionTarget & {
    section: string;
}): Promise<InjectResult>;
export type StripResult = "none" | "section" | "file";
/**
 * Remove the managed section (between start/end markers) from a file.
 * If the file is empty after removal, it is deleted.
 *
 * Returns `"none"` if the file doesn't exist or has no markers,
 * `"section"` if the section was stripped, or `"file"` if the entire
 * file was deleted.
 */
export declare function attemptToStripManagedSection(opts: ManagedSectionTarget): Promise<StripResult>;
export declare function exhaustiveCheck(_param: never): never;
export declare function attemptToRemoveMarkdownSection({ projectDir, strip, fileName, }: {
    projectDir: string;
    strip: (dir: string) => Promise<StripResult>;
    fileName: string;
}): Promise<boolean>;
/**
 * Check whether a file contains a managed section (both markers present).
 */
export declare function hasManagedSection(opts: ManagedSectionTarget): Promise<boolean>;
//# sourceMappingURL=utils.d.ts.map