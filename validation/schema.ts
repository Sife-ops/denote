import { help } from "../command/help.ts";
import { z } from "./schema-deps.ts";

const optionSchema = {
  compileMode: z.union([z.literal("append"), z.literal("prepend")]).optional(),
  denoteHome: z.string().optional(),
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
      command: z.literal("show"),
    })
    .extend(optionSchema),
  z
    .object({
      command: z.literal("open"),
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

export const parseCommandSchema = (schema: unknown) => {
  try {
    return commandSchema.parse(schema);
  } catch (e_) {
    // const e = e_ as ZodError;
    // console.log(e.issues)
    help();
    Deno.exit();
  }
};
