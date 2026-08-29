import { z } from "zod";
declare const versionResultSchema: z.ZodObject<{
    message: z.ZodNullable<z.ZodString>;
    guidelinesHash: z.ZodEffects<z.ZodOptional<z.ZodUnknown>, string | null, unknown>;
    agentSkillsSha: z.ZodEffects<z.ZodOptional<z.ZodUnknown>, string | null, unknown>;
    disableSkillsCli: z.ZodEffects<z.ZodOptional<z.ZodUnknown>, boolean, unknown>;
    disableSkillsCliMessage: z.ZodEffects<z.ZodOptional<z.ZodUnknown>, string | null, unknown>;
}, "strip", z.ZodTypeAny, {
    message: string | null;
    guidelinesHash: string | null;
    agentSkillsSha: string | null;
    disableSkillsCli: boolean;
    disableSkillsCliMessage: string | null;
}, {
    message: string | null;
    guidelinesHash?: unknown;
    agentSkillsSha?: unknown;
    disableSkillsCli?: unknown;
    disableSkillsCliMessage?: unknown;
}>;
declare const agentSkillStatusSchema: z.ZodDiscriminatedUnion<"kind", [z.ZodObject<{
    kind: z.ZodLiteral<"active">;
}, "strip", z.ZodTypeAny, {
    kind: "active";
}, {
    kind: "active";
}>, z.ZodObject<{
    kind: z.ZodLiteral<"deleted">;
    deletedAt: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    kind: "deleted";
    deletedAt: number;
}, {
    kind: "deleted";
    deletedAt: number;
}>]>;
declare const agentSkillCatalogEntrySchema: z.ZodObject<{
    skillName: z.ZodString;
    status: z.ZodDiscriminatedUnion<"kind", [z.ZodObject<{
        kind: z.ZodLiteral<"active">;
    }, "strip", z.ZodTypeAny, {
        kind: "active";
    }, {
        kind: "active";
    }>, z.ZodObject<{
        kind: z.ZodLiteral<"deleted">;
        deletedAt: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        kind: "deleted";
        deletedAt: number;
    }, {
        kind: "deleted";
        deletedAt: number;
    }>]>;
    hash: z.ZodString;
    lastSeenRepoSha: z.ZodString;
    lastSeenAt: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    status: {
        kind: "active";
    } | {
        kind: "deleted";
        deletedAt: number;
    };
    skillName: string;
    hash: string;
    lastSeenRepoSha: string;
    lastSeenAt: number;
}, {
    status: {
        kind: "active";
    } | {
        kind: "deleted";
        deletedAt: number;
    };
    skillName: string;
    hash: string;
    lastSeenRepoSha: string;
    lastSeenAt: number;
}>;
declare const agentSkillCatalogResultSchema: z.ZodObject<{
    latestRepoSha: z.ZodNullable<z.ZodString>;
    skills: z.ZodArray<z.ZodObject<{
        skillName: z.ZodString;
        status: z.ZodDiscriminatedUnion<"kind", [z.ZodObject<{
            kind: z.ZodLiteral<"active">;
        }, "strip", z.ZodTypeAny, {
            kind: "active";
        }, {
            kind: "active";
        }>, z.ZodObject<{
            kind: z.ZodLiteral<"deleted">;
            deletedAt: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            kind: "deleted";
            deletedAt: number;
        }, {
            kind: "deleted";
            deletedAt: number;
        }>]>;
        hash: z.ZodString;
        lastSeenRepoSha: z.ZodString;
        lastSeenAt: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        status: {
            kind: "active";
        } | {
            kind: "deleted";
            deletedAt: number;
        };
        skillName: string;
        hash: string;
        lastSeenRepoSha: string;
        lastSeenAt: number;
    }, {
        status: {
            kind: "active";
        } | {
            kind: "deleted";
            deletedAt: number;
        };
        skillName: string;
        hash: string;
        lastSeenRepoSha: string;
        lastSeenAt: number;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    skills: {
        status: {
            kind: "active";
        } | {
            kind: "deleted";
            deletedAt: number;
        };
        skillName: string;
        hash: string;
        lastSeenRepoSha: string;
        lastSeenAt: number;
    }[];
    latestRepoSha: string | null;
}, {
    skills: {
        status: {
            kind: "active";
        } | {
            kind: "deleted";
            deletedAt: number;
        };
        skillName: string;
        hash: string;
        lastSeenRepoSha: string;
        lastSeenAt: number;
    }[];
    latestRepoSha: string | null;
}>;
export type VersionResult = z.infer<typeof versionResultSchema>;
export type VersionFetchResult = {
    kind: "ok";
    data: VersionResult;
} | {
    kind: "error";
};
export type AgentSkillStatus = z.infer<typeof agentSkillStatusSchema>;
export type AgentSkillCatalogEntry = z.infer<typeof agentSkillCatalogEntrySchema>;
export type AgentSkillCatalogResult = z.infer<typeof agentSkillCatalogResultSchema>;
export type AgentSkillCatalogFetchResult = {
    kind: "ok";
    data: AgentSkillCatalogResult;
} | {
    kind: "error";
};
export declare function getVersion(): Promise<VersionFetchResult>;
export declare function validateVersionResult(json: unknown): VersionResult | null;
export declare function validateAgentSkillCatalogResult(json: unknown): AgentSkillCatalogResult | null;
/** Fetch the latest agent skills SHA from version.convex.dev. */
export declare function fetchAgentSkillsSha(): Promise<string | null>;
export declare function fetchAgentSkillsCatalog(): Promise<AgentSkillCatalogFetchResult>;
export declare function downloadGuidelines(): Promise<string | null>;
export {};
//# sourceMappingURL=versionApi.d.ts.map