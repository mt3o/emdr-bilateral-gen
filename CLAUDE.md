# emdr-bilateral-gen

EMDR bilateral-stimulation generator. The repository is currently just
scaffolding — no application code, framework, or language has been chosen
yet. Update this file with real architecture/conventions once code lands.

## Workflow skills

Claude Code skills come from the `10x-workflow-3` pack
(https://github.com/mt3o/10x-workflow-3), vendored as a git submodule at
`.claude/10x-workflow-3`. `.claude/skills` is a symlink into
`.claude/10x-workflow-3/.claude/skills`, so the pack's skills (project
framing, planning, implementation, review, e2e, tech-stack selection,
etc. — all prefixed `10x-`) are picked up directly.

After cloning this repo, run `git submodule update --init` to fetch the
skills pack.

To update the pack: `cd .claude/10x-workflow-3 && git pull origin main`,
then commit the updated submodule pointer.

A `PreToolUse` hook (originally set up via the pack's git-guardrails
guidance) is wired up in `.claude/settings.json`, blocking force-pushes
(`push --force`, `push --force-with-lease`, `push -f`), `git reset --hard`,
`git clean -f[d]`, `git branch -D`, and `git checkout .` / `git restore .`.

Ordinary `git push` is allowed. It was blocked until 2026-09-17, which
deadlocked against the stop hook that requires branches to be pushed —
every turn ended with an unpushable commit. History-destroying pushes stay
blocked; only the blanket ban came off.

Patterns are substring-matched with `grep -qE` against the whole command,
so a command merely *containing* a blocked phrase is refused even when it
is not running it — editing this hook's own pattern list from Bash trips
it. Use the Edit tool for that.
