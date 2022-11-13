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
```

Compile notes:
```bash
denote compile
```

Options:
```
option              type                    description         default
-------------------------------------------------------------------------------
-p, --project       string                  Project name        denote
--denoteHome        string                  Denote home         ${HOME}/.denote
--compileMode       append OR prepend       Compile mode        prepend
```
