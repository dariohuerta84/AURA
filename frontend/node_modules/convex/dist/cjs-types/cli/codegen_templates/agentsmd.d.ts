export declare const AGENTS_MD_START_MARKER = "<!-- convex-ai-start -->";
export declare const AGENTS_MD_END_MARKER = "<!-- convex-ai-end -->";
export declare function convexAiMarkdownBody(convexDir: string): string;
/**
 * Returns the Convex section to inject into AGENTS.md.
 * The section is delimited by markers so it can be identified and updated
 * without clobbering any user-written content in the file.
 */
export declare function agentsMdConvexSection(convexDir: string): string;
//# sourceMappingURL=agentsmd.d.ts.map