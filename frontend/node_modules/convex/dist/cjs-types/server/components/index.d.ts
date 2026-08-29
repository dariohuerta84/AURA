import { AnyFunctionReference, FunctionReference, FunctionType } from "../api.js";
import { DefaultFunctionArgs } from "../registration.js";
import type { Validator, VLiteral, VOptional, VString, VUnion } from "../../values/validators.js";
import type { Infer } from "../../values/validator.js";
import type { Expand } from "../../type_utils.js";
export { getFunctionAddress } from "./paths.js";
/**
 * A serializable reference to a Convex function.
 * Passing a this reference to another component allows that component to call this
 * function during the current function execution or at any later time.
 * Function handles are used like `api.folder.function` FunctionReferences,
 * e.g. `ctx.scheduler.runAfter(0, functionReference, args)`.
 *
 * A function reference is stable across code pushes but it's possible
 * the Convex function it refers to might no longer exist.
 *
 * This is a feature of components, which are in beta.
 * This API is unstable and may change in subsequent releases.
 */
export type FunctionHandle<Type extends FunctionType, Args extends DefaultFunctionArgs = any, ReturnType = any> = string & FunctionReference<Type, "internal", Args, ReturnType>;
/**
 * Create a serializable reference to a Convex function.
 * Passing a this reference to another component allows that component to call this
 * function during the current function execution or at any later time.
 * Function handles are used like `api.folder.function` FunctionReferences,
 * e.g. `ctx.scheduler.runAfter(0, functionReference, args)`.
 *
 * A function reference is stable across code pushes but it's possible
 * the Convex function it refers to might no longer exist.
 *
 * This is a feature of components, which are in beta.
 * This API is unstable and may change in subsequent releases.
 */
export declare function createFunctionHandle<Type extends FunctionType, Args extends DefaultFunctionArgs, ReturnType>(functionReference: FunctionReference<Type, "public" | "internal", Args, ReturnType>): Promise<FunctionHandle<Type, Args, ReturnType>>;
interface ComponentExports {
    [key: string]: FunctionReference<any, any, any, any> | ComponentExports;
}
/**
 * An object of this type should be the default export of a
 * convex.config.ts file in a component definition directory.
 *
 * This is a feature of components, which are in beta.
 * This API is unstable and may change in subsequent releases.
 */
export type ComponentDefinition<Exports extends ComponentExports = any, Env extends EnvDefinition = {}> = {
    /**
     * Install a component with the given definition in this component definition.
     *
     * Takes a component definition and an optional name.
     *
     * For editor tooling this method expects a {@link ComponentDefinition}
     * but at runtime the object that is imported will be a {@link ImportedComponentDefinition}
     */
    use<Definition extends ComponentDefinition<any, any>>(definition: Definition, ...args: UseArgs<Definition>): InstalledComponent<Definition>;
    /**
     * Internal type-only property tracking exports provided.
     *
     * @deprecated This is a type-only property, don't use it.
     */
    __exports: Exports;
    /**
     * References to this component's declared env vars. Pass one of these in
     * `app.use(child, { env: { ... } })` to bind a child's env var by
     * reference to this component's env var.
     */
    env: EnvRefFromDefinition<Env>;
    /**
     * Internal type-only property tracking env definition.
     *
     * @deprecated This is a type-only property, don't use it.
     */
    __env: Env;
};
type ComponentDefinitionExports<T extends ComponentDefinition<any, any>> = T["__exports"];
type ComponentDefinitionEnv<T extends ComponentDefinition<any, any>> = T["__env"];
/**
 * The names in an {@link EnvDefinition} whose validators are required (not
 * wrapped in `v.optional(...)`).
 */
type RequiredEnvKeys<E extends EnvDefinition> = {
    [K in keyof E]: E[K] extends Validator<any, "optional", any> ? never : K;
}[keyof E];
/**
 * Options for installing a component via `app.use()` or `component.use()`.
 *
 * If the component declares any required env vars, the `env` property is
 * required. Otherwise it is optional, so that a component with no env vars (or
 * only optional ones) can be installed without passing `env`.
 */
