import { Context } from "../../../bundler/context.js";
import { LocalDeploymentKind } from "./filePaths.js";
export declare function handlePotentialUpgradeAndStart(ctx: Context, args: {
    deploymentKind: LocalDeploymentKind;
    deploymentName: string;
    oldVersion: string | null;
    newBinaryPath: string;
    newVersion: string;
    ports: {
        cloud: number;
        site: number;
    };
    existingCredentials: {
        adminKey: string;
        instanceSecret: string;
    } | null;
    forceUpgrade: boolean;
    cloudProjectId: number | undefined;
}): Promise<{
    cleanupHandle: string;
    adminKey: string;
}>;
/** Whether `newVersion` predates `oldVersion`, as far as we can tell. */
export declare function _isDowngrade(oldVersion: string, newVersion: string): boolean;
//# sourceMappingURL=upgrade.d.ts.map