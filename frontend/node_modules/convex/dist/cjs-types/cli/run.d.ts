import { Command } from "@commander-js/extra-typings";
export declare const run: Command<[string | undefined, string | undefined], {
    watch?: boolean;
    push?: boolean;
    identity?: string;
    inlineQuery?: string;
    typecheck: "enable" | "try" | "disable";
    typecheckComponents: boolean;
    codegen: "enable" | "disable";
    component?: string;
    liveComponentSources?: boolean;
} & {
    envFile?: string;
    url?: string;
    adminKey?: string;
    prod?: boolean;
    previewName?: string;
    deploymentName?: string;
    deployment?: string;
}, {}>;
//# sourceMappingURL=run.d.ts.map