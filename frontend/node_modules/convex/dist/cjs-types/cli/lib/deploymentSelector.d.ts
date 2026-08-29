export type InProjectSelector = {
    kind: "dev";
} | {
    kind: "prod";
} | {
    kind: "local";
} | {
    kind: "reference";
    reference: string;
};
export type ParsedDeploymentSelector = {
    kind: "deploymentName";
    deploymentName: string;
} | {
    kind: "inCurrentProject";
    selector: InProjectSelector;
} | {
    kind: "inProject";
    projectSlug: string;
    selector: InProjectSelector;
} | {
    kind: "inTeamProject";
    teamSlug: string;
    projectSlug: string;
    selector: InProjectSelector;
};
/**
 * Parses the value of the `--deployment` CLI flag
 */
export declare function parseDeploymentSelector(selector: string): ParsedDeploymentSelector;
//# sourceMappingURL=deploymentSelector.d.ts.map