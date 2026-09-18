# Deployed App Shell (F-01) Implementation Plan

## Overview

Scaffold the application into `app/`, establish the quality gates every later
slice is verified through, and publish a build to a public URL served over a
secure connection. No product behaviour ships in this change.

## Current State Analysis

The repository holds documentation and workflow tooling only — `CLAUDE.md`,
`LICENSE`, `README.md`, `.gitignore`, `context/`, and `.claude/`. There is no
application code, no package manifest, no test runner, no pipeline.

Two features of the current tree constrain how the scaffold lands:

- `.claude/10x-workflow-3` is a **git submodule** and `.claude/skills` is a
  **symlink** into it. A generator run at the repository root that offers to
  clear existing files would take both out.
- `.gitignore` already exists and is substantial. A generator would overwrite it.

`context/foundation/tech-stack.md` fixes the targets: Vite + React + TypeScript,
npm, Cloudflare Pages, GitHub Actions, publish on merge.

## Desired End State

`app/` contains a Vite + React + TypeScript application that builds to a static
bundle. `npm run lint`, `npm run typecheck`, `npm run test` and `npm run build`
all pass from `app/`. Every pull request runs those four commands in GitHub
Actions. Merging to the default branch causes Cloudflare Pages to build and
publish, and the result loads on a phone over `https://`.

Verify by opening the published URL on a handheld device and confirming the page
renders and the connection is secure.

### Key Discoveries:

- Submodule at `.claude/10x-workflow-3` and symlink at `.claude/skills` — root-level
  scaffolding is unsafe; `app/` avoids the question entirely.
- `.gitignore` at the repository root already covers Node artefacts; the scaffold's
  own ignore file belongs at `app/.gitignore` rather than replacing it.
- Cloudflare's Git integration builds independently of GitHub Actions. This is the
  load-bearing consequence of the chosen deploy path — see **Critical Implementation
  Details**.

## What We're NOT Doing

- No audio, no clock, no visual element, no session — all of that is S-01.
- No preview or branch deployments; the production branch is the only thing published.
- No deployment from GitHub Actions, and therefore no Cloudflare API token in
  repository secrets.
- No installability or offline behaviour. FR-007 is S-04's; this change only
  establishes the secure origin those features later require.
- No component library, router, or state management. Nothing has routes yet.
- No error reporting. That is F-02.

## Implementation Approach

Scaffold with the generator into a temporary location, move the result to `app/`,
then layer the quality gates on top. Wire CI as a check on pull requests, and
connect Cloudflare Pages to the repository with its root directory set to `app/`.

The deploy path the project chose — Cloudflare's own Git integration — means
Cloudflare builds from the repository on its own, without consulting GitHub
Actions. CI therefore cannot block a bad deploy directly. Branch protection
closes that gap: if the default branch can only receive commits through a pull
request whose checks passed, then everything Cloudflare sees has already been
vetted. That protection is a manual step in the repository settings and is listed
as manual verification below.

## Critical Implementation Details

**Cloudflare clones with submodules.** The repository carries a submodule at
`.claude/10x-workflow-3`. Cloudflare Pages initialises submodules during its
clone, and a submodule it cannot fetch fails the build before the build command
runs — even though nothing in `app/` references it. The submodule is a public
repository, so this should succeed; if the first deploy fails during clone rather
than during build, this is the cause, and the fix is to make the submodule
reachable rather than to change anything in `app/`.

**Root directory, not build command.** With the app in a subdirectory, Cloudflare's
project needs its *root directory* set to `app`. Setting only the build command to
something like `cd app && npm run build` leaves the output directory resolving
against the repository root and the deploy publishes nothing.

## Phase 1: Scaffold `app/` with quality gates

### Overview

A building, linting, type-checking, testable application in `app/`, with none of
the existing repository files disturbed.

### Changes Required:

#### 1. Generated application

**File**: `app/` (new directory)

**Intent**: Create the Vite + React + TypeScript application. Run the generator
into a temporary directory outside the repository, then move the generated tree to
`app/`. This keeps the generator from ever prompting about the repository root,
where the submodule and symlink live.

