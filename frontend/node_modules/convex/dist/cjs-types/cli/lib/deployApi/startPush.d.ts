import { z } from "zod";
export declare const startPushRequest: z.ZodObject<{
    adminKey: z.ZodString;
    dryRun: z.ZodBoolean;
    functions: z.ZodString;
    appDefinition: z.ZodObject<{
        definition: z.ZodNullable<z.ZodObject<{
            path: z.ZodString;
            source: z.ZodString;
            sourceMap: z.ZodOptional<z.ZodString>;
            environment: z.ZodUnion<[z.ZodLiteral<"isolate">, z.ZodLiteral<"node">]>;
        }, "passthrough", z.ZodTypeAny, {
            path: string;
            environment: "node" | "isolate";
            source: string;
            sourceMap?: string | undefined;
        }, {
            path: string;
            environment: "node" | "isolate";
            source: string;
            sourceMap?: string | undefined;
        }>>;
        dependencies: z.ZodArray<z.ZodString, "many">;
        schema: z.ZodNullable<z.ZodObject<{
            path: z.ZodString;
            source: z.ZodString;
            sourceMap: z.ZodOptional<z.ZodString>;
            environment: z.ZodUnion<[z.ZodLiteral<"isolate">, z.ZodLiteral<"node">]>;
        }, "passthrough", z.ZodTypeAny, {
            path: string;
            environment: "node" | "isolate";
            source: string;
            sourceMap?: string | undefined;
        }, {
            path: string;
            environment: "node" | "isolate";
            source: string;
            sourceMap?: string | undefined;
        }>>;
        changedModules: z.ZodArray<z.ZodObject<{
            path: z.ZodString;
            source: z.ZodString;
            sourceMap: z.ZodOptional<z.ZodString>;
            environment: z.ZodUnion<[z.ZodLiteral<"isolate">, z.ZodLiteral<"node">]>;
        }, "passthrough", z.ZodTypeAny, {
            path: string;
            environment: "node" | "isolate";
            source: string;
            sourceMap?: string | undefined;
        }, {
            path: string;
            environment: "node" | "isolate";
            source: string;
            sourceMap?: string | undefined;
        }>, "many">;
        unchangedModuleHashes: z.ZodArray<z.ZodObject<{
            path: z.ZodString;
            environment: z.ZodUnion<[z.ZodLiteral<"isolate">, z.ZodLiteral<"node">]>;
            sha256: z.ZodString;
        }, "passthrough", z.ZodTypeAny, {
            sha256: string;
            path: string;
            environment: "node" | "isolate";
        }, {
            sha256: string;
            path: string;
            environment: "node" | "isolate";
        }>, "many">;
        udfServerVersion: z.ZodString;
    }, "passthrough", z.ZodTypeAny, {
        definition: {
            path: string;
            environment: "node" | "isolate";
            source: string;
            sourceMap?: string | undefined;
        } | null;
        dependencies: string[];
        schema: {
            path: string;
            environment: "node" | "isolate";
            source: string;
            sourceMap?: string | undefined;
        } | null;
        udfServerVersion: string;
        changedModules: {
            path: string;
            environment: "node" | "isolate";
            source: string;
            sourceMap?: string | undefined;
        }[];
        unchangedModuleHashes: {
            sha256: string;
            path: string;
            environment: "node" | "isolate";
        }[];
    }, {
        definition: {
            path: string;
            environment: "node" | "isolate";
            source: string;
            sourceMap?: string | undefined;
        } | null;
        dependencies: string[];
        schema: {
            path: string;
            environment: "node" | "isolate";
            source: string;
            sourceMap?: string | undefined;
        } | null;
        udfServerVersion: string;
        changedModules: {
            path: string;
            environment: "node" | "isolate";
            source: string;
            sourceMap?: string | undefined;
        }[];
        unchangedModuleHashes: {
            sha256: string;
            path: string;
            environment: "node" | "isolate";
        }[];
    }>;
    componentDefinitions: z.ZodArray<z.ZodObject<{
        definitionPath: z.ZodString;
        definition: z.ZodObject<{
            path: z.ZodString;
            source: z.ZodString;
            sourceMap: z.ZodOptional<z.ZodString>;
            environment: z.ZodUnion<[z.ZodLiteral<"isolate">, z.ZodLiteral<"node">]>;
        }, "passthrough", z.ZodTypeAny, {
            path: string;
            environment: "node" | "isolate";
            source: string;
            sourceMap?: string | undefined;
        }, {
            path: string;
            environment: "node" | "isolate";
            source: string;
            sourceMap?: string | undefined;
        }>;
        dependencies: z.ZodArray<z.ZodString, "many">;
        schema: z.ZodNullable<z.ZodObject<{
            path: z.ZodString;
            source: z.ZodString;
            sourceMap: z.ZodOptional<z.ZodString>;
            environment: z.ZodUnion<[z.ZodLiteral<"isolate">, z.ZodLiteral<"node">]>;
        }, "passthrough", z.ZodTypeAny, {
            path: string;
            environment: "node" | "isolate";
            source: string;
            sourceMap?: string | undefined;
        }, {
            path: string;
            environment: "node" | "isolate";
            source: string;
            sourceMap?: string | undefined;
        }>>;
        functions: z.ZodArray<z.ZodObject<{
            path: z.ZodString;
            source: z.ZodString;
            sourceMap: z.ZodOptional<z.ZodString>;
            environment: z.ZodUnion<[z.ZodLiteral<"isolate">, z.ZodLiteral<"node">]>;
        }, "passthrough", z.ZodTypeAny, {
            path: string;
            environment: "node" | "isolate";
            source: string;
            sourceMap?: string | undefined;
        }, {
            path: string;
            environment: "node" | "isolate";
            source: string;
            sourceMap?: string | undefined;
        }>, "many">;
        udfServerVersion: z.ZodString;
    }, "passthrough", z.ZodTypeAny, {
        definition: {
            path: string;
            environment: "node" | "isolate";
            source: string;
            sourceMap?: string | undefined;
        };
        dependencies: string[];
        schema: {
            path: string;
            environment: "node" | "isolate";
            source: string;
            sourceMap?: string | undefined;
        } | null;
        functions: {
            path: string;
            environment: "node" | "isolate";
            source: string;
            sourceMap?: string | undefined;
        }[];
        udfServerVersion: string;
        definitionPath: string;
    }, {
        definition: {
            path: string;
            environment: "node" | "isolate";
            source: string;
            sourceMap?: string | undefined;
        };
        dependencies: string[];
        schema: {
            path: string;
            environment: "node" | "isolate";
            source: string;
            sourceMap?: string | undefined;
        } | null;
        functions: {
            path: string;
            environment: "node" | "isolate";
            source: string;
            sourceMap?: string | undefined;
        }[];
        udfServerVersion: string;
        definitionPath: string;
    }>, "many">;
    nodeDependencies: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        version: z.ZodString;
    }, "passthrough", z.ZodTypeAny, {
        name: string;
        version: string;
    }, {
        name: string;
        version: string;
    }>, "many">;
    nodeVersion: z.ZodOptional<z.ZodString>;
}, "passthrough", z.ZodTypeAny, {
    dryRun: boolean;
    functions: string;
    nodeDependencies: {
        name: string;
        version: string;
    }[];
    adminKey: string;
    appDefinition: {
        definition: {
            path: string;
            environment: "node" | "isolate";
            source: string;
            sourceMap?: string | undefined;
        } | null;
        dependencies: string[];
        schema: {
            path: string;
            environment: "node" | "isolate";
            source: string;
            sourceMap?: string | undefined;
        } | null;
        udfServerVersion: string;
        changedModules: {
            path: string;
            environment: "node" | "isolate";
            source: string;
            sourceMap?: string | undefined;
        }[];
        unchangedModuleHashes: {
            sha256: string;
            path: string;
            environment: "node" | "isolate";
        }[];
    };
    componentDefinitions: {
        definition: {
            path: string;
            environment: "node" | "isolate";
            source: string;
            sourceMap?: string | undefined;
        };
        dependencies: string[];
        schema: {
            path: string;
            environment: "node" | "isolate";
            source: string;
            sourceMap?: string | undefined;
        } | null;
        functions: {
            path: string;
            environment: "node" | "isolate";
            source: string;
            sourceMap?: string | undefined;
        }[];
        udfServerVersion: string;
        definitionPath: string;
    }[];
    nodeVersion?: string | undefined;
}, {
    dryRun: boolean;
    functions: string;
    nodeDependencies: {
        name: string;
        version: string;
    }[];
    adminKey: string;
    appDefinition: {
        definition: {
            path: string;
            environment: "node" | "isolate";
            source: string;
            sourceMap?: string | undefined;
        } | null;
        dependencies: string[];
        schema: {
            path: string;
            environment: "node" | "isolate";
            source: string;
            sourceMap?: string | undefined;
        } | null;
        udfServerVersion: string;
        changedModules: {
            path: string;
            environment: "node" | "isolate";
            source: string;
            sourceMap?: string | undefined;
        }[];
        unchangedModuleHashes: {
            sha256: string;
            path: string;
            environment: "node" | "isolate";
        }[];
    };
    componentDefinitions: {
        definition: {
            path: string;
            environment: "node" | "isolate";
            source: string;
            sourceMap?: string | undefined;
        };
        dependencies: string[];
        schema: {
            path: string;
            environment: "node" | "isolate";
            source: string;
            sourceMap?: string | undefined;
        } | null;
        functions: {
            path: string;
            environment: "node" | "isolate";
            source: string;
            sourceMap?: string | undefined;
        }[];
        udfServerVersion: string;
        definitionPath: string;
    }[];
    nodeVersion?: string | undefined;
}>;
export type StartPushRequest = z.infer<typeof startPushRequest>;
export declare const schemaChange: z.ZodObject<{
    allocatedComponentIds: z.ZodAny;
    schemaIds: z.ZodAny;
    indexDiffs: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        added_indexes: z.ZodArray<z.ZodIntersection<z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
            name: z.ZodString;
            type: z.ZodLiteral<"database">;
            fields: z.ZodArray<z.ZodString, "many">;
        }, "passthrough", z.ZodTypeAny, {
            type: "database";
            fields: string[];
            name: string;
        }, {
            type: "database";
            fields: string[];
            name: string;
        }>, z.ZodObject<{
            name: z.ZodString;
            type: z.ZodLiteral<"search">;
            searchField: z.ZodString;
            filterFields: z.ZodArray<z.ZodString, "many">;
        }, "passthrough", z.ZodTypeAny, {
            type: "search";
            name: string;
            searchField: string;
            filterFields: string[];
        }, {
            type: "search";
            name: string;
            searchField: string;
            filterFields: string[];
        }>, z.ZodObject<{
            name: z.ZodString;
            type: z.ZodLiteral<"vector">;
            dimensions: z.ZodNumber;
            vectorField: z.ZodString;
            filterFields: z.ZodArray<z.ZodString, "many">;
        }, "passthrough", z.ZodTypeAny, {
            type: "vector";
            name: string;
            filterFields: string[];
            vectorField: string;
            dimensions: number;
        }, {
            type: "vector";
            name: string;
            filterFields: string[];
            vectorField: string;
            dimensions: number;
        }>]>, z.ZodObject<{
            staged: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            staged?: boolean | undefined;
        }, {
            staged?: boolean | undefined;
        }>>, "many">;
        removed_indexes: z.ZodArray<z.ZodIntersection<z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
            name: z.ZodString;
            type: z.ZodLiteral<"database">;
            fields: z.ZodArray<z.ZodString, "many">;
        }, "passthrough", z.ZodTypeAny, {
            type: "database";
            fields: string[];
            name: string;
        }, {
            type: "database";
            fields: string[];
            name: string;
        }>, z.ZodObject<{
            name: z.ZodString;
            type: z.ZodLiteral<"search">;
            searchField: z.ZodString;
            filterFields: z.ZodArray<z.ZodString, "many">;
        }, "passthrough", z.ZodTypeAny, {
            type: "search";
            name: string;
            searchField: string;
            filterFields: string[];
        }, {
            type: "search";
            name: string;
            searchField: string;
            filterFields: string[];
        }>, z.ZodObject<{
            name: z.ZodString;
            type: z.ZodLiteral<"vector">;
            dimensions: z.ZodNumber;
            vectorField: z.ZodString;
            filterFields: z.ZodArray<z.ZodString, "many">;
        }, "passthrough", z.ZodTypeAny, {
            type: "vector";
            name: string;
            filterFields: string[];
            vectorField: string;
            dimensions: number;
        }, {
            type: "vector";
            name: string;
            filterFields: string[];
            vectorField: string;
            dimensions: number;
        }>]>, z.ZodObject<{
            staged: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            staged?: boolean | undefined;
        }, {
            staged?: boolean | undefined;
        }>>, "many">;
        enabled_indexes: z.ZodOptional<z.ZodArray<z.ZodIntersection<z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
            name: z.ZodString;
            type: z.ZodLiteral<"database">;
            fields: z.ZodArray<z.ZodString, "many">;
        }, "passthrough", z.ZodTypeAny, {
            type: "database";
            fields: string[];
            name: string;
        }, {
            type: "database";
            fields: string[];
            name: string;
        }>, z.ZodObject<{
            name: z.ZodString;
            type: z.ZodLiteral<"search">;
            searchField: z.ZodString;
            filterFields: z.ZodArray<z.ZodString, "many">;
        }, "passthrough", z.ZodTypeAny, {
            type: "search";
            name: string;
            searchField: string;
            filterFields: string[];
        }, {
            type: "search";
            name: string;
            searchField: string;
            filterFields: string[];
        }>, z.ZodObject<{
            name: z.ZodString;
            type: z.ZodLiteral<"vector">;
            dimensions: z.ZodNumber;
            vectorField: z.ZodString;
            filterFields: z.ZodArray<z.ZodString, "many">;
        }, "passthrough", z.ZodTypeAny, {
            type: "vector";
            name: string;
            filterFields: string[];
            vectorField: string;
            dimensions: number;
        }, {
            type: "vector";
            name: string;
            filterFields: string[];
            vectorField: string;
            dimensions: number;
        }>]>, z.ZodObject<{
            staged: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            staged?: boolean | undefined;
        }, {
            staged?: boolean | undefined;
        }>>, "many">>;
        disabled_indexes: z.ZodOptional<z.ZodArray<z.ZodIntersection<z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
            name: z.ZodString;
            type: z.ZodLiteral<"database">;
            fields: z.ZodArray<z.ZodString, "many">;
        }, "passthrough", z.ZodTypeAny, {
            type: "database";
            fields: string[];
            name: string;
        }, {
            type: "database";
            fields: string[];
            name: string;
        }>, z.ZodObject<{
            name: z.ZodString;
            type: z.ZodLiteral<"search">;
            searchField: z.ZodString;
            filterFields: z.ZodArray<z.ZodString, "many">;
        }, "passthrough", z.ZodTypeAny, {
            type: "search";
            name: string;
            searchField: string;
            filterFields: string[];
        }, {
            type: "search";
            name: string;
            searchField: string;
            filterFields: string[];
        }>, z.ZodObject<{
            name: z.ZodString;
            type: z.ZodLiteral<"vector">;
            dimensions: z.ZodNumber;
            vectorField: z.ZodString;
            filterFields: z.ZodArray<z.ZodString, "many">;
        }, "passthrough", z.ZodTypeAny, {
            type: "vector";
            name: string;
            filterFields: string[];
            vectorField: string;
            dimensions: number;
        }, {
            type: "vector";
            name: string;
            filterFields: string[];
            vectorField: string;
            dimensions: number;
        }>]>, z.ZodObject<{
            staged: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            staged?: boolean | undefined;
        }, {
            staged?: boolean | undefined;
        }>>, "many">>;
    }, "passthrough", z.ZodTypeAny, {
        added_indexes: (({
            type: "database";
            fields: string[];
            name: string;
        } | {
            type: "search";
            name: string;
            searchField: string;
            filterFields: string[];
        } | {
            type: "vector";
            name: string;
            filterFields: string[];
            vectorField: string;
            dimensions: number;
        }) & {
            staged?: boolean | undefined;
        })[];
        removed_indexes: (({
            type: "database";
            fields: string[];
            name: string;
        } | {
            type: "search";
            name: string;
            searchField: string;
            filterFields: string[];
        } | {
            type: "vector";
            name: string;
            filterFields: string[];
            vectorField: string;
            dimensions: number;
        }) & {
            staged?: boolean | undefined;
        })[];
        enabled_indexes?: (({
            type: "database";
            fields: string[];
            name: string;
        } | {
            type: "search";
            name: string;
            searchField: string;
            filterFields: string[];
        } | {
            type: "vector";
            name: string;
            filterFields: string[];
            vectorField: string;
            dimensions: number;
        }) & {
            staged?: boolean | undefined;
        })[] | undefined;
        disabled_indexes?: (({
            type: "database";
            fields: string[];
            name: string;
        } | {
            type: "search";
            name: string;
            searchField: string;
            filterFields: string[];
        } | {
            type: "vector";
            name: string;
            filterFields: string[];
            vectorField: string;
            dimensions: number;
        }) & {
            staged?: boolean | undefined;
        })[] | undefined;
    }, {
        added_indexes: (({
            type: "database";
            fields: string[];
            name: string;
        } | {
            type: "search";
            name: string;
            searchField: string;
            filterFields: string[];
        } | {
            type: "vector";
            name: string;
            filterFields: string[];
            vectorField: string;
            dimensions: number;
        }) & {
            staged?: boolean | undefined;
        })[];
        removed_indexes: (({
            type: "database";
            fields: string[];
            name: string;
        } | {
            type: "search";
            name: string;
            searchField: string;
            filterFields: string[];
        } | {
            type: "vector";
            name: string;
            filterFields: string[];
            vectorField: string;
            dimensions: number;
        }) & {
            staged?: boolean | undefined;
        })[];
        enabled_indexes?: (({
            type: "database";
            fields: string[];
            name: string;
        } | {
            type: "search";
            name: string;
            searchField: string;
            filterFields: string[];
        } | {
            type: "vector";
            name: string;
            filterFields: string[];
            vectorField: string;
            dimensions: number;
        }) & {
            staged?: boolean | undefined;
        })[] | undefined;
        disabled_indexes?: (({
            type: "database";
            fields: string[];
            name: string;
        } | {
            type: "search";
            name: string;
            searchField: string;
            filterFields: string[];
        } | {
            type: "vector";
            name: string;
            filterFields: string[];
            vectorField: string;
            dimensions: number;
        }) & {
            staged?: boolean | undefined;
        })[] | undefined;
    }>>>;
}, "passthrough", z.ZodTypeAny, {
    allocatedComponentIds?: any;
    schemaIds?: any;
    indexDiffs?: Record<string, {
        added_indexes: (({
            type: "database";
            fields: string[];
            name: string;
        } | {
            type: "search";
            name: string;
            searchField: string;
            filterFields: string[];
        } | {
            type: "vector";
            name: string;
            filterFields: string[];
            vectorField: string;
            dimensions: number;
        }) & {
            staged?: boolean | undefined;
        })[];
        removed_indexes: (({
            type: "database";
            fields: string[];
            name: string;
        } | {
            type: "search";
            name: string;
            searchField: string;
            filterFields: string[];
        } | {
            type: "vector";
            name: string;
            filterFields: string[];
            vectorField: string;
            dimensions: number;
        }) & {
            staged?: boolean | undefined;
        })[];
        enabled_indexes?: (({
            type: "database";
            fields: string[];
            name: string;
        } | {
            type: "search";
            name: string;
            searchField: string;
            filterFields: string[];
        } | {
            type: "vector";
            name: string;
            filterFields: string[];
            vectorField: string;
            dimensions: number;
        }) & {
            staged?: boolean | undefined;
        })[] | undefined;
        disabled_indexes?: (({
            type: "database";
            fields: string[];
            name: string;
        } | {
            type: "search";
            name: string;
            searchField: string;
            filterFields: string[];
        } | {
            type: "vector";
            name: string;
            filterFields: string[];
            vectorField: string;
            dimensions: number;
        }) & {
            staged?: boolean | undefined;
        })[] | undefined;
    }> | undefined;
}, {
    allocatedComponentIds?: any;
    schemaIds?: any;
    indexDiffs?: Record<string, {
        added_indexes: (({
            type: "database";
            fields: string[];
            name: string;
        } | {
            type: "search";
            name: string;
            searchField: string;
            filterFields: string[];
        } | {
            type: "vector";
            name: string;
            filterFields: string[];
            vectorField: string;
            dimensions: number;
        }) & {
            staged?: boolean | undefined;
        })[];
        removed_indexes: (({
            type: "database";
            fields: string[];
            name: string;
        } | {
            type: "search";
            name: string;
            searchField: string;
            filterFields: string[];
        } | {
            type: "vector";
            name: string;
            filterFields: string[];
            vectorField: string;
            dimensions: number;
        }) & {
            staged?: boolean | undefined;
        })[];
        enabled_indexes?: (({
            type: "database";
            fields: string[];
            name: string;
        } | {
            type: "search";
            name: string;
            searchField: string;
            filterFields: string[];
        } | {
            type: "vector";
            name: string;
            filterFields: string[];
            vectorField: string;
            dimensions: number;
        }) & {
            staged?: boolean | undefined;
        })[] | undefined;
        disabled_indexes?: (({
            type: "database";
            fields: string[];
            name: string;
        } | {
            type: "search";
            name: string;
            searchField: string;
            filterFields: string[];
        } | {
            type: "vector";
            name: string;
            filterFields: string[];
            vectorField: string;
            dimensions: number;
        }) & {
            staged?: boolean | undefined;
        })[] | undefined;
    }> | undefined;
}>;
export type SchemaChange = z.infer<typeof schemaChange>;
export declare const startPushResponse: z.ZodObject<{
    environmentVariables: z.ZodRecord<z.ZodString, z.ZodString>;
    externalDepsId: z.ZodNullable<z.ZodString>;
    componentDefinitionPackages: z.ZodRecord<z.ZodString, z.ZodAny>;
    appAuth: z.ZodArray<z.ZodUnion<[z.ZodObject<{
        type: z.ZodLiteral<"customJwt">;
        applicationID: z.ZodNullable<z.ZodString>;
        issuer: z.ZodString;
        jwks: z.ZodString;
        algorithm: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodLiteral<"customJwt">;
        applicationID: z.ZodNullable<z.ZodString>;
        issuer: z.ZodString;
        jwks: z.ZodString;
        algorithm: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodLiteral<"customJwt">;
        applicationID: z.ZodNullable<z.ZodString>;
        issuer: z.ZodString;
        jwks: z.ZodString;
        algorithm: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
        applicationID: z.ZodString;
        domain: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        applicationID: z.ZodString;
        domain: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        applicationID: z.ZodString;
        domain: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>]>, "many">;
    analysis: z.ZodRecord<z.ZodString, z.ZodObject<{
        definition: z.ZodObject<{
            path: z.ZodString;
            definitionType: z.ZodUnion<[z.ZodObject<{
                type: z.ZodLiteral<"app">;
                httpPrefix: z.ZodOptional<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, {
                type: "app";
                httpPrefix?: string | undefined;
            }, {
                type: "app";
                httpPrefix?: string | undefined;
            }>, z.ZodObject<{
                type: z.ZodLiteral<"childComponent">;
                name: z.ZodString;
            }, "passthrough", z.ZodTypeAny, {
                type: "childComponent";
                name: string;
            }, {
                type: "childComponent";
                name: string;
            }>]>;
            childComponents: z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                path: z.ZodString;
                env: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodTuple<[z.ZodString, z.ZodUnion<[z.ZodObject<{
                    type: z.ZodLiteral<"value">;
                    value: z.ZodString;
                }, "passthrough", z.ZodTypeAny, {
                    type: "value";
                    value: string;
                }, {
                    type: "value";
                    value: string;
                }>, z.ZodObject<{
                    type: z.ZodLiteral<"envVar">;
                    name: z.ZodString;
                }, "passthrough", z.ZodTypeAny, {
                    type: "envVar";
                    name: string;
                }, {
                    type: "envVar";
                    name: string;
                }>]>], null>, "many">>>;
            }, "passthrough", z.ZodTypeAny, {
                name: string;
                path: string;
                env?: [string, {
                    type: "value";
                    value: string;
                } | {
                    type: "envVar";
                    name: string;
                }][] | null | undefined;
            }, {
                name: string;
                path: string;
                env?: [string, {
                    type: "value";
                    value: string;
                } | {
                    type: "envVar";
                    name: string;
                }][] | null | undefined;
            }>, "many">;
            httpMounts: z.ZodRecord<z.ZodString, z.ZodString>;
            exports: z.ZodObject<{
                type: z.ZodLiteral<"branch">;
                branch: z.ZodArray<z.ZodTuple<[z.ZodString, z.ZodType<import("./componentDefinition.js").ComponentExports, z.ZodTypeDef, import("./componentDefinition.js").ComponentExports>], null>, "many">;
            }, "passthrough", z.ZodTypeAny, {
                type: "branch";
                branch: [string, import("./componentDefinition.js").ComponentExports][];
            }, {
                type: "branch";
                branch: [string, import("./componentDefinition.js").ComponentExports][];
            }>;
            envVars: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodTuple<[z.ZodString, z.ZodObject<{
                type: z.ZodLiteral<"value">;
                value: z.ZodString;
                optional: z.ZodOptional<z.ZodBoolean>;
            }, "passthrough", z.ZodTypeAny, {
                type: "value";
                value: string;
                optional?: boolean | undefined;
            }, {
                type: "value";
                value: string;
                optional?: boolean | undefined;
            }>], null>, "many">>>;
        }, "passthrough", z.ZodTypeAny, {
            path: string;
            childComponents: {
                name: string;
                path: string;
                env?: [string, {
                    type: "value";
                    value: string;
                } | {
                    type: "envVar";
                    name: string;
                }][] | null | undefined;
            }[];
            exports: {
                type: "branch";
                branch: [string, import("./componentDefinition.js").ComponentExports][];
            };
            definitionType: {
                type: "app";
                httpPrefix?: string | undefined;
            } | {
                type: "childComponent";
                name: string;
            };
            httpMounts: Record<string, string>;
            envVars?: [string, {
                type: "value";
                value: string;
                optional?: boolean | undefined;
            }][] | null | undefined;
        }, {
            path: string;
            childComponents: {
                name: string;
                path: string;
                env?: [string, {
                    type: "value";
                    value: string;
                } | {
                    type: "envVar";
                    name: string;
                }][] | null | undefined;
            }[];
            exports: {
                type: "branch";
                branch: [string, import("./componentDefinition.js").ComponentExports][];
            };
            definitionType: {
                type: "app";
                httpPrefix?: string | undefined;
            } | {
                type: "childComponent";
                name: string;
            };
            httpMounts: Record<string, string>;
            envVars?: [string, {
                type: "value";
                value: string;
                optional?: boolean | undefined;
            }][] | null | undefined;
        }>;
        schema: z.ZodNullable<z.ZodOptional<z.ZodObject<{
            tables: z.ZodArray<z.ZodObject<{
                tableName: z.ZodString;
                indexes: z.ZodArray<z.ZodObject<{
                    indexDescriptor: z.ZodString;
                    fields: z.ZodArray<z.ZodString, "many">;
                }, "passthrough", z.ZodTypeAny, {
                    fields: string[];
                    indexDescriptor: string;
                }, {
                    fields: string[];
                    indexDescriptor: string;
                }>, "many">;
                searchIndexes: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodObject<{
                    indexDescriptor: z.ZodString;
                    searchField: z.ZodString;
                    filterFields: z.ZodArray<z.ZodString, "many">;
                }, "passthrough", z.ZodTypeAny, {
                    searchField: string;
                    filterFields: string[];
                    indexDescriptor: string;
                }, {
                    searchField: string;
                    filterFields: string[];
                    indexDescriptor: string;
                }>, "many">>>;
                vectorIndexes: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodObject<{
                    indexDescriptor: z.ZodString;
                    vectorField: z.ZodString;
                    dimensions: z.ZodOptional<z.ZodNumber>;
                    filterFields: z.ZodArray<z.ZodString, "many">;
                }, "passthrough", z.ZodTypeAny, {
                    filterFields: string[];
                    vectorField: string;
                    indexDescriptor: string;
                    dimensions?: number | undefined;
                }, {
                    filterFields: string[];
                    vectorField: string;
                    indexDescriptor: string;
                    dimensions?: number | undefined;
                }>, "many">>>;
                documentType: z.ZodType<import("./validator.js").ConvexValidator, z.ZodTypeDef, import("./validator.js").ConvexValidator>;
            }, "passthrough", z.ZodTypeAny, {
                tableName: string;
                indexes: {
                    fields: string[];
                    indexDescriptor: string;
                }[];
                documentType: import("./validator.js").ConvexValidator;
                searchIndexes?: {
                    searchField: string;
                    filterFields: string[];
                    indexDescriptor: string;
                }[] | null | undefined;
                vectorIndexes?: {
                    filterFields: string[];
                    vectorField: string;
                    indexDescriptor: string;
                    dimensions?: number | undefined;
                }[] | null | undefined;
            }, {
                tableName: string;
                indexes: {
                    fields: string[];
                    indexDescriptor: string;
                }[];
                documentType: import("./validator.js").ConvexValidator;
                searchIndexes?: {
                    searchField: string;
                    filterFields: string[];
                    indexDescriptor: string;
                }[] | null | undefined;
                vectorIndexes?: {
                    filterFields: string[];
                    vectorField: string;
                    indexDescriptor: string;
                    dimensions?: number | undefined;
                }[] | null | undefined;
            }>, "many">;
            schemaValidation: z.ZodBoolean;
        }, "passthrough", z.ZodTypeAny, {
            schemaValidation: boolean;
            tables: {
                tableName: string;
                indexes: {
                    fields: string[];
                    indexDescriptor: string;
                }[];
                documentType: import("./validator.js").ConvexValidator;
                searchIndexes?: {
                    searchField: string;
                    filterFields: string[];
                    indexDescriptor: string;
                }[] | null | undefined;
                vectorIndexes?: {
                    filterFields: string[];
                    vectorField: string;
                    indexDescriptor: string;
                    dimensions?: number | undefined;
                }[] | null | undefined;
            }[];
        }, {
            schemaValidation: boolean;
            tables: {
                tableName: string;
                indexes: {
                    fields: string[];
                    indexDescriptor: string;
                }[];
                documentType: import("./validator.js").ConvexValidator;
                searchIndexes?: {
                    searchField: string;
                    filterFields: string[];
                    indexDescriptor: string;
                }[] | null | undefined;
                vectorIndexes?: {
                    filterFields: string[];
                    vectorField: string;
                    indexDescriptor: string;
                    dimensions?: number | undefined;
                }[] | null | undefined;
            }[];
        }>>>;
        functions: z.ZodRecord<z.ZodString, z.ZodObject<{
            functions: z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                pos: z.ZodAny;
                udfType: z.ZodUnion<[z.ZodLiteral<"Query">, z.ZodLiteral<"Mutation">, z.ZodLiteral<"Action">]>;
                visibility: z.ZodNullable<z.ZodUnion<[z.ZodObject<{
                    kind: z.ZodLiteral<"public">;
                }, "passthrough", z.ZodTypeAny, {
                    kind: "public";
                }, {
                    kind: "public";
                }>, z.ZodObject<{
                    kind: z.ZodLiteral<"internal">;
                }, "passthrough", z.ZodTypeAny, {
                    kind: "internal";
                }, {
                    kind: "internal";
                }>]>>;
                args: z.ZodNullable<z.ZodString>;
                returns: z.ZodNullable<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, {
                name: string;
                args: string | null;
                visibility: {
                    kind: "public";
                } | {
                    kind: "internal";
                } | null;
                udfType: "Mutation" | "Action" | "Query";
                returns: string | null;
                pos?: any;
            }, {
                name: string;
                args: string | null;
                visibility: {
                    kind: "public";
                } | {
                    kind: "internal";
                } | null;
                udfType: "Mutation" | "Action" | "Query";
                returns: string | null;
                pos?: any;
            }>, "many">;
            httpRoutes: z.ZodAny;
            cronSpecs: z.ZodAny;
            sourceMapped: z.ZodAny;
        }, "passthrough", z.ZodTypeAny, {
            functions: {
                name: string;
                args: string | null;
                visibility: {
                    kind: "public";
                } | {
                    kind: "internal";
                } | null;
                udfType: "Mutation" | "Action" | "Query";
                returns: string | null;
                pos?: any;
            }[];
            httpRoutes?: any;
            cronSpecs?: any;
            sourceMapped?: any;
        }, {
            functions: {
                name: string;
                args: string | null;
                visibility: {
                    kind: "public";
                } | {
                    kind: "internal";
                } | null;
                udfType: "Mutation" | "Action" | "Query";
                returns: string | null;
                pos?: any;
            }[];
            httpRoutes?: any;
            cronSpecs?: any;
            sourceMapped?: any;
        }>>;
        udfConfig: z.ZodObject<{
            serverVersion: z.ZodString;
            importPhaseRngSeed: z.ZodAny;
            importPhaseUnixTimestamp: z.ZodAny;
        }, "passthrough", z.ZodTypeAny, {
            serverVersion: string;
            importPhaseRngSeed?: any;
            importPhaseUnixTimestamp?: any;
        }, {
            serverVersion: string;
            importPhaseRngSeed?: any;
            importPhaseUnixTimestamp?: any;
        }>;
    }, "passthrough", z.ZodTypeAny, {
        definition: {
            path: string;
            childComponents: {
                name: string;
                path: string;
                env?: [string, {
                    type: "value";
                    value: string;
                } | {
                    type: "envVar";
                    name: string;
                }][] | null | undefined;
            }[];
            exports: {
                type: "branch";
                branch: [string, import("./componentDefinition.js").ComponentExports][];
            };
            definitionType: {
                type: "app";
                httpPrefix?: string | undefined;
            } | {
                type: "childComponent";
                name: string;
            };
            httpMounts: Record<string, string>;
            envVars?: [string, {
                type: "value";
                value: string;
                optional?: boolean | undefined;
            }][] | null | undefined;
        };
        functions: Record<string, {
            functions: {
                name: string;
                args: string | null;
                visibility: {
                    kind: "public";
                } | {
                    kind: "internal";
                } | null;
                udfType: "Mutation" | "Action" | "Query";
                returns: string | null;
                pos?: any;
            }[];
            httpRoutes?: any;
            cronSpecs?: any;
            sourceMapped?: any;
        }>;
        udfConfig: {
            serverVersion: string;
            importPhaseRngSeed?: any;
            importPhaseUnixTimestamp?: any;
        };
        schema?: {
            schemaValidation: boolean;
            tables: {
                tableName: string;
                indexes: {
                    fields: string[];
                    indexDescriptor: string;
                }[];
                documentType: import("./validator.js").ConvexValidator;
                searchIndexes?: {
                    searchField: string;
                    filterFields: string[];
                    indexDescriptor: string;
                }[] | null | undefined;
                vectorIndexes?: {
                    filterFields: string[];
                    vectorField: string;
                    indexDescriptor: string;
                    dimensions?: number | undefined;
                }[] | null | undefined;
            }[];
        } | null | undefined;
    }, {
        definition: {
            path: string;
            childComponents: {
                name: string;
                path: string;
                env?: [string, {
                    type: "value";
                    value: string;
                } | {
                    type: "envVar";
                    name: string;
                }][] | null | undefined;
            }[];
            exports: {
                type: "branch";
                branch: [string, import("./componentDefinition.js").ComponentExports][];
            };
            definitionType: {
                type: "app";
                httpPrefix?: string | undefined;
            } | {
                type: "childComponent";
                name: string;
            };
            httpMounts: Record<string, string>;
            envVars?: [string, {
                type: "value";
                value: string;
                optional?: boolean | undefined;
            }][] | null | undefined;
        };
        functions: Record<string, {
            functions: {
                name: string;
                args: string | null;
                visibility: {
                    kind: "public";
                } | {
                    kind: "internal";
                } | null;
                udfType: "Mutation" | "Action" | "Query";
                returns: string | null;
                pos?: any;
            }[];
            httpRoutes?: any;
            cronSpecs?: any;
            sourceMapped?: any;
        }>;
        udfConfig: {
            serverVersion: string;
            importPhaseRngSeed?: any;
            importPhaseUnixTimestamp?: any;
        };
        schema?: {
            schemaValidation: boolean;
            tables: {
                tableName: string;
                indexes: {
                    fields: string[];
                    indexDescriptor: string;
                }[];
                documentType: import("./validator.js").ConvexValidator;
                searchIndexes?: {
                    searchField: string;
                    filterFields: string[];
                    indexDescriptor: string;
                }[] | null | undefined;
                vectorIndexes?: {
                    filterFields: string[];
                    vectorField: string;
                    indexDescriptor: string;
                    dimensions?: number | undefined;
                }[] | null | undefined;
            }[];
        } | null | undefined;
    }>>;
    app: z.ZodType<import("./checkedComponent.js").CheckedComponent, z.ZodTypeDef, import("./checkedComponent.js").CheckedComponent>;
    schemaChange: z.ZodObject<{
        allocatedComponentIds: z.ZodAny;
        schemaIds: z.ZodAny;
        indexDiffs: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
            added_indexes: z.ZodArray<z.ZodIntersection<z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
                name: z.ZodString;
                type: z.ZodLiteral<"database">;
                fields: z.ZodArray<z.ZodString, "many">;
            }, "passthrough", z.ZodTypeAny, {
                type: "database";
                fields: string[];
                name: string;
            }, {
                type: "database";
                fields: string[];
                name: string;
            }>, z.ZodObject<{
                name: z.ZodString;
                type: z.ZodLiteral<"search">;
                searchField: z.ZodString;
                filterFields: z.ZodArray<z.ZodString, "many">;
            }, "passthrough", z.ZodTypeAny, {
                type: "search";
                name: string;
                searchField: string;
                filterFields: string[];
            }, {
                type: "search";
                name: string;
                searchField: string;
                filterFields: string[];
            }>, z.ZodObject<{
                name: z.ZodString;
                type: z.ZodLiteral<"vector">;
                dimensions: z.ZodNumber;
                vectorField: z.ZodString;
                filterFields: z.ZodArray<z.ZodString, "many">;
            }, "passthrough", z.ZodTypeAny, {
                type: "vector";
                name: string;
                filterFields: string[];
                vectorField: string;
                dimensions: number;
            }, {
                type: "vector";
                name: string;
                filterFields: string[];
                vectorField: string;
                dimensions: number;
            }>]>, z.ZodObject<{
                staged: z.ZodOptional<z.ZodBoolean>;
            }, "strip", z.ZodTypeAny, {
                staged?: boolean | undefined;
            }, {
                staged?: boolean | undefined;
            }>>, "many">;
            removed_indexes: z.ZodArray<z.ZodIntersection<z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
                name: z.ZodString;
                type: z.ZodLiteral<"database">;
                fields: z.ZodArray<z.ZodString, "many">;
            }, "passthrough", z.ZodTypeAny, {
                type: "database";
                fields: string[];
                name: string;
            }, {
                type: "database";
                fields: string[];
                name: string;
            }>, z.ZodObject<{
                name: z.ZodString;
                type: z.ZodLiteral<"search">;
                searchField: z.ZodString;
                filterFields: z.ZodArray<z.ZodString, "many">;
            }, "passthrough", z.ZodTypeAny, {
                type: "search";
                name: string;
                searchField: string;
                filterFields: string[];
            }, {
                type: "search";
                name: string;
                searchField: string;
                filterFields: string[];
            }>, z.ZodObject<{
                name: z.ZodString;
                type: z.ZodLiteral<"vector">;
                dimensions: z.ZodNumber;
                vectorField: z.ZodString;
                filterFields: z.ZodArray<z.ZodString, "many">;
            }, "passthrough", z.ZodTypeAny, {
                type: "vector";
                name: string;
                filterFields: string[];
                vectorField: string;
                dimensions: number;
            }, {
                type: "vector";
                name: string;
                filterFields: string[];
                vectorField: string;
                dimensions: number;
            }>]>, z.ZodObject<{
                staged: z.ZodOptional<z.ZodBoolean>;
            }, "strip", z.ZodTypeAny, {
                staged?: boolean | undefined;
            }, {
                staged?: boolean | undefined;
            }>>, "many">;
            enabled_indexes: z.ZodOptional<z.ZodArray<z.ZodIntersection<z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
                name: z.ZodString;
                type: z.ZodLiteral<"database">;
                fields: z.ZodArray<z.ZodString, "many">;
            }, "passthrough", z.ZodTypeAny, {
                type: "database";
                fields: string[];
                name: string;
            }, {
                type: "database";
                fields: string[];
                name: string;
            }>, z.ZodObject<{
                name: z.ZodString;
                type: z.ZodLiteral<"search">;
                searchField: z.ZodString;
                filterFields: z.ZodArray<z.ZodString, "many">;
            }, "passthrough", z.ZodTypeAny, {
                type: "search";
                name: string;
                searchField: string;
                filterFields: string[];
            }, {
                type: "search";
                name: string;
                searchField: string;
                filterFields: string[];
            }>, z.ZodObject<{
                name: z.ZodString;
                type: z.ZodLiteral<"vector">;
                dimensions: z.ZodNumber;
                vectorField: z.ZodString;
                filterFields: z.ZodArray<z.ZodString, "many">;
            }, "passthrough", z.ZodTypeAny, {
                type: "vector";
                name: string;
                filterFields: string[];
                vectorField: string;
                dimensions: number;
            }, {
                type: "vector";
                name: string;
                filterFields: string[];
                vectorField: string;
                dimensions: number;
            }>]>, z.ZodObject<{
                staged: z.ZodOptional<z.ZodBoolean>;
            }, "strip", z.ZodTypeAny, {
                staged?: boolean | undefined;
            }, {
                staged?: boolean | undefined;
            }>>, "many">>;
            disabled_indexes: z.ZodOptional<z.ZodArray<z.ZodIntersection<z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
                name: z.ZodString;
                type: z.ZodLiteral<"database">;
                fields: z.ZodArray<z.ZodString, "many">;
            }, "passthrough", z.ZodTypeAny, {
                type: "database";
                fields: string[];
                name: string;
            }, {
                type: "database";
                fields: string[];
                name: string;
            }>, z.ZodObject<{
                name: z.ZodString;
                type: z.ZodLiteral<"search">;
                searchField: z.ZodString;
                filterFields: z.ZodArray<z.ZodString, "many">;
            }, "passthrough", z.ZodTypeAny, {
                type: "search";
                name: string;
                searchField: string;
                filterFields: string[];
            }, {
                type: "search";
                name: string;
                searchField: string;
                filterFields: string[];
            }>, z.ZodObject<{
                name: z.ZodString;
                type: z.ZodLiteral<"vector">;
                dimensions: z.ZodNumber;
                vectorField: z.ZodString;
                filterFields: z.ZodArray<z.ZodString, "many">;
            }, "passthrough", z.ZodTypeAny, {
                type: "vector";
                name: string;
                filterFields: string[];
                vectorField: string;
                dimensions: number;
            }, {
                type: "vector";
                name: string;
                filterFields: string[];
                vectorField: string;
                dimensions: number;
            }>]>, z.ZodObject<{
                staged: z.ZodOptional<z.ZodBoolean>;
            }, "strip", z.ZodTypeAny, {
                staged?: boolean | undefined;
            }, {
                staged?: boolean | undefined;
            }>>, "many">>;
        }, "passthrough", z.ZodTypeAny, {
            added_indexes: (({
                type: "database";
                fields: string[];
                name: string;
            } | {
                type: "search";
                name: string;
                searchField: string;
                filterFields: string[];
            } | {
                type: "vector";
                name: string;
                filterFields: string[];
                vectorField: string;
                dimensions: number;
            }) & {
                staged?: boolean | undefined;
            })[];
            removed_indexes: (({
                type: "database";
                fields: string[];
                name: string;
            } | {
                type: "search";
                name: string;
                searchField: string;
                filterFields: string[];
            } | {
                type: "vector";
                name: string;
                filterFields: string[];
                vectorField: string;
                dimensions: number;
            }) & {
                staged?: boolean | undefined;
            })[];
            enabled_indexes?: (({
                type: "database";
                fields: string[];
                name: string;
            } | {
                type: "search";
                name: string;
                searchField: string;
                filterFields: string[];
            } | {
                type: "vector";
                name: string;
                filterFields: string[];
                vectorField: string;
                dimensions: number;
            }) & {
                staged?: boolean | undefined;
            })[] | undefined;
            disabled_indexes?: (({
                type: "database";
                fields: string[];
                name: string;
            } | {
                type: "search";
                name: string;
                searchField: string;
                filterFields: string[];
            } | {
                type: "vector";
                name: string;
                filterFields: string[];
                vectorField: string;
                dimensions: number;
            }) & {
                staged?: boolean | undefined;
            })[] | undefined;
        }, {
            added_indexes: (({
                type: "database";
                fields: string[];
                name: string;
            } | {
                type: "search";
                name: string;
                searchField: string;
                filterFields: string[];
            } | {
                type: "vector";
                name: string;
                filterFields: string[];
                vectorField: string;
                dimensions: number;
            }) & {
                staged?: boolean | undefined;
            })[];
            removed_indexes: (({
                type: "database";
                fields: string[];
                name: string;
            } | {
                type: "search";
                name: string;
                searchField: string;
                filterFields: string[];
            } | {
                type: "vector";
                name: string;
                filterFields: string[];
                vectorField: string;
                dimensions: number;
            }) & {
                staged?: boolean | undefined;
            })[];
            enabled_indexes?: (({
                type: "database";
                fields: string[];
                name: string;
            } | {
                type: "search";
                name: string;
                searchField: string;
                filterFields: string[];
            } | {
                type: "vector";
                name: string;
                filterFields: string[];
                vectorField: string;
                dimensions: number;
            }) & {
                staged?: boolean | undefined;
            })[] | undefined;
            disabled_indexes?: (({
                type: "database";
                fields: string[];
                name: string;
            } | {
                type: "search";
                name: string;
                searchField: string;
                filterFields: string[];
            } | {
                type: "vector";
                name: string;
                filterFields: string[];
                vectorField: string;
                dimensions: number;
            }) & {
                staged?: boolean | undefined;
            })[] | undefined;
        }>>>;
    }, "passthrough", z.ZodTypeAny, {
        allocatedComponentIds?: any;
        schemaIds?: any;
        indexDiffs?: Record<string, {
            added_indexes: (({
                type: "database";
                fields: string[];
                name: string;
            } | {
                type: "search";
                name: string;
                searchField: string;
                filterFields: string[];
            } | {
                type: "vector";
                name: string;
                filterFields: string[];
                vectorField: string;
                dimensions: number;
            }) & {
                staged?: boolean | undefined;
            })[];
            removed_indexes: (({
                type: "database";
                fields: string[];
                name: string;
            } | {
                type: "search";
                name: string;
                searchField: string;
                filterFields: string[];
            } | {
                type: "vector";
                name: string;
                filterFields: string[];
                vectorField: string;
                dimensions: number;
            }) & {
                staged?: boolean | undefined;
            })[];
            enabled_indexes?: (({
                type: "database";
                fields: string[];
                name: string;
            } | {
                type: "search";
                name: string;
                searchField: string;
                filterFields: string[];
            } | {
                type: "vector";
                name: string;
                filterFields: string[];
                vectorField: string;
                dimensions: number;
            }) & {
                staged?: boolean | undefined;
            })[] | undefined;
            disabled_indexes?: (({
                type: "database";
                fields: string[];
                name: string;
            } | {
                type: "search";
                name: string;
                searchField: string;
                filterFields: string[];
            } | {
                type: "vector";
                name: string;
                filterFields: string[];
                vectorField: string;
                dimensions: number;
            }) & {
                staged?: boolean | undefined;
            })[] | undefined;
        }> | undefined;
    }, {
        allocatedComponentIds?: any;
        schemaIds?: any;
        indexDiffs?: Record<string, {
            added_indexes: (({
                type: "database";
                fields: string[];
                name: string;
            } | {
                type: "search";
                name: string;
                searchField: string;
                filterFields: string[];
            } | {
                type: "vector";
                name: string;
                filterFields: string[];
                vectorField: string;
                dimensions: number;
            }) & {
                staged?: boolean | undefined;
            })[];
            removed_indexes: (({
                type: "database";
                fields: string[];
                name: string;
            } | {
                type: "search";
                name: string;
                searchField: string;
                filterFields: string[];
            } | {
                type: "vector";
                name: string;
                filterFields: string[];
                vectorField: string;
                dimensions: number;
            }) & {
                staged?: boolean | undefined;
            })[];
            enabled_indexes?: (({
                type: "database";
                fields: string[];
                name: string;
            } | {
                type: "search";
                name: string;
                searchField: string;
                filterFields: string[];
            } | {
                type: "vector";
                name: string;
                filterFields: string[];
                vectorField: string;
                dimensions: number;
            }) & {
                staged?: boolean | undefined;
            })[] | undefined;
            disabled_indexes?: (({
                type: "database";
                fields: string[];
                name: string;
            } | {
                type: "search";
                name: string;
                searchField: string;
                filterFields: string[];
            } | {
                type: "vector";
                name: string;
                filterFields: string[];
                vectorField: string;
                dimensions: number;
            }) & {
                staged?: boolean | undefined;
            })[] | undefined;
        }> | undefined;
    }>;
}, "passthrough", z.ZodTypeAny, {
    app: import("./checkedComponent.js").CheckedComponent;
    environmentVariables: Record<string, string>;
    externalDepsId: string | null;
    componentDefinitionPackages: Record<string, any>;
    appAuth: (z.objectOutputType<{
        applicationID: z.ZodString;
        domain: z.ZodString;
    }, z.ZodTypeAny, "passthrough"> | z.objectOutputType<{
        type: z.ZodLiteral<"customJwt">;
        applicationID: z.ZodNullable<z.ZodString>;
        issuer: z.ZodString;
        jwks: z.ZodString;
        algorithm: z.ZodString;
    }, z.ZodTypeAny, "passthrough">)[];
    analysis: Record<string, {
        definition: {
            path: string;
            childComponents: {
                name: string;
                path: string;
                env?: [string, {
                    type: "value";
                    value: string;
                } | {
                    type: "envVar";
                    name: string;
                }][] | null | undefined;
            }[];
            exports: {
                type: "branch";
                branch: [string, import("./componentDefinition.js").ComponentExports][];
            };
            definitionType: {
                type: "app";
                httpPrefix?: string | undefined;
            } | {
                type: "childComponent";
                name: string;
            };
            httpMounts: Record<string, string>;
            envVars?: [string, {
                type: "value";
                value: string;
                optional?: boolean | undefined;
            }][] | null | undefined;
        };
        functions: Record<string, {
            functions: {
                name: string;
                args: string | null;
                visibility: {
                    kind: "public";
                } | {
                    kind: "internal";
                } | null;
                udfType: "Mutation" | "Action" | "Query";
                returns: string | null;
                pos?: any;
            }[];
            httpRoutes?: any;
            cronSpecs?: any;
            sourceMapped?: any;
        }>;
        udfConfig: {
            serverVersion: string;
            importPhaseRngSeed?: any;
            importPhaseUnixTimestamp?: any;
        };
        schema?: {
            schemaValidation: boolean;
            tables: {
                tableName: string;
                indexes: {
                    fields: string[];
                    indexDescriptor: string;
                }[];
                documentType: import("./validator.js").ConvexValidator;
                searchIndexes?: {
                    searchField: string;
                    filterFields: string[];
                    indexDescriptor: string;
                }[] | null | undefined;
                vectorIndexes?: {
                    filterFields: string[];
                    vectorField: string;
                    indexDescriptor: string;
                    dimensions?: number | undefined;
                }[] | null | undefined;
            }[];
        } | null | undefined;
    }>;
    schemaChange: {
        allocatedComponentIds?: any;
        schemaIds?: any;
        indexDiffs?: Record<string, {
            added_indexes: (({
                type: "database";
                fields: string[];
                name: string;
            } | {
                type: "search";
                name: string;
                searchField: string;
                filterFields: string[];
            } | {
                type: "vector";
                name: string;
                filterFields: string[];
                vectorField: string;
                dimensions: number;
            }) & {
                staged?: boolean | undefined;
            })[];
            removed_indexes: (({
                type: "database";
                fields: string[];
                name: string;
            } | {
                type: "search";
                name: string;
                searchField: string;
                filterFields: string[];
            } | {
                type: "vector";
                name: string;
                filterFields: string[];
                vectorField: string;
                dimensions: number;
            }) & {
                staged?: boolean | undefined;
            })[];
            enabled_indexes?: (({
                type: "database";
                fields: string[];
                name: string;
            } | {
                type: "search";
                name: string;
                searchField: string;
                filterFields: string[];
            } | {
                type: "vector";
                name: string;
                filterFields: string[];
                vectorField: string;
                dimensions: number;
            }) & {
                staged?: boolean | undefined;
            })[] | undefined;
            disabled_indexes?: (({
                type: "database";
                fields: string[];
                name: string;
            } | {
                type: "search";
                name: string;
                searchField: string;
                filterFields: string[];
            } | {
                type: "vector";
                name: string;
                filterFields: string[];
                vectorField: string;
                dimensions: number;
            }) & {
                staged?: boolean | undefined;
            })[] | undefined;
        }> | undefined;
    };
}, {
    app: import("./checkedComponent.js").CheckedComponent;
    environmentVariables: Record<string, string>;
    externalDepsId: string | null;
    componentDefinitionPackages: Record<string, any>;
    appAuth: (z.objectInputType<{
        applicationID: z.ZodString;
        domain: z.ZodString;
    }, z.ZodTypeAny, "passthrough"> | z.objectInputType<{
        type: z.ZodLiteral<"customJwt">;
        applicationID: z.ZodNullable<z.ZodString>;
        issuer: z.ZodString;
        jwks: z.ZodString;
        algorithm: z.ZodString;
    }, z.ZodTypeAny, "passthrough">)[];
    analysis: Record<string, {
        definition: {
            path: string;
            childComponents: {
                name: string;
                path: string;
                env?: [string, {
                    type: "value";
                    value: string;
                } | {
                    type: "envVar";
                    name: string;
                }][] | null | undefined;
            }[];
            exports: {
                type: "branch";
                branch: [string, import("./componentDefinition.js").ComponentExports][];
            };
            definitionType: {
                type: "app";
                httpPrefix?: string | undefined;
            } | {
                type: "childComponent";
                name: string;
            };
            httpMounts: Record<string, string>;
            envVars?: [string, {
                type: "value";
                value: string;
                optional?: boolean | undefined;
            }][] | null | undefined;
        };
        functions: Record<string, {
            functions: {
                name: string;
                args: string | null;
                visibility: {
                    kind: "public";
                } | {
                    kind: "internal";
                } | null;
                udfType: "Mutation" | "Action" | "Query";
                returns: string | null;
                pos?: any;
            }[];
            httpRoutes?: any;
            cronSpecs?: any;
            sourceMapped?: any;
        }>;
        udfConfig: {
            serverVersion: string;
            importPhaseRngSeed?: any;
            importPhaseUnixTimestamp?: any;
        };
        schema?: {
            schemaValidation: boolean;
            tables: {
                tableName: string;
                indexes: {
                    fields: string[];
                    indexDescriptor: string;
                }[];
                documentType: import("./validator.js").ConvexValidator;
                searchIndexes?: {
                    searchField: string;
                    filterFields: string[];
                    indexDescriptor: string;
                }[] | null | undefined;
                vectorIndexes?: {
                    filterFields: string[];
                    vectorField: string;
                    indexDescriptor: string;
                    dimensions?: number | undefined;
                }[] | null | undefined;
            }[];
        } | null | undefined;
    }>;
    schemaChange: {
        allocatedComponentIds?: any;
        schemaIds?: any;
        indexDiffs?: Record<string, {
            added_indexes: (({
                type: "database";
                fields: string[];
                name: string;
            } | {
                type: "search";
                name: string;
                searchField: string;
                filterFields: string[];
            } | {
                type: "vector";
                name: string;
                filterFields: string[];
                vectorField: string;
                dimensions: number;
            }) & {
                staged?: boolean | undefined;
            })[];
            removed_indexes: (({
                type: "database";
                fields: string[];
                name: string;
            } | {
                type: "search";
                name: string;
                searchField: string;
                filterFields: string[];
            } | {
                type: "vector";
                name: string;
                filterFields: string[];
                vectorField: string;
                dimensions: number;
            }) & {
                staged?: boolean | undefined;
            })[];
            enabled_indexes?: (({
                type: "database";
                fields: string[];
                name: string;
            } | {
                type: "search";
                name: string;
                searchField: string;
                filterFields: string[];
            } | {
                type: "vector";
                name: string;
                filterFields: string[];
                vectorField: string;
                dimensions: number;
            }) & {
                staged?: boolean | undefined;
            })[] | undefined;
            disabled_indexes?: (({
                type: "database";
                fields: string[];
                name: string;
            } | {
                type: "search";
                name: string;
                searchField: string;
                filterFields: string[];
            } | {
                type: "vector";
                name: string;
                filterFields: string[];
                vectorField: string;
                dimensions: number;
            }) & {
                staged?: boolean | undefined;
            })[] | undefined;
        }> | undefined;
    };
}>;
export type StartPushResponse = z.infer<typeof startPushResponse>;
export declare const evaluatePushResponse: z.ZodObject<{
    schemaChange: z.ZodObject<{
        allocatedComponentIds: z.ZodAny;
        schemaIds: z.ZodAny;
        indexDiffs: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
            added_indexes: z.ZodArray<z.ZodIntersection<z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
                name: z.ZodString;
                type: z.ZodLiteral<"database">;
                fields: z.ZodArray<z.ZodString, "many">;
            }, "passthrough", z.ZodTypeAny, {
                type: "database";
                fields: string[];
                name: string;
            }, {
                type: "database";
                fields: string[];
                name: string;
            }>, z.ZodObject<{
                name: z.ZodString;
                type: z.ZodLiteral<"search">;
                searchField: z.ZodString;
                filterFields: z.ZodArray<z.ZodString, "many">;
            }, "passthrough", z.ZodTypeAny, {
                type: "search";
                name: string;
                searchField: string;
                filterFields: string[];
            }, {
                type: "search";
                name: string;
                searchField: string;
                filterFields: string[];
            }>, z.ZodObject<{
                name: z.ZodString;
                type: z.ZodLiteral<"vector">;
                dimensions: z.ZodNumber;
                vectorField: z.ZodString;
                filterFields: z.ZodArray<z.ZodString, "many">;
            }, "passthrough", z.ZodTypeAny, {
                type: "vector";
                name: string;
                filterFields: string[];
                vectorField: string;
                dimensions: number;
            }, {
                type: "vector";
                name: string;
                filterFields: string[];
                vectorField: string;
                dimensions: number;
            }>]>, z.ZodObject<{
                staged: z.ZodOptional<z.ZodBoolean>;
            }, "strip", z.ZodTypeAny, {
                staged?: boolean | undefined;
            }, {
                staged?: boolean | undefined;
            }>>, "many">;
            removed_indexes: z.ZodArray<z.ZodIntersection<z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
                name: z.ZodString;
                type: z.ZodLiteral<"database">;
                fields: z.ZodArray<z.ZodString, "many">;
            }, "passthrough", z.ZodTypeAny, {
                type: "database";
                fields: string[];
                name: string;
            }, {
                type: "database";
                fields: string[];
                name: string;
            }>, z.ZodObject<{
                name: z.ZodString;
                type: z.ZodLiteral<"search">;
                searchField: z.ZodString;
                filterFields: z.ZodArray<z.ZodString, "many">;
            }, "passthrough", z.ZodTypeAny, {
                type: "search";
                name: string;
                searchField: string;
                filterFields: string[];
            }, {
                type: "search";
                name: string;
                searchField: string;
                filterFields: string[];
            }>, z.ZodObject<{
                name: z.ZodString;
                type: z.ZodLiteral<"vector">;
                dimensions: z.ZodNumber;
                vectorField: z.ZodString;
                filterFields: z.ZodArray<z.ZodString, "many">;
            }, "passthrough", z.ZodTypeAny, {
                type: "vector";
                name: string;
                filterFields: string[];
                vectorField: string;
                dimensions: number;
            }, {
                type: "vector";
                name: string;
                filterFields: string[];
                vectorField: string;
                dimensions: number;
            }>]>, z.ZodObject<{
                staged: z.ZodOptional<z.ZodBoolean>;
            }, "strip", z.ZodTypeAny, {
                staged?: boolean | undefined;
            }, {
                staged?: boolean | undefined;
            }>>, "many">;
            enabled_indexes: z.ZodOptional<z.ZodArray<z.ZodIntersection<z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
                name: z.ZodString;
                type: z.ZodLiteral<"database">;
                fields: z.ZodArray<z.ZodString, "many">;
            }, "passthrough", z.ZodTypeAny, {
                type: "database";
                fields: string[];
                name: string;
            }, {
                type: "database";
                fields: string[];
                name: string;
            }>, z.ZodObject<{
                name: z.ZodString;
                type: z.ZodLiteral<"search">;
                searchField: z.ZodString;
                filterFields: z.ZodArray<z.ZodString, "many">;
            }, "passthrough", z.ZodTypeAny, {
                type: "search";
                name: string;
                searchField: string;
                filterFields: string[];
            }, {
                type: "search";
                name: string;
                searchField: string;
                filterFields: string[];
            }>, z.ZodObject<{
                name: z.ZodString;
                type: z.ZodLiteral<"vector">;
                dimensions: z.ZodNumber;
                vectorField: z.ZodString;
                filterFields: z.ZodArray<z.ZodString, "many">;
            }, "passthrough", z.ZodTypeAny, {
                type: "vector";
                name: string;
                filterFields: string[];
                vectorField: string;
                dimensions: number;
            }, {
                type: "vector";
                name: string;
                filterFields: string[];
                vectorField: string;
                dimensions: number;
            }>]>, z.ZodObject<{
                staged: z.ZodOptional<z.ZodBoolean>;
            }, "strip", z.ZodTypeAny, {
                staged?: boolean | undefined;
            }, {
                staged?: boolean | undefined;
            }>>, "many">>;
            disabled_indexes: z.ZodOptional<z.ZodArray<z.ZodIntersection<z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
                name: z.ZodString;
                type: z.ZodLiteral<"database">;
                fields: z.ZodArray<z.ZodString, "many">;
            }, "passthrough", z.ZodTypeAny, {
                type: "database";
                fields: string[];
                name: string;
            }, {
                type: "database";
                fields: string[];
                name: string;
            }>, z.ZodObject<{
                name: z.ZodString;
                type: z.ZodLiteral<"search">;
                searchField: z.ZodString;
                filterFields: z.ZodArray<z.ZodString, "many">;
            }, "passthrough", z.ZodTypeAny, {
                type: "search";
                name: string;
                searchField: string;
                filterFields: string[];
            }, {
                type: "search";
                name: string;
                searchField: string;
                filterFields: string[];
            }>, z.ZodObject<{
                name: z.ZodString;
                type: z.ZodLiteral<"vector">;
                dimensions: z.ZodNumber;
                vectorField: z.ZodString;
                filterFields: z.ZodArray<z.ZodString, "many">;
            }, "passthrough", z.ZodTypeAny, {
                type: "vector";
                name: string;
                filterFields: string[];
                vectorField: string;
                dimensions: number;
            }, {
                type: "vector";
                name: string;
                filterFields: string[];
                vectorField: string;
                dimensions: number;
            }>]>, z.ZodObject<{
                staged: z.ZodOptional<z.ZodBoolean>;
            }, "strip", z.ZodTypeAny, {
                staged?: boolean | undefined;
            }, {
                staged?: boolean | undefined;
            }>>, "many">>;
        }, "passthrough", z.ZodTypeAny, {
            added_indexes: (({
                type: "database";
                fields: string[];
                name: string;
            } | {
                type: "search";
                name: string;
                searchField: string;
                filterFields: string[];
            } | {
                type: "vector";
                name: string;
                filterFields: string[];
                vectorField: string;
                dimensions: number;
            }) & {
                staged?: boolean | undefined;
            })[];
            removed_indexes: (({
                type: "database";
                fields: string[];
                name: string;
            } | {
                type: "search";
                name: string;
                searchField: string;
                filterFields: string[];
            } | {
                type: "vector";
                name: string;
                filterFields: string[];
                vectorField: string;
                dimensions: number;
            }) & {
                staged?: boolean | undefined;
            })[];
            enabled_indexes?: (({
                type: "database";
                fields: string[];
                name: string;
            } | {
                type: "search";
                name: string;
                searchField: string;
                filterFields: string[];
            } | {
                type: "vector";
                name: string;
                filterFields: string[];
                vectorField: string;
                dimensions: number;
            }) & {
                staged?: boolean | undefined;
            })[] | undefined;
            disabled_indexes?: (({
                type: "database";
                fields: string[];
                name: string;
            } | {
                type: "search";
                name: string;
                searchField: string;
                filterFields: string[];
            } | {
                type: "vector";
                name: string;
                filterFields: string[];
                vectorField: string;
                dimensions: number;
            }) & {
                staged?: boolean | undefined;
            })[] | undefined;
        }, {
            added_indexes: (({
                type: "database";
                fields: string[];
                name: string;
            } | {
                type: "search";
                name: string;
                searchField: string;
                filterFields: string[];
            } | {
                type: "vector";
                name: string;
                filterFields: string[];
                vectorField: string;
                dimensions: number;
            }) & {
                staged?: boolean | undefined;
            })[];
            removed_indexes: (({
                type: "database";
                fields: string[];
                name: string;
            } | {
                type: "search";
                name: string;
                searchField: string;
                filterFields: string[];
            } | {
                type: "vector";
                name: string;
                filterFields: string[];
                vectorField: string;
                dimensions: number;
            }) & {
                staged?: boolean | undefined;
            })[];
            enabled_indexes?: (({
                type: "database";
                fields: string[];
                name: string;
            } | {
                type: "search";
                name: string;
                searchField: string;
                filterFields: string[];
            } | {
                type: "vector";
                name: string;
                filterFields: string[];
                vectorField: string;
                dimensions: number;
            }) & {
                staged?: boolean | undefined;
            })[] | undefined;
            disabled_indexes?: (({
                type: "database";
                fields: string[];
                name: string;
            } | {
                type: "search";
                name: string;
                searchField: string;
                filterFields: string[];
            } | {
                type: "vector";
                name: string;
                filterFields: string[];
                vectorField: string;
                dimensions: number;
            }) & {
                staged?: boolean | undefined;
            })[] | undefined;
        }>>>;
    }, "passthrough", z.ZodTypeAny, {
        allocatedComponentIds?: any;
        schemaIds?: any;
        indexDiffs?: Record<string, {
            added_indexes: (({
                type: "database";
                fields: string[];
                name: string;
            } | {
                type: "search";
                name: string;
                searchField: string;
                filterFields: string[];
            } | {
                type: "vector";
                name: string;
                filterFields: string[];
                vectorField: string;
                dimensions: number;
            }) & {
                staged?: boolean | undefined;
            })[];
            removed_indexes: (({
                type: "database";
                fields: string[];
                name: string;
            } | {
                type: "search";
                name: string;
                searchField: string;
                filterFields: string[];
            } | {
                type: "vector";
                name: string;
                filterFields: string[];
                vectorField: string;
                dimensions: number;
            }) & {
                staged?: boolean | undefined;
            })[];
            enabled_indexes?: (({
                type: "database";
                fields: string[];
                name: string;
            } | {
                type: "search";
                name: string;
                searchField: string;
                filterFields: string[];
            } | {
                type: "vector";
                name: string;
                filterFields: string[];
                vectorField: string;
                dimensions: number;
            }) & {
                staged?: boolean | undefined;
            })[] | undefined;
            disabled_indexes?: (({
                type: "database";
                fields: string[];
                name: string;
            } | {
                type: "search";
                name: string;
                searchField: string;
                filterFields: string[];
            } | {
                type: "vector";
                name: string;
                filterFields: string[];
                vectorField: string;
                dimensions: number;
            }) & {
                staged?: boolean | undefined;
            })[] | undefined;
        }> | undefined;
    }, {
        allocatedComponentIds?: any;
        schemaIds?: any;
        indexDiffs?: Record<string, {
            added_indexes: (({
                type: "database";
                fields: string[];
                name: string;
            } | {
                type: "search";
                name: string;
                searchField: string;
                filterFields: string[];
            } | {
                type: "vector";
                name: string;
                filterFields: string[];
                vectorField: string;
                dimensions: number;
            }) & {
                staged?: boolean | undefined;
            })[];
            removed_indexes: (({
                type: "database";
                fields: string[];
                name: string;
            } | {
                type: "search";
                name: string;
                searchField: string;
                filterFields: string[];
            } | {
                type: "vector";
                name: string;
                filterFields: string[];
                vectorField: string;
                dimensions: number;
            }) & {
                staged?: boolean | undefined;
            })[];
            enabled_indexes?: (({
                type: "database";
                fields: string[];
                name: string;
            } | {
                type: "search";
                name: string;
                searchField: string;
                filterFields: string[];
            } | {
                type: "vector";
                name: string;
                filterFields: string[];
                vectorField: string;
                dimensions: number;
            }) & {
                staged?: boolean | undefined;
            })[] | undefined;
            disabled_indexes?: (({
                type: "database";
                fields: string[];
                name: string;
            } | {
                type: "search";
                name: string;
                searchField: string;
                filterFields: string[];
            } | {
                type: "vector";
                name: string;
                filterFields: string[];
                vectorField: string;
                dimensions: number;
            }) & {
                staged?: boolean | undefined;
            })[] | undefined;
        }> | undefined;
    }>;
}, "passthrough", z.ZodTypeAny, {
    schemaChange: {
        allocatedComponentIds?: any;
        schemaIds?: any;
        indexDiffs?: Record<string, {
            added_indexes: (({
                type: "database";
                fields: string[];
                name: string;
            } | {
                type: "search";
                name: string;
                searchField: string;
                filterFields: string[];
            } | {
                type: "vector";
                name: string;
                filterFields: string[];
                vectorField: string;
                dimensions: number;
            }) & {
                staged?: boolean | undefined;
            })[];
            removed_indexes: (({
                type: "database";
                fields: string[];
                name: string;
            } | {
                type: "search";
                name: string;
                searchField: string;
                filterFields: string[];
            } | {
                type: "vector";
                name: string;
                filterFields: string[];
                vectorField: string;
                dimensions: number;
            }) & {
                staged?: boolean | undefined;
            })[];
            enabled_indexes?: (({
                type: "database";
                fields: string[];
                name: string;
            } | {
                type: "search";
                name: string;
                searchField: string;
                filterFields: string[];
            } | {
                type: "vector";
                name: string;
                filterFields: string[];
                vectorField: string;
                dimensions: number;
            }) & {
                staged?: boolean | undefined;
            })[] | undefined;
            disabled_indexes?: (({
                type: "database";
                fields: string[];
                name: string;
            } | {
                type: "search";
                name: string;
                searchField: string;
                filterFields: string[];
            } | {
                type: "vector";
                name: string;
                filterFields: string[];
                vectorField: string;
                dimensions: number;
            }) & {
                staged?: boolean | undefined;
            })[] | undefined;
        }> | undefined;
    };
}, {
    schemaChange: {
        allocatedComponentIds?: any;
        schemaIds?: any;
        indexDiffs?: Record<string, {
            added_indexes: (({
                type: "database";
                fields: string[];
                name: string;
            } | {
                type: "search";
                name: string;
                searchField: string;
                filterFields: string[];
            } | {
                type: "vector";
                name: string;
                filterFields: string[];
                vectorField: string;
                dimensions: number;
            }) & {
                staged?: boolean | undefined;
            })[];
            removed_indexes: (({
                type: "database";
                fields: string[];
                name: string;
            } | {
                type: "search";
                name: string;
                searchField: string;
                filterFields: string[];
            } | {
                type: "vector";
                name: string;
                filterFields: string[];
                vectorField: string;
                dimensions: number;
            }) & {
                staged?: boolean | undefined;
            })[];
            enabled_indexes?: (({
                type: "database";
                fields: string[];
                name: string;
            } | {
                type: "search";
                name: string;
                searchField: string;
                filterFields: string[];
            } | {
                type: "vector";
                name: string;
                filterFields: string[];
                vectorField: string;
                dimensions: number;
            }) & {
                staged?: boolean | undefined;
            })[] | undefined;
            disabled_indexes?: (({
                type: "database";
                fields: string[];
                name: string;
            } | {
                type: "search";
                name: string;
                searchField: string;
                filterFields: string[];
            } | {
                type: "vector";
                name: string;
                filterFields: string[];
                vectorField: string;
                dimensions: number;
            }) & {
                staged?: boolean | undefined;
            })[] | undefined;
        }> | undefined;
    };
}>;
export type EvaluatePushResponse = z.infer<typeof evaluatePushResponse>;
export declare const componentSchemaStatus: z.ZodObject<{
    schemaValidationComplete: z.ZodBoolean;
    indexesComplete: z.ZodNumber;
    indexesTotal: z.ZodNumber;
}, "passthrough", z.ZodTypeAny, {
    schemaValidationComplete: boolean;
    indexesComplete: number;
    indexesTotal: number;
}, {
    schemaValidationComplete: boolean;
    indexesComplete: number;
    indexesTotal: number;
}>;
export type ComponentSchemaStatus = z.infer<typeof componentSchemaStatus>;
export declare const schemaStatus: z.ZodUnion<[z.ZodObject<{
    type: z.ZodLiteral<"inProgress">;
    components: z.ZodRecord<z.ZodString, z.ZodObject<{
        schemaValidationComplete: z.ZodBoolean;
        indexesComplete: z.ZodNumber;
        indexesTotal: z.ZodNumber;
    }, "passthrough", z.ZodTypeAny, {
        schemaValidationComplete: boolean;
        indexesComplete: number;
        indexesTotal: number;
    }, {
        schemaValidationComplete: boolean;
        indexesComplete: number;
        indexesTotal: number;
    }>>;
}, "passthrough", z.ZodTypeAny, {
    type: "inProgress";
    components: Record<string, {
        schemaValidationComplete: boolean;
        indexesComplete: number;
        indexesTotal: number;
    }>;
}, {
    type: "inProgress";
    components: Record<string, {
        schemaValidationComplete: boolean;
        indexesComplete: number;
        indexesTotal: number;
    }>;
}>, z.ZodObject<{
    type: z.ZodLiteral<"failed">;
    error: z.ZodString;
    componentPath: z.ZodString;
    tableName: z.ZodNullable<z.ZodString>;
}, "passthrough", z.ZodTypeAny, {
    type: "failed";
    tableName: string | null;
    error: string;
    componentPath: string;
}, {
    type: "failed";
    tableName: string | null;
    error: string;
    componentPath: string;
}>, z.ZodObject<{
    type: z.ZodLiteral<"raceDetected">;
}, "passthrough", z.ZodTypeAny, {
    type: "raceDetected";
}, {
    type: "raceDetected";
}>, z.ZodObject<{
    type: z.ZodLiteral<"complete">;
}, "passthrough", z.ZodTypeAny, {
    type: "complete";
}, {
    type: "complete";
}>]>;
export type SchemaStatus = z.infer<typeof schemaStatus>;
//# sourceMappingURL=startPush.d.ts.map