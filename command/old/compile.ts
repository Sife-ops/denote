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

  paths.sort((a: string, b: string) => {
    const re = /^.*[\\\/]/;
    const basenameA = a.replace(re, "");
    const basenameB = b.replace(re, "");
    return basenameA > basenameB ? 1 : -1;
  });

  const openOptions: Deno.OpenOptions = {
    read: true,
    write: true,
    append: true,
    create: true,
  };

  switch (ctx.compileMode) {
    case "append": {
      const projectFile = await Deno.open(
        `${ctx.denoteHome}/${ctx.denoteProject}.md`,
        openOptions
      );

      for (const path of paths) {
        try {
          const bytes = await Deno.readFile(path);
          await projectFile.write(bytes);
          await projectFile.write(new TextEncoder().encode("\n"));
        } catch {
          continue;
        }
        // todo: move to trash?
        await Deno.remove(path);
      }
      projectFile.close();

      break;
    }

    case "prepend": {
      for (const path of paths) {
        const file = await Deno.open(path, openOptions);
        try {
          const bytes = await Deno.readFile(
            `${ctx.denoteHome}/${ctx.denoteProject}.md`
          );
          await file.write(new TextEncoder().encode("\n\n\n"));
          await file.write(bytes);
          file.close();
          await Deno.remove(`${ctx.denoteHome}/${ctx.denoteProject}.md`);
        } catch {
          file.close();
          console.log(`Creating ${ctx.denoteProject} project.`);
        }

        const projectFile = await Deno.open(
          `${ctx.denoteHome}/${ctx.denoteProject}.md`,
          { write: true, createNew: true }
        );

        const bytes = await Deno.readFile(path);
        await projectFile.write(bytes);
        projectFile.close();

        await Deno.remove(path);
      }

      break;
    }

    default:
      break;
  }
};
