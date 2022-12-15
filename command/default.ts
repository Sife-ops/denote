import { format } from "../main-deps.ts";
import { wrapCommand, prependFile } from "./common.ts";

export const default_ = wrapCommand((ctx) => ({
  command: "$0 [project]",
  description: "new note",
  builder: (yargs) => {
    return yargs;
  },
  handler: async (argv) => {
    const process1 = Deno.run({
      cmd: ["mktemp"],
      stdout: "piped",
    });

    let path = new TextDecoder().decode(await process1.output());
    path = path.replace("\n", "");

    const timestamp = format(new Date(), "yyyy-MM-ddTHH:mm:ss");
    await Deno.writeTextFile(path, `# ${timestamp}\n\n`);

    const process2 = Deno.run({
      cmd: [ctx.editor, path],
      stdout: "inherit",
    });

    const stat = await process2.status();

    if (stat.success) {
      await prependFile(path, argv);
    }
  },
}));
