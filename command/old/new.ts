import { Context } from "../context.ts";
import { format } from "./new-deps.ts";

export const new_ = async (ctx: Context) => {
  const timestamp = format(new Date(), "yyyy-MM-ddTHH:mm:ss");
  const filename = `./${ctx.denoteProject}-${timestamp}.md`;
  await Deno.writeTextFile(filename, `# ${timestamp}\n\n## New Note`);
  console.log(filename);
};