type UseOptions<Definition extends ComponentDefinition<any, any>> = RequiredEnvKeys<ComponentDefinitionEnv<Definition>> extends never ? {
    name?: string;
    httpPrefix?: string;
    env?: UseOptionsEnv<ComponentDefinitionEnv<Definition>>;
} : {
    name?: string;
    httpPrefix?: string;
    env: UseOptionsEnv<ComponentDefinitionEnv<Definition>>;
};
/**
 * The arguments to `use()` after the component definition.
 *
 * When the component declares required env vars the `options` argument is
 * mandatory (so it can't be dropped to skip the required `env`); otherwise it
 * is optional.
 */
type UseArgs<Definition extends ComponentDefinition<any, any>> = RequiredEnvKeys<ComponentDefinitionEnv<Definition>> extends never ? [options?: UseOptions<Definition>] : [options: UseOptions<Definition>];
type UseOptionsEnv<E extends EnvDefinition> = Expand<{
    [K in keyof E as E[K] extends Validator<any, "optional", any> ? never : K]: Infer<E[K]> | EnvRef;
} & {
    [K in keyof E as E[K] extends Validator<any, "optional", any> ? K : never]?: Infer<E[K]> | EnvRef | undefined;
}>;
/**
 * A string-like validator: `v.string()`, a string `v.literal("...")`, or a
 * `v.union(...)` of those (recursively). Component env vars are serialized
 * as strings on the wire, so only string-typed validators are allowed.
 *
 * @public
 */
export type StringLikeValidator = VString<string, "required"> | VLiteral<string, "required"> | VUnion<string, Validator<any, "required", any>[], "required">;
/**
 * A definition of environment variables for the app.
 *
 * Maps environment variable names to string-like validators. Use
 * `v.string()` for a plain string, `v.literal("a")` for an enum value, or
 * `v.union(v.literal("a"), v.literal("b"))` for an enum. Wrap in
 * `v.optional(...)` for optional vars.
 *
 * @example
 * ```typescript
 * import { defineApp } from "convex/server";
 * import { v } from "convex/values";
 *
 * const app = defineApp({
 *   env: {
 *     OPENAI_API_KEY: v.string(),
 *     DEBUG_MODE: v.optional(v.string()),
 *   },
 * });
 * ```
 *
 * @public
 */
export type EnvDefinition = Record<string, StringLikeValidator | VOptional<StringLikeValidator>>;
/**
 * Compute the typed environment object from an {@link EnvDefinition}.
 *
 * Required entries get the validator's inferred string type; optional
 * entries are `T | undefined`.
 *
 * @public
 */
export type EnvFromDefinition<E extends EnvDefinition> = Expand<{
    [K in keyof E as E[K] extends Validator<any, "optional", any> ? never : K]: Infer<E[K]>;
} & {
    [K in keyof E as E[K] extends Validator<any, "optional", any> ? K : never]?: Infer<E[K]> | undefined;
}>;
/**
 * A reference to a parent-declared env var, produced by `app.env.<NAME>` or
 * `component.env.<NAME>`. Pass this in `use(child, { env: { ... } })` to
 * bind a child's declared env var to the parent's env var by reference
 * instead of snapshotting its current value.
 *
 * @public
 */
export type EnvRef<K extends string = string> = {
    __envVarRef: K;
};
/**
 * Compute the typed `env` namespace object from an {@link EnvDefinition}.
 * Each declared name maps to an {@link EnvRef} for that name.
 *
 * @public
 */
export type EnvRefFromDefinition<E extends EnvDefinition> = {
    [K in keyof E & string]: EnvRef<K>;
};
/**
 * Extract the typed environment from an {@link AppDefinition}.
 *
 * @public
 */
