import { Filesystem } from "./fs.js";
export type ErrorType = "invalid filesystem data" | {
    "invalid filesystem or db data": {
        tableName: string;
        componentPath?: string;
    } | null;
} | "invalid filesystem or env vars" | "transient" | "already handled" | "fatal";
export type BigBrainAuth = {
    header: string;
} & ({
    kind: "projectKey";
    projectKey: string;
} | {
    kind: "deploymentKey";
    deploymentKey: string;
} | {
    kind: "previewDeployKey";
    previewDeployKey: string;
} | {
    kind: "accessToken";
    accessToken: string;
});
export interface Context {
    fs: Filesystem;
    deprecationMessagePrinted: boolean;
    crash(args: {
        exitCode: number;
        errorType: ErrorType;
        errForSentry?: any;
        printedMessage: string | null;
    }): Promise<never>;
    registerCleanup(fn: (exitCode: number, err?: any) => Promise<void>): string;
    removeCleanup(handle: string): (exitCode: number, err?: any) => Promise<void> | null;
    bigBrainAuth(): BigBrainAuth | null;
    /**
     * Prefer using `updateBigBrainAuthAfterLogin` in `deploymentSelection.ts` instead
     */
    _updateBigBrainAuth(auth: BigBrainAuth | null): void;
}
export type OneoffCtx = Context & {
    flushAndExit: (exitCode: number, err?: any) => Promise<never>;
};
/**
 * Install a SIGINT handler that gracefully exits via ctx.flushAndExit.
 *
 * `bun run` and `npm run` can deliver a duplicate SIGINT to the child
 * process immediately while the first handler is still starting cleanup:
 *   bun:  https://github.com/oven-sh/bun/issues/14799
 *         https://github.com/oven-sh/bun/issues/11400
 *   npm:  https://github.com/npm/cli/issues/5021
 *         https://github.com/npm/cli/issues/8164
 *         https://github.com/npm/cli/issues/7693
 * We ignore a second signal within 500ms of the first to avoid
 * double-cleanup, but treat a later Ctrl+C as a force-exit escape hatch.
 */
export declare function installSigintHandler(ctx: OneoffCtx): void;
export declare const oneoffContext: (args: {
    url?: string | undefined;
    adminKey?: string | undefined;
    envFile?: string | undefined;
}) => Promise<OneoffCtx>;
//# sourceMappingURL=context.d.ts.map