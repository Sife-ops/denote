// https://github.com/yargs/yargs/blob/main/docs/typescript.md

import { wrapCommand, defaults } from "./command/common.ts";
import { save } from "./command/save.ts";
import { Arguments, yargs } from "./main-deps.ts";

yargs(Deno.args)
  .command(
    ...wrapCommand({
      command: "$0 [project]",
      description: "new note",
      builder: (yargs) => {
        return yargs;
      },
      handler: (argv) => {
        console.info(argv);
      },
    })
  )
  .command(
    ...wrapCommand({
      command: "file [project]",
      description: "new file",
      builder: (yargs) => {
        return yargs;
      },
      handler: (argv: Arguments) => {
        console.info(argv);
      },
    })
  )
  .command(...save)
  .positional("project", {
    describe: "project name",
    type: "string",
    default: defaults.defaultProjectName,
  })
  .option("home", {
    alias: "H",
    type: "string",
    description: "denote home",
    default: defaults.denoteHome,
  })
  .strictCommands()
  .demandCommand(1)
  .parse();
