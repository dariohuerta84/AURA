import { Value } from "../../values/index.js";
import { FunctionReference } from "../../server/api.js";
export declare function setupActionCalls(requestId: string): {
    runQuery: (query: FunctionReference<"query", "public" | "internal">, args?: Record<string, Value>) => Promise<any>;
    runMutation: (mutation: FunctionReference<"mutation", "public" | "internal">, args?: Record<string, Value>) => Promise<any>;
    runAction: (action: FunctionReference<"action", "public" | "internal">, args?: Record<string, Value>) => Promise<any>;
};
/**
 * Get a short-lived credential for calling a Convex-managed service.
 *
 * This function can only be called while an action is running. The credential
 * is scoped to the current deployment and should be sent as a bearer token.
 * Repeated calls in the same action reuse one token; a failed mint is not
 * cached, so a later call retries.
 *
 * @param service - The service the credential may access.
 * @returns A JWT to send as `Authorization: Bearer <token>`. Keep it inside
 * the action: don't return it to clients or store it in environment
 * variables.
 */
export declare function getServiceToken(service: "ai-gateway"): Promise<string>;
//# sourceMappingURL=actions_impl.d.ts.map