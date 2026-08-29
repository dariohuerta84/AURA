/**
 * Markers delimiting the Convex-managed section in CLAUDE.md.
 * Everything outside this block is user-owned and left untouched.
 */
export declare const CLAUDE_MD_START_MARKER = "<!-- convex-ai-start -->";
export declare const CLAUDE_MD_END_MARKER = "<!-- convex-ai-end -->";
/**
 * Returns the Convex section to inject into CLAUDE.md.
 */
export declare function claudeMdConvexSection(convexDir: string): string;
//# sourceMappingURL=claudemd.d.ts.map