import { Arguments } from "../main-deps.ts";

const { HOME } = Deno.env.toObject();

export const defaults = {
  denoteHome: `${HOME}/.denote`,
  defaultProjectName: "denote",
  excludeDirs: ["*/node_modules/*"],
};

export const wrapCommand = (o: {
  command: string;
  description: string;
  builder: (yargs: any) => any;
  handler: (argv: Arguments) => void;
}) => {
  return [o.command, o.description, o.builder, o.handler];
};
