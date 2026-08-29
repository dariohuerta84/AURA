import { LogVar } from "./logVars.js";
export type AuditLogBody = {
    [key: string]: AuditLogValue;
};
export type AuditLogValue = null | undefined | boolean | number | string | LogVar | AuditLogValue[] | {
    [key: string]: AuditLogValue;
};
type JsonValue = null | undefined | boolean | number | string | JsonValue[] | {
    [key: string]: JsonValue;
};
/**
 * Deep-clone the body, replacing audit var symbols with sentinel objects
 * like `{ $var: "ip" }`.
 */
export declare function cloneWithSentinels(body: AuditLogBody): {
    [key: string]: JsonValue;
};
export declare const audit: (body: AuditLogBody) => Promise<void>;
export {};
//# sourceMappingURL=audit_logging.d.ts.map