import { Context } from "../../bundler/context.js";
export type EnvVarChange = {
    name: string;
    value: string | null;
};
export type EnvVar = {
    name: string;
    value: string;
};
export interface EnvVarBackend {
    get(name: string): Promise<EnvVar | null>;
    list(): Promise<EnvVar[]>;
    update(changes: EnvVarChange[]): Promise<void>;
    notice: string;
}
export declare function deploymentEnvBackend(ctx: Context, deployment: {
    deploymentUrl: string;
    adminKey: string;
    deploymentNotice?: string;
}): EnvVarBackend;
export declare function envSet(ctx: Context, backend: EnvVarBackend, originalName: string | undefined, originalValue: string | undefined, options?: {
    fromFile?: string;
    force?: boolean;
    secret?: boolean;
}): Promise<boolean>;
export declare function envGet(ctx: Context, backend: EnvVarBackend, name: string): Promise<void>;
export declare function envRemove(ctx: Context, backend: EnvVarBackend, name: string): Promise<void>;
export declare function envList(ctx: Context, backend: EnvVarBackend, options?: {
    namesOnly?: boolean;
}): Promise<void>;
//# sourceMappingURL=env.d.ts.map