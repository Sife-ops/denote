import { Context } from "./context.ts";
import { parse } from "./main-deps.ts";
import { parseCommandSchema } from "./validation/schema.ts";

import { compile } from "./command/compile.ts";
import { help } from "./command/help.ts";
import { new_ } from "./command/new.ts";
import { open } from "./command/open.ts";
import { search } from "./command/search.ts";
import { show } from "./command/show.ts";

const { HOME } = Deno.env.toObject();

let args = parse(Deno.args, {
  string: ["project", "p"],
});

let positionals = {};
args._.forEach((v, i) => {
  positionals = {
    ...positionals,
    [i]: v,
  };
});

args = {
  ...args,
  positionals,
  command: args._[0],
};

const parsedCommandSchema = parseCommandSchema(args);

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

const ctx: Context = {
  denoteHome: parsedCommandSchema.denoteHome || `${HOME}/.denote`,
  denoteProject:
    parsedCommandSchema.p || parsedCommandSchema.project || "denote",
  compileMode: parsedCommandSchema.compileMode || "prepend",
};

switch (parsedCommandSchema.command) {
  case "new":
    new_(ctx);
    break;

  case "compile":
    compile(ctx);
    break;

  case "search": {
    search(ctx, parsedCommandSchema.positionals[1]);
    break;
  }

  case "show": {
    show(ctx);
    break;
  }

  case "open": {
    open(ctx);
    break;
  }

  case "help": {
    help();
    break;
  }

  default: {
    break;
  }
}
