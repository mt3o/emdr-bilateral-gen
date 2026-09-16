---
name: 10x-code-review
description: Review the current diff, or a PR number/branch/path target, for correctness bugs. Use when the user asks for a code review, wants bugs caught before merge, or mentions "review this diff" or "review this PR".
---

# Code Review

Review changed code for **correctness bugs** — the kind that produce a
wrong output, a crash, or lost data under some real input or state. Do not
flag style, missing tests, or subjective taste.

## Scope

- Default target: `git diff` against the merge-base of the current branch
  and its default branch (fall back to `git diff HEAD` if there's no base).
- If given a PR number, branch, or path, review that instead.
- Only review changed lines and code they call into; don't audit the whole
  file.

## Process

1. Read every changed hunk plus enough surrounding context (callers,
   callees, type definitions) to know what "correct" means here.
2. For each hunk, ask: what input, state, or ordering would make this do
   the wrong thing? Concurrency, off-by-one, null/empty/zero cases,
   error-path handling, and mismatched units/types are the highest-yield
   categories.
3. Discard anything you can't state as a concrete failure scenario
   (specific inputs/state → specific wrong output/crash). A vague "this
   could be an issue" is not a finding.
4. Rank surviving findings most-severe first.

## Output

For each finding: file:line, a one-sentence summary of the defect, and the
concrete failure scenario. If nothing survives step 3, say so plainly —
an empty result is a valid outcome, not a failure to find something.
