import { z } from "zod";

// Zod Schemas
export const languageSchema = z.object({
  code: z.string(),
  name: z.string(),
});

export const modelInfoSchema = z.object({
  id: z.string(),
  languages: z.array(languageSchema),
  name: z.string(),
  transcription_mode: z.string(),
});

export type Language = z.infer<typeof languageSchema>;
export type ModelInfo = z.infer<typeof modelInfoSchema>;
