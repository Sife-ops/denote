import { Arguments } from "../main-deps.ts";

const { HOME, EDITOR } = Deno.env.toObject();

// todo: prefix
interface Context {
  denoteHome: string;
  defaultProjectName: string;
  excludeDirs: string[];
  editor: string;
}

// todo: merge with config file
export const context: Context = {
  defaultProjectName: "denote",
  denoteHome: `${HOME}/.denote`,
  editor: EDITOR,
  excludeDirs: ["*/node_modules/*"],
};

export const wrapCommand = (
  cb: (context: Context) => {
    command: string;
    description: string;
    builder: (yargs: any) => any;
    handler: (argv: Arguments) => void;
  }
) => {
  const result = cb(context);
  // @ts-ignore: todo
  return Object.keys(result).map((key) => result[key]);
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
