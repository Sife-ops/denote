import { Context } from "../context.ts";

export const open = async (ctx: Context) => {
  const process = Deno.run({
    cmd: ["code", `${ctx.denoteHome}/${ctx.denoteProject}.md`],
  });
  await process.status();
};
