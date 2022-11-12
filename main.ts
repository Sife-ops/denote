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
    const paths = decoded.split("\n").slice(0, -1);
    if (paths.length < 1) break;

    paths.sort((a, b) => {
      // todo: this regex sucks
      const re = /(?<=\/)(((?!\/).)*)$/;
      const a_: string[] = a.match(re) || [];
      const b_: string[] = b.match(re) || [];
      if (a_.length < 1 || b_.length < 1) {
        throw new Error("Sort failed.");
      }
      return a_[0] > b_[0] ? 1 : -1;
    });

    const projectFile = await Deno.open(`${denoteHome}/${denoteProject}.md`, {
      read: true,
      write: true,
      append: true,
      create: true,
    });

    for (const path of paths) {
      try {
        const bytes = await Deno.readFile(path);
        await projectFile.write(bytes);
        await projectFile.write(new TextEncoder().encode("\n"));
      } catch {
        continue;
      }
      // todo: move to trash?
      await Deno.remove(path);
    }
    projectFile.close();

    break;
  }

  case "grep": {
    console.log("lol");
    break;
  }

  default: {
    console.error("Unrecognized command.");
    break;
  }
}
