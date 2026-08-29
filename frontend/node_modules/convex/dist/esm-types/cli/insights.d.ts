import { Command } from "@commander-js/extra-typings";
export declare const insights: Command<[], {
    details: boolean;
    json: boolean;
} & {
    envFile?: string;
    url?: string;
    adminKey?: string;
    prod?: boolean;
    previewName?: string;
    deploymentName?: string;
    deployment?: string;
}, {}>;
//# sourceMappingURL=insights.d.ts.map