**Contract**: `app/` contains `package.json`, `index.html`, `src/`, `tsconfig*.json`
and `vite.config.ts`. The generator's own `.gitignore` stays at `app/.gitignore`;
the repository-root `.gitignore` is not modified.

#### 2. Strict type configuration

**File**: `app/tsconfig.json`

**Intent**: Turn on strict type checking now, while there is no code to fix. The
alignment work in S-01 carries numeric state across an audio callback and a render
loop, which is exactly where implicit `any` costs the most.

**Contract**: `strict` enabled, plus `noUncheckedIndexedAccess`. `npm run typecheck`
maps to `tsc --noEmit`.

#### 3. Lint and format

**File**: `app/eslint.config.js`, `app/.prettierrc`

**Intent**: Wire the linter the generator ships with, add a formatter, and make the
two agree so formatting is never a lint failure.

**Contract**: `npm run lint` fails on error-level findings; `npm run format:check`
verifies formatting without writing.

#### 4. Test runner and a real assertion

**File**: `app/vitest.config.ts`, `app/src/<module>.test.ts`

**Intent**: Install the test runner and prove it runs in CI. The test must assert
something true about the application rather than `expect(true).toBe(true)` — a
placeholder test passes even when the runner is misconfigured, which defeats the
purpose of having it in the gate.

**Contract**: `npm run test` runs the suite once and exits non-zero on failure
(watch mode is a separate script). At least one test imports application code and
asserts on its output.

#### 5. Scripts

**File**: `app/package.json`

**Intent**: Name the four gate commands so CI, the plan's success criteria, and a
contributor all invoke the same things.

**Contract**: `dev`, `build`, `preview`, `lint`, `format:check`, `typecheck`, `test`.

### Success Criteria:

#### Automated Verification:

- Dependencies install cleanly: `npm ci` in `app/`
- Type checking passes: `npm run typecheck`
- Linting passes: `npm run lint`
- Formatting is clean: `npm run format:check`
- Tests pass: `npm run test`
- Production build succeeds: `npm run build`
- The submodule and symlink are intact: `git submodule status` reports the pack, and `.claude/skills` still resolves
- No unintended root-level changes: `git status` shows no modification to the root `.gitignore`, `CLAUDE.md`, `LICENSE`, or `README.md`

#### Manual Verification:

- `npm run dev` serves the page and hot reload works on an edit
- The built output in `app/dist` loads when served locally

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 2: Continuous integration and a published URL

### Overview

Every pull request runs the gates; merging to the default branch publishes a build
to a secure public URL.

### Changes Required:

#### 1. CI workflow

**File**: `.github/workflows/ci.yml`

**Intent**: Run the four gate commands on pull requests and on pushes to the
default branch, so a red check is visible before a merge rather than after.

**Contract**: Triggers on `pull_request` and on `push` to the default branch. A
single job with a working directory of `app`, running install, typecheck, lint,
format check, test, build. Node version pinned to match local development.

#### 2. Cloudflare Pages project

**File**: no repository file — configured in the Cloudflare dashboard

**Intent**: Connect the repository so the default branch builds and publishes on
merge, and disable preview builds so nothing but production is ever public.

**Contract**: Root directory `app`; build command `npm run build`; output directory
`dist`; production branch set to the repository's default branch; preview
deployments disabled for all other branches.

#### 3. Branch protection

**File**: no repository file — configured in the GitHub repository settings

**Intent**: Make the CI check a merge requirement. Because Cloudflare builds
independently of Actions, this is the only thing standing between a failing test
and a published build.

**Contract**: The default branch requires a pull request, and requires the CI
workflow's check to pass before merging.

### Success Criteria:

#### Automated Verification:

- The workflow file is valid and the job runs to completion on a pull request
- All four gate commands report success in the CI log
- A deliberately failing test causes the CI check to fail, and removing it restores green

#### Manual Verification:

- Merging to the default branch triggers a Cloudflare build that completes
- The published URL loads over `https://` with a valid certificate
- The page renders correctly on a phone, not only in a desktop browser
- Pushing a branch does NOT create a preview deployment
- A pull request with a failing check cannot be merged

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 3: Document the shape

### Overview

