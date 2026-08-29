import { Command } from "@commander-js/extra-typings";
export declare const deploymentTokenCreate: Command<[string], {
    saveEnv?: string | true;
} & {
    envFile?: string;
    url?: string;
    adminKey?: string;
    prod?: boolean;
    previewName?: string;
    deploymentName?: string;
    deployment?: string;
}, {}>;
//# sourceMappingURL=deploymentTokenCreate.d.ts.map