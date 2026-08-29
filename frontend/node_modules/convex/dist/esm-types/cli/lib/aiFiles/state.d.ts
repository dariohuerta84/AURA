import { z } from "zod";
export declare const aiFilesStateSchema: z.ZodObject<{
    guidelinesHash: z.ZodNullable<z.ZodString>;
    agentsMdSectionHash: z.ZodNullable<z.ZodString>;
    claudeMdHash: z.ZodNullable<z.ZodString>;
    agentSkillsSha: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    guidelinesHash: string | null;
    agentSkillsSha: string | null;
    agentsMdSectionHash: string | null;
    claudeMdHash: string | null;
}, {
    guidelinesHash: string | null;
    agentSkillsSha: string | null;
    agentsMdSectionHash: string | null;
    claudeMdHash: string | null;
}>;
export type AiFilesState = z.infer<typeof aiFilesStateSchema>;
export type AttemptReadAiStateResult = {
    kind: "no-file";
} | {
    kind: "ok";
    state: AiFilesState;
} | {
    kind: "parse-error";
    error: unknown;
};
export declare function attemptReadAiState(convexDir: string): Promise<AttemptReadAiStateResult>;
export declare function readAiStateOrDefault(convexDir: string): Promise<AiFilesState>;
export declare function hasAiState(convexDir: string): Promise<boolean>;
export declare function writeAiState({ state, convexDir, }: {
    state: AiFilesState;
    convexDir: string;
}): Promise<void>;
//# sourceMappingURL=state.d.ts.map