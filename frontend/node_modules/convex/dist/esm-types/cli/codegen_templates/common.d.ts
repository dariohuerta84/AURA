export declare function header(oneLineDescription: string): string;
export declare function apiComment(apiName: string, type: "public" | "internal" | undefined): string;
/**
 * Comparison function for sorting strings alphabetically.
 *
 * Usage: array.sort(compareStrings)
 * or with entries: Object.entries(obj).sort(([a], [b]) => compareStrings(a, b))
 */
export declare function compareStrings(a: string, b: string): number;
/**
 * Comparison function for sorting module paths in codegen output.
 *
 * Compares the forward slash normalized form of each path so the resulting
 * order is identical on every platform. Sorting OS-native paths directly
 * diverges on Windows because "\" (0x5C) sorts after letters while "/"
 * (0x2F) sorts before them. Uses plain code unit comparison to match the
 * default Array.prototype.sort() order these paths sorted with on POSIX.
 *
 * Usage: modulePaths.sort(compareModulePaths)
 */
export declare function compareModulePaths(a: string, b: string): number;
//# sourceMappingURL=common.d.ts.map