import { z } from "zod";
import { Identifier, Reference } from "./types.js";
import { ConvexValidator } from "./validator.js";
export declare const componentEnvDependencyValidator: z.ZodObject<{
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
}>;
export declare const componentDefinitionType: z.ZodUnion<[z.ZodObject<{
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
export declare const componentEnvBinding: z.ZodUnion<[z.ZodObject<{
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
}>]>;
export declare const componentInstantiation: z.ZodObject<{
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
}>;
export type ComponentExports = {
    type: "leaf";
    leaf: Reference;
} | {
    type: "branch";
    branch: [Identifier, ComponentExports][];
};
export declare const componentExports: z.ZodType<ComponentExports>;
export declare const componentDefinitionMetadata: z.ZodObject<{
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
        branch: z.ZodArray<z.ZodTuple<[z.ZodString, z.ZodType<ComponentExports, z.ZodTypeDef, ComponentExports>], null>, "many">;
    }, "passthrough", z.ZodTypeAny, {
        type: "branch";
        branch: [string, ComponentExports][];
    }, {
        type: "branch";
        branch: [string, ComponentExports][];
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
        branch: [string, ComponentExports][];
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
        branch: [string, ComponentExports][];
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
export declare const indexSchema: z.ZodObject<{
    indexDescriptor: z.ZodString;
    fields: z.ZodArray<z.ZodString, "many">;
}, "passthrough", z.ZodTypeAny, {
    fields: string[];
    indexDescriptor: string;
}, {
    fields: string[];
    indexDescriptor: string;
}>;
export declare const vectorIndexSchema: z.ZodObject<{
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
}>;
export declare const searchIndexSchema: z.ZodObject<{
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
}>;
export declare const tableDefinition: z.ZodObject<{
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
    documentType: z.ZodType<ConvexValidator, z.ZodTypeDef, ConvexValidator>;
}, "passthrough", z.ZodTypeAny, {
    tableName: string;
    indexes: {
        fields: string[];
        indexDescriptor: string;
    }[];
    documentType: ConvexValidator;
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
    documentType: ConvexValidator;
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
}>;
export type TableDefinition = z.infer<typeof tableDefinition>;
export declare const analyzedSchema: z.ZodObject<{
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
        documentType: z.ZodType<ConvexValidator, z.ZodTypeDef, ConvexValidator>;
    }, "passthrough", z.ZodTypeAny, {
        tableName: string;
        indexes: {
            fields: string[];
            indexDescriptor: string;
        }[];
        documentType: ConvexValidator;
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
        documentType: ConvexValidator;
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
        documentType: ConvexValidator;
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
        documentType: ConvexValidator;
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
}>;
export type AnalyzedSchema = z.infer<typeof analyzedSchema>;
export declare const evaluatedComponentDefinition: z.ZodObject<{
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
            branch: z.ZodArray<z.ZodTuple<[z.ZodString, z.ZodType<ComponentExports, z.ZodTypeDef, ComponentExports>], null>, "many">;
        }, "passthrough", z.ZodTypeAny, {
            type: "branch";
            branch: [string, ComponentExports][];
        }, {
            type: "branch";
            branch: [string, ComponentExports][];
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
            branch: [string, ComponentExports][];
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
            branch: [string, ComponentExports][];
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
            documentType: z.ZodType<ConvexValidator, z.ZodTypeDef, ConvexValidator>;
        }, "passthrough", z.ZodTypeAny, {
            tableName: string;
            indexes: {
                fields: string[];
                indexDescriptor: string;
            }[];
            documentType: ConvexValidator;
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
            documentType: ConvexValidator;
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
            documentType: ConvexValidator;
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
            documentType: ConvexValidator;
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
            branch: [string, ComponentExports][];
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
            documentType: ConvexValidator;
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
            branch: [string, ComponentExports][];
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
            documentType: ConvexValidator;
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
export type EvaluatedComponentDefinition = z.infer<typeof evaluatedComponentDefinition>;
//# sourceMappingURL=componentDefinition.d.ts.map