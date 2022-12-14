import { Arguments } from "../main-deps.ts";
import { wrapCommand, defaults } from "./common.ts";

export const save = wrapCommand({
  command: "save",
  description: "save files",
  builder: (yargs) => {
    return yargs;
  },
  handler: async (argv: Arguments) => {
    const exclusions = defaults.excludeDirs.reduce<string>((a, c) => {
      return a + ` -not -path ${c}`;
    }, "");

    // console.log(`find . ${exclusions} -name ${argv.project}-* -type f`);
    // return;

    const process = Deno.run({
      cmd: `find . ${exclusions} -name ${argv.project}-* -type f`.split(" "),
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

    for (const path of paths) {
      const file = await Deno.open(path, {
        read: true,
        write: true,
        append: true,
        create: true,
      });
      try {
        const bytes = await Deno.readFile(`${argv.home}/${argv.project}.md`);
        await file.write(new TextEncoder().encode("\n\n\n"));
        await file.write(bytes);
        file.close();
        await Deno.remove(`${argv.home}/${argv.project}.md`);
      } catch {
        file.close();
        console.log(`Creating ${argv.project} project.`);
      }

      const projectFile = await Deno.open(`${argv.home}/${argv.project}.md`, {
        write: true,
        createNew: true,
      });

      const bytes = await Deno.readFile(path);
      await projectFile.write(bytes);
      projectFile.close();

      await Deno.remove(path);
    }
  },
});
