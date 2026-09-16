# emdr-bilateral-gen

EMDR bilateral-stimulation generator. The repository is currently just
scaffolding — no application code, framework, or language has been chosen
yet. Update this file with real architecture/conventions once code lands.

## Workflow skills

This repo ships local Claude Code skills under `.claude/skills/`, all
prefixed `10x-`, to speed up AI-assisted development:

- `10x-tdd` — red/green/refactor, test-first workflow
- `10x-code-review` — review a diff/PR for correctness bugs
- `10x-simplify` — review a diff for reuse/simplification/efficiency
- `10x-git-guardrails` — sets up a hook blocking destructive git commands
- `10x-session-start-hook` — helps you add a SessionStart hook once a
  package manager/test runner exists, so Claude Code on the web can run
  tests and linters automatically

A `PreToolUse` hook from `10x-git-guardrails` is already wired up in
`.claude/settings.json`, blocking `git push`, `git reset --hard`,
`git clean -f[d]`, `git branch -D`, and `git checkout .` / `git restore .`.
