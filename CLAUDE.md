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
guidance) is wired up in `.claude/settings.json`, blocking `git push`,
`git reset --hard`, `git clean -f[d]`, `git branch -D`, and
`git checkout .` / `git restore .`.
