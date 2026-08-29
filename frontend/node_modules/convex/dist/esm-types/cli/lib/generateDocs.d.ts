import type { CommandUnknownOpts } from "@commander-js/extra-typings";
export type GeneratedDocs = Record<string, string>;
/**
 * Generate Markdown reference docs for a Commander main command.
 *
 * Returns a map of file paths (relative, e.g. `env.mdx`) to Markdown
 * contents. One file is generated for each visible main command (a direct
 * child of the root); the root itself gets no page, so "Command Reference"
 * is a sidebar section with no landing page. Descendant subcommands are
 * rendered as sections inside their main command's file, with their heading
 * level reflecting their depth: a direct subcommand (`env default`) is an
 * `## h2`, a sub-subcommand (`env default set`) an `### h3`, and so on.
 *
 * Each page carries a `description` frontmatter equal to the command's
 * summary; the `/cli` page reads these back via Docusaurus metadata to render
 * the list of commands dynamically.
 */
export declare function generateDocs(root: CommandUnknownOpts): GeneratedDocs;
export declare function replaceBullets(text: string): string;
//# sourceMappingURL=generateDocs.d.ts.map