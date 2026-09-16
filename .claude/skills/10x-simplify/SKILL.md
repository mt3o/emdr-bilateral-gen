---
name: 10x-simplify
description: Review changed code for reuse, simplification, and efficiency, then apply the fixes. Quality only — it does not hunt for bugs; use 10x-code-review for that. Use when the user asks to simplify, clean up, or tighten a diff.
---

# Simplify

Review the current diff for **quality**, not correctness, then apply the
fixes directly. Pair with `10x-code-review` for bug-hunting — this skill
skips that entirely.

## What to look for

- **Reuse**: new code that duplicates an existing helper, type, or pattern
  already in the codebase.
- **Simplification**: unnecessary abstraction, indirection, or
  configurability for a case that only has one caller; premature
  generalization; dead branches.
- **Efficiency**: avoidable extra passes over data, redundant computation
  or allocation, obvious algorithmic downgrades — but only where it's
  cheap to fix without changing behavior.
- **Altitude**: code that doesn't match the surrounding file's level of
  abstraction (too low-level in a high-level module, or vice versa).

## Process

1. Read the diff and the files it touches.
2. For each candidate finding, confirm it's a real improvement with no
   behavior change — check callers before renaming/removing anything.
3. Apply the fix directly (this is a cleanup pass, not a report).
4. Re-read the result: don't introduce a new abstraction to replace one
   form of complexity with another.

## Guardrails

- Don't add features, tests, or error handling while simplifying — stay
  scoped to what's already there.
- Don't touch unrelated code outside the diff just because it could also
  be improved.
- If a "simplification" would change observable behavior, it's not a
  simplification — skip it or flag it instead of applying it.
