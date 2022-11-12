import { format, parse } from "./main-deps.ts";

const { HOME } = Deno.env.toObject();

const options = parse(Deno.args, {
  string: ["project", "p"],
});
const command = options._[0];

const denoteHome = `${HOME}/.denote`;
const denoteProject = options.project || options.p || "denote";

switch (command) {
  case "new": {
    const timestamp = format(new Date(), "yyyy-MM-ddTHH:mm:ss");
    await Deno.writeTextFile(
      `./${denoteProject}-${timestamp}.md`,
      `# ${timestamp}\n\n## New Note`
    );
    break;
  }

  case "compile": {
    const process = Deno.run({
      cmd: `find . -name ${denoteProject}-* -type f`.split(" "),
      //   cmd: ["find", ".", "-name", "denote-*", "-type", "f"],
      stdout: "piped",
    });

    const decoded = new TextDecoder().decode(await process.output());
    const fileNames = decoded.split("\n").slice(0, -1);
    // todo: check empty?

    const projectFile = await Deno.open(`${denoteHome}/${denoteProject}.md`, {
      read: true,
      write: true,
      append: true,
      create: true,
    });

    // todo: sort files by timestamp
    for (const fileName of fileNames) {
      try {
        const bytes = await Deno.readFile(fileName);
        await projectFile.write(bytes);
        await projectFile.write(new TextEncoder().encode("\n"));
      } catch {
        continue;
      }
      // todo: move to trash?
      await Deno.remove(fileName);
    }
    projectFile.close();

    break;
  }

  default:
    console.error("Unrecognized command.");
    break;
}
