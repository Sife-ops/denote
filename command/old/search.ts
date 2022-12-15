import { Context } from "../context.ts";

export const search = async (ctx: Context, pattern: string) => {
  const process = Deno.run({
    // todo: can't glob whole dir
    // todo: option to use rg
    cmd: [
      "grep",
      "-C2",
      "-n",
      "-i",
      pattern,
      `${ctx.denoteHome}/${ctx.denoteProject}.md`,
    ],
    stdout: "piped",
  });
  const decoded = new TextDecoder().decode(await process.output());
  console.log(decoded);
};
