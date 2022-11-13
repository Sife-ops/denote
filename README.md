# Denote

Take notes and compile them to a centralized location later.

## Usage

Install:
```bash
deno install --allow-all main.ts
```

New note:
```bash
denote new
denote new | xargs nvim             # open in editor
denote new -p foo | xargs -o vim    # open in potato editor (eg. nano)
```

Compile notes:
```bash
denote compile
```

## Commands
```
command             description
--------------------------------------------------------------------------------
new                 Create a new note
compile             Compile notes
search <pattern>    Search notes
show                Show notes
open                Open notes in editor
```

## Options
```
option              type                    description         default
-------------------------------------------------------------------------------
-p, --project       string                  Project name        denote
--denoteHome        string                  Denote home         ${HOME}/.denote
--compileMode       append OR prepend       Compile mode        prepend
```
