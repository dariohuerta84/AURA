import { Context } from "../../../bundler/context.js";
export declare function choosePorts(ctx: Context, { count, requestedPorts, suggestedPorts, startPort, }: {
    count: number;
    /** Ports that must mandatorily be used when provided. */
    requestedPorts?: Array<number | null>;
    /** Ports that will be tried preferentially when provided, but are not required. */
    suggestedPorts?: Array<number | null>;
    startPort: number;
}): Promise<Array<number>>;
export declare function chooseLocalBackendPorts(ctx: Context, options?: {
    suggestedPorts?: {
        cloud?: number | undefined;
        site?: number | undefined;
    } | undefined;
    requestedPorts?: {
        cloud?: number | undefined;
        site?: number | undefined;
    } | undefined;
}): Promise<{
    cloudPort: number;
    sitePort: number;
}>;
export declare function printLocalDeploymentWelcomeMessage(): void;
export declare const LOCAL_BACKEND_INSTANCE_SECRET = "4361726e697461732c206c69746572616c6c79206d65616e696e6720226c6974";
//# sourceMappingURL=utils.d.ts.map