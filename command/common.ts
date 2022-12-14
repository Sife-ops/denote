import { Arguments } from "../main-deps.ts";

const { HOME } = Deno.env.toObject();

interface Defaults {
  denoteHome: string;
  defaultProjectName: string;
  excludeDirs: string[];
}

// todo: merge with config file
export const defaults: Defaults = {
  denoteHome: `${HOME}/.denote`,
  defaultProjectName: "denote",
  excludeDirs: ["*/node_modules/*"],
};

export const wrapCommand = (
  cb: (defaults: Defaults) => {
    command: string;
    description: string;
    builder: (yargs: any) => any;
    handler: (argv: Arguments) => void;
  }
) => {
  const result = cb(defaults);
  return [result.command, result.description, result.builder, result.handler];
};
