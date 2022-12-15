// https://github.com/yargs/yargs/blob/main/docs/typescript.md

import { yargs } from "./main-deps.ts";
import { default_ } from "./command/default.ts";
import { context } from "./command/common.ts";

yargs(Deno.args)
  .command(...default_)
  // .command(...file)
  // .command(...save)
  .positional("project", {
    describe: "project name",
    type: "string",
    default: context.defaultProjectName,
  })
  .option("home", {
    alias: "H",
    type: "string",
    description: "denote home",
    default: context.denoteHome,
  })
  .strictCommands()
  .demandCommand(1)
  .parse();
