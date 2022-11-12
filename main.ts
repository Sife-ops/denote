import { format } from "./main-deps.ts";

console.log(format(new Date(), "yyyy-MM-ddTHH:mm:ss"));

await Deno.writeTextFile("./hello.txt", "Hello World!");
