import { ChalkInstance } from "chalk";
import type { DetailedDeploymentCredentials } from "./api.js";
type AnnouncedDeployment = Omit<DetailedDeploymentCredentials, "adminKey">;
export type DeploymentAnnouncementHeader = "Developing against deployment:" | "Showing logs of deployment:" | "Deploying code to deployment:" | null;
export declare function formatTargetedDeployment(header: DeploymentAnnouncementHeader, creds: AnnouncedDeployment, chalk: ChalkInstance): string;
export declare function announceDeploymentTarget(header: DeploymentAnnouncementHeader, creds: AnnouncedDeployment): void;
export {};
//# sourceMappingURL=announceDeploymentTarget.d.ts.map