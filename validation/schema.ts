import { ZodError } from "https://deno.land/x/zod@v3.14.4/ZodError.ts";
import { help } from "../command/help.ts";
import { z } from "./schema-deps.ts";

const optionSchema = {
  p: z.string().optional(),
  project: z.string().optional(),
};

export const commandSchema = z.discriminatedUnion("command", [
  z
    .object({
      command: z.literal("help"),
    })
    .extend(optionSchema),
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
      positionals: z
        .object({
          [1]: z.string(),
        })
        .describe("hello"),
    })
    .extend(optionSchema),
]);

export const parseCommandSchema = (schema: unknown) => {
  try {
    return commandSchema.parse(schema);
  } catch {
    help();
    throw new Error("Command validation failure.");
  }
};
