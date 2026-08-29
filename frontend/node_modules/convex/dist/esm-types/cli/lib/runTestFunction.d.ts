import type { Context } from "../../bundler/context.js";
/** Shared help text for the query/module string (CLI argument + MCP input). */
export declare const RUN_ONEOFF_QUERY_SOURCE_DESCRIPTION = "JavaScript module source for a single file (testQuery.js) that exports a default readonly query, for example: export default query({ handler: async (ctx) => ({ count: (await ctx.db.query(\"messages\").take(10)).length }) });";
export declare const INLINE_QUERY_DESCRIPTION: string;
export type RunTestFunctionQuerySuccess = {
    kind: "success";
    value: unknown;
    logLines: string[];
};
export type RunTestFunctionQueryApplicationFailure = {
    kind: "applicationFailure";
    payload: unknown;
};
export type RunTestFunctionQueryResult = RunTestFunctionQuerySuccess | RunTestFunctionQueryApplicationFailure;
export declare function inlineQueryToQuerySource(inlineQuery: string): string;
/**
 * POST /api/run_test_function with the same body shape as the dashboard and MCP.
 * Uses deploymentFetch for Convex-Client, auth headers, retries, and error typing.
 * On HTTP failure, throws ThrowingFetchError (from deploymentFetch).
 */
export declare function runTestFunctionQuery(ctx: Context, args: {
    deploymentUrl: string;
    adminKey: string;
    querySource: string;
    componentId?: string;
}): Promise<RunTestFunctionQueryResult>;
//# sourceMappingURL=runTestFunction.d.ts.map