export type EnvFromAppDefinition<A> = A extends AppDefinition<infer E> ? EnvFromDefinition<E> : Record<string, never>;
/**
 * An object of this type should be the default export of a
 * convex.config.ts file in a component-aware convex directory.
 *
 * This is a feature of components, which are in beta.
 * This API is unstable and may change in subsequent releases.
 */
export type AppDefinition<Env extends EnvDefinition = EnvDefinition> = {
    /**
     * Install a component with the given definition in this component definition.
     *
     * Takes a component definition and an optional name.
     *
     * For editor tooling this method expects a {@link ComponentDefinition}
     * but at runtime the object that is imported will be a {@link ImportedComponentDefinition}
     */
    use<Definition extends ComponentDefinition<any, any>>(definition: Definition, ...args: UseArgs<Definition>): InstalledComponent<Definition>;
    /**
     * References to this app's declared env vars. Pass one of these in
     * `app.use(child, { env: { ... } })` to bind a child's env var by
     * reference to this app's env var.
     */
    env: EnvRefFromDefinition<Env>;
    /**
     * Internal type-only property tracking env definition.
     *
     * @deprecated This is a type-only property, don't use it.
     */
    __env: Env;
};
/**
 * Used to refer to an already-installed component.
 */
declare class InstalledComponent<Definition extends ComponentDefinition<any, any>> {
    constructor(definition: Definition, name: string);
    get exports(): ComponentDefinitionExports<Definition>;
}
/**
 * The runtime type of a ComponentDefinition. TypeScript will claim
 * the default export of a module like "cool-component/convex.config.js"
 * is a `@link ComponentDefinition}, but during component definition evaluation
 * this is its type instead.
 *
 * This is a feature of components, which are in beta.
 * This API is unstable and may change in subsequent releases.
 */
export type ImportedComponentDefinition = {
    componentDefinitionPath: string;
    defaultName: string;
};
/**
 * Define a component, a piece of a Convex deployment with namespaced resources.
 *
 * Optionally define typed environment variables that will be available via
 * the `env` export from `_generated/server` in all Convex functions within
 * this component. Values are passed by the parent via
 * `app.use(component, { env: { ... } })`.
 *
 * @param name Name must be alphanumeric plus underscores. Typically these are
 * lowercase with underscores like `"onboarding_flow_tracker"`.
 *
 * This is a feature of components, which are in beta.
 * This API is unstable and may change in subsequent releases.
 */
export declare function defineComponent<Exports extends ComponentExports = any, const Env extends EnvDefinition = {}>(name: string, options?: {
    env?: Env;
}): ComponentDefinition<Exports, Env>;
/**
 * Attach components, reuseable pieces of a Convex deployment, to this Convex app.
 *
 * Optionally define typed environment variables that will be available via
 * the `env` export from `_generated/server` in all Convex functions.
 *
 * @example
 * ```typescript
 * import { defineApp } from "convex/server";
 * import { v } from "convex/values";
 *
 * const app = defineApp({
 *   env: {
 *     OPENAI_API_KEY: v.string(),
 *     DEBUG_MODE: v.optional(v.string()),
 *   },
 * });
 * export default app;
 * ```
 *
 * This is a feature of components, which are in beta.
 * This API is unstable and may change in subsequent releases.
 */
export declare function defineApp<Env extends EnvDefinition = EnvDefinition>(options?: {
    httpPrefix?: string;
    env?: Env;
}): AppDefinition<Env>;
type AnyInterfaceType = {
    [key: string]: AnyInterfaceType;
} & AnyFunctionReference;
export type AnyComponentReference = Record<string, AnyInterfaceType>;
export type AnyChildComponents = Record<string, AnyComponentReference>;
export declare const componentsGeneric: () => AnyChildComponents;
export type AnyComponents = AnyChildComponents;
//# sourceMappingURL=index.d.ts.map