import type { FunctionArgs, FunctionReference } from "../server/api.js";
/**
 * Options for a Convex query: the query function reference and its arguments.
 *
 * Used with the object-form overload of {@link useQuery}.
 *
 * @public
 */
export type QueryOptions<Query extends FunctionReference<"query">> = {
    /**
     * The query function to run.
     */
    query: Query;
    /**
     * The arguments to the query function.
     */
    args: FunctionArgs<Query>;
};
//# sourceMappingURL=query_options.d.ts.map