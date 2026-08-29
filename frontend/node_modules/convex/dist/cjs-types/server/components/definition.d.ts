type SerializedValidator = {
    type: "value";
    value: string;
};
export type ComponentDefinitionExport = {
    name: string;
    path: string;
    definitionType: {
        type: "childComponent";
        name: string;
    };
    childComponents: [];
    exports: {
        type: "branch";
        branch: [];
    };
};
export type ComponentDefinitionType = {
    type: "childComponent";
    name: string;
    args: [string, {
        type: "value";
        value: string;
    }][];
};
export type AppDefinitionType = {
    type: "app";
};
type ComponentInstantiation = {
    name: string;
    path: string;
    args: [string, {
        type: "value";
        value: string;
    }][] | null;
    env: [string, {
        type: "value";
        value: string;
    }][] | null;
};
export type HttpMount = string;
type ComponentExport = {
    type: "branch";
    branch: [string, ComponentExport][];
} | {
    type: "leaf";
    leaf: string;
};
export type ComponentDefinitionAnalysis = {
    name: string;
    definitionType: ComponentDefinitionType;
    childComponents: ComponentInstantiation[];
    httpMounts: Record<string, HttpMount>;
    exports: ComponentExport;
    envVars?: [string, SerializedValidator & {
        optional?: boolean;
    }][];
};
export type AppDefinitionAnalysis = {
    definitionType: AppDefinitionType;
    httpPrefix?: string;
    childComponents: ComponentInstantiation[];
    httpMounts: Record<string, HttpMount>;
    exports: ComponentExport;
    envVars?: [string, SerializedValidator & {
        optional?: boolean;
    }][];
};
export {};
//# sourceMappingURL=definition.d.ts.map