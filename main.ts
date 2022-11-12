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
    // todo: ignore large folders (eg. node_modules)
    const process = Deno.run({
      cmd: `find . -name ${denoteProject}-* -type f`.split(" "),
      //   cmd: ["find", ".", "-name", "denote-*", "-type", "f"],
      stdout: "piped",
    });

    const decoded = new TextDecoder().decode(await process.output());
    const paths = decoded.split("\n").slice(0, -1);
    if (paths.length < 1) break;

    paths.sort((a, b) => {
      const re = /^.*[\\\/]/;
      const basenameA = a.replace(re, "");
      const basenameB = b.replace(re, "");
      return basenameA > basenameB ? 1 : -1;
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
        // todo: append to head
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

  case "search": {
    const exp = options._[1];
    const process = Deno.run({
      // todo: can't glob whole dir
      // todo: option to use rg
      cmd: `grep -C2 -n ${exp} ${denoteHome}/${denoteProject}.md`.split(" "),
      stdout: "piped",
    });
    const decoded = new TextDecoder().decode(await process.output());
    console.log(decoded);
    break;
  }

  default: {
    console.error("Unrecognized command.");
    break;
  }
}
