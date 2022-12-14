import { Arguments } from "../main-deps.ts";

const { HOME, EDITOR } = Deno.env.toObject();

// todo: rename to ctx
interface Defaults {
  denoteHome: string;
  defaultProjectName: string;
  excludeDirs: string[];
  editor: string;
}

// todo: merge with config file
export const defaults: Defaults = {
  denoteHome: `${HOME}/.denote`,
  defaultProjectName: "denote",
  excludeDirs: ["*/node_modules/*"],
  editor: EDITOR,
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

export const prependFile = async (path: string, argv: Arguments) => {
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
};
