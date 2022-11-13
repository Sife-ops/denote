import { Context } from "../context.ts";

export const compile = async (ctx: Context) => {
  // todo: ignore large folders (eg. node_modules)
  const process = Deno.run({
    cmd: `find . -name ${ctx.denoteProject}-* -type f`.split(" "),
    //   cmd: ["find", ".", "-name", "denote-*", "-type", "f"],
    stdout: "piped",
  });

  const decoded = new TextDecoder().decode(await process.output());
  const paths = decoded.split("\n").slice(0, -1);
  if (paths.length < 1) {
    console.log("Didn't find any notes.");
    return;
  }

  paths.sort((a, b) => {
    const re = /^.*[\\\/]/;
    const basenameA = a.replace(re, "");
    const basenameB = b.replace(re, "");
    return basenameA > basenameB ? 1 : -1;
  });

  const projectFile = await Deno.open(
    `${ctx.denoteHome}/${ctx.denoteProject}.md`,
    {
      read: true,
      write: true,
      append: true,
      create: true,
    }
  );

  for (const path of paths) {
    try {
      const bytes = await Deno.readFile(path);
      // todo: append to head
      await projectFile.write(bytes);
      await projectFile.write(new TextEncoder().encode("\n"));
    } catch {
      continue;
    }
    // todo: move to trash?
    await Deno.remove(path);
  }
  projectFile.close();
};
