/**
 * PaginatedQueryClient maps subscriptions to paginated queries to the
 * individual page queries and handles page splits.
 *
 * In order to process all modified queries, paginated and normal, in the same
 * synchronous call the PaginatedQueryClient transition should be used exclusively.
 *
 * Like the BaseConvexClient, this client is not Convex Function type-aware: it deals
 * with queries as functions that return Value, not the specific value.
 * Use a higher-level library to get types.
 */
import { Value } from "../../values/index.js";
import { PaginatedQueryToken } from "./udf_path_utils.js";
import { Transition } from "./client.js";
import { PaginatedQueryResult } from "./pagination.js";
export interface SubscribeToPaginatedQueryOptions {
    initialNumItems: number;
    id: number;
}
type AnyPaginatedQueryResult = PaginatedQueryResult<Value>;
export type PaginatedQueryModification = {
    kind: "Updated";
    result: AnyPaginatedQueryResult | undefined;
} | {
    kind: "Removed";
};
export type ExtendedTransition = Transition & {
    paginatedQueries: Array<{
        token: PaginatedQueryToken;
        modification: PaginatedQueryModification;
    }>;
};
export {};
//# sourceMappingURL=paginated_query_client.d.ts.map