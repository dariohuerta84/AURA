type ParsedExpirationSuccess = {
    kind: "none";
} | {
    kind: "absolute";
    timestampMs: number;
} | {
    kind: "relative";
    amount: number;
    unit: "minute" | "hour" | "day";
};
type ParsedExpiration = ParsedExpirationSuccess | {
    kind: "error";
    message: string;
};
/**
 * Parse an expiration input string into a structured representation.
 * Does not depend on the current time.
 */
export declare function parseExpiration(input: string): ParsedExpiration;
/**
 * Resolve a parsed expiration into a timestamp in milliseconds, or null for "none".
 */
export declare function resolveExpiration(parsed: ParsedExpirationSuccess, now?: number): number | null;
type ValidationResult = {
    kind: "success";
} | {
    kind: "error";
    message: string;
};
/**
 * Validate that a resolved expiration timestamp is acceptable.
 */
export declare function validateExpiration(timestampMs: number, now?: number): ValidationResult;
export {};
//# sourceMappingURL=expiration.d.ts.map