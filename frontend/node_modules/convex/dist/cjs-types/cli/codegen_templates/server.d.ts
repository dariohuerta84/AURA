export type EnvVarMeta = [
    string,
    {
        type: "value";
        value: string;
        optional?: boolean | undefined;
    }
];
export declare function withPlatformEnvVars(envVars: EnvVarMeta[]): EnvVarMeta[];
export declare function serverCodegen({ useTypeScript, envVars, }: {
    useTypeScript: boolean;
    envVars: EnvVarMeta[] | undefined;
}): {
    DTS: string;
    JS: string;
    TS?: never;
} | {
    TS: string;
    DTS?: never;
    JS?: never;
};
export declare function generateEnvInterface(envVars: EnvVarMeta[]): string;
//# sourceMappingURL=server.d.ts.map