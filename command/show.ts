import { Context } from "../context.ts";

export const show = async (ctx: Context) => {
  const process = Deno.run({
    cmd: ["less", `${ctx.denoteHome}/${ctx.denoteProject}.md`],
  });
  await process.status();
};
