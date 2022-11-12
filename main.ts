import { Context } from "./context.ts";
import { commandSchema } from "./validation/schema.ts";
import { compile } from "./command/compile.ts";
import { new_ } from "./command/new.ts";
import { parse } from "./main-deps.ts";
import { search } from "./command/search.ts";

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

const parsedCommandSchema = commandSchema.parse(args);

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

const ctx: Context = {
  denoteHome: `${HOME}/.denote`,
  denoteProject: parsedCommandSchema.p || "denote",
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

  //   case "show": {
  //     break;
  //   }

  //   case "open": {
  //     break;
  //   }

  default: {
    break;
  }
}
