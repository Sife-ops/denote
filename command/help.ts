export const help = () => {
  console.log(helpSring);
};

const helpSring = `Usage: denote <command> [options]

command             description
-------------------------------------------------------------------------------
new                 Create a new note
compile             Compile notes
search <pattern>    Search notes
show                Show notes
open                Open notes in editor

option              type                    description         default
--------------------------------------------------------------------------------
-p, --project       string                  Project name        denote
--denoteHome        string                  Denote home         \${HOME}/.denote
--compileMode       append OR prepend       Compile mode        prepend
`;
