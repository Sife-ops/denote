import { Context } from "../context.ts";
import { format } from "./new-deps.ts";

export const new_ = async (ctx: Context) => {
  const timestamp = format(new Date(), "yyyy-MM-ddTHH:mm:ss");
  await Deno.writeTextFile(
    `./${ctx.denoteProject}-${timestamp}.md`,
    `# ${timestamp}\n\n## New Note`
  );
};
