import { z } from "./schema-deps.ts";

const optionSchema = {
  p: z.string().optional(),
};

export const commandSchema = z.discriminatedUnion("command", [
  z
    .object({
      command: z.literal("new"),
    })
    .extend(optionSchema),
  z
    .object({
      command: z.literal("compile"),
    })
    .extend(optionSchema),
  z
    .object({
      command: z.literal("search"),
      positionals: z.object({
        [1]: z.string(),
      }),
    })
    .extend(optionSchema),
]);