Record the layout, the commands, and the deploy path so the next session — human or
agent — does not rediscover them.

### Changes Required:

#### 1. Project instructions

**File**: `CLAUDE.md`

**Intent**: Replace the "no application code, framework, or language has been
chosen yet" statement with the real layout and commands, and record that the app
lives in `app/` rather than at the root, with the reason.

**Contract**: A section naming the stack, the `app/` working directory, the four
gate commands, and the deploy path including the fact that Cloudflare builds
independently of CI and that branch protection is what gates it.

#### 2. Readme

**File**: `README.md`

**Intent**: Give a first-time reader the one-paragraph what-and-how: what the
product is, how to run it locally, where it deploys.

**Contract**: Product summary, prerequisites, local development commands, link to
`context/foundation/prd.md` for the full picture.

### Success Criteria:

#### Automated Verification:

- `CLAUDE.md` no longer claims the project is scaffolding-only: `grep -c "no application code" CLAUDE.md` returns 0
- Every command named in `CLAUDE.md` exists in `app/package.json`

#### Manual Verification:

- A reader following `README.md` from a fresh clone reaches a running dev server without extra steps

---

## Testing Strategy

### Unit Tests:

- One test that imports application code and asserts on its behaviour, proving the
  runner is wired to the source rather than passing in isolation.

### Integration Tests:

- None in this change. There is no behaviour to integrate yet; CI running the full
  gate set against a real install is the integration surface for now.

### Manual Testing Steps:

1. Run `npm run dev` from `app/` and confirm the page serves and hot-reloads.
2. Open a pull request and confirm the CI check appears and passes.
3. Add a failing assertion, push, confirm the check fails and the merge is blocked.
4. Remove it, merge, and confirm Cloudflare builds.
5. Open the published URL on a phone and confirm it loads over a secure connection.
6. Push an unrelated branch and confirm no preview deployment appears.

## Performance Considerations

None meaningful at this stage — the shell renders effectively nothing. The frame
rate and audio continuity floors in the PRD are measured against S-01 and S-05.
What this phase owes those slices is a deployed URL reachable from a real device,
since neither floor can be observed on a desktop browser.

## Migration Notes

Not applicable. Nothing exists to migrate.

## References

- Roadmap item: `context/foundation/roadmap.md` § F-01
- Stack decision: `context/foundation/tech-stack.md`
- Product requirements: `context/foundation/prd.md`

## Progress

> Convention: `- [ ]` pending, `- [x]` done. Append ` — <commit sha>` when a step lands. Do not rename step titles.

### Phase 1: Scaffold `app/` with quality gates

#### Automated

- [ ] 1.1 Dependencies install cleanly (`npm ci` in `app/`)
- [ ] 1.2 Type checking passes (`npm run typecheck`)
- [ ] 1.3 Linting passes (`npm run lint`)
- [ ] 1.4 Formatting is clean (`npm run format:check`)
- [ ] 1.5 Tests pass (`npm run test`)
- [ ] 1.6 Production build succeeds (`npm run build`)
- [ ] 1.7 Submodule and symlink intact
- [ ] 1.8 No unintended root-level changes

#### Manual

- [ ] 1.9 `npm run dev` serves the page and hot reload works
- [ ] 1.10 Built output loads when served locally

### Phase 2: Continuous integration and a published URL

#### Automated

- [ ] 2.1 Workflow is valid and runs to completion on a pull request
- [ ] 2.2 All four gate commands report success in CI
- [ ] 2.3 A deliberately failing test fails the check; removing it restores green

#### Manual

- [ ] 2.4 Merging triggers a Cloudflare build that completes
- [ ] 2.5 Published URL loads over `https://` with a valid certificate
- [ ] 2.6 Page renders correctly on a phone
- [ ] 2.7 Pushing a branch creates no preview deployment
- [ ] 2.8 A pull request with a failing check cannot be merged

### Phase 3: Document the shape

#### Automated

- [ ] 3.1 `CLAUDE.md` no longer claims the project is scaffolding-only
- [ ] 3.2 Every command named in `CLAUDE.md` exists in `app/package.json`

#### Manual

- [ ] 3.3 A reader following `README.md` from a fresh clone reaches a running dev server
