import { Arguments } from "../main-deps.ts";
import { prependFile, wrapCommand } from "./common.ts";

export const save = wrapCommand((defaults) => ({
  command: "save",
  description: "save files",
  builder: (yargs) => {
    return yargs;
  },
  handler: async (argv: Arguments) => {
    const exclusions = defaults.excludeDirs.reduce<string>((a, c) => {
      return a + ` -not -path ${c}`;
    }, "");

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
      await prependFile(path, argv);
    }
  },
}));
