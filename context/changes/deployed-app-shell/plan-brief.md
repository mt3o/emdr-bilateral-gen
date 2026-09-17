# Deployed App Shell (F-01) — Plan Brief

> Full plan: `context/changes/deployed-app-shell/plan.md`

## What & Why

Scaffold the application, establish the quality gates every later slice is verified
through, and get a build onto a public URL served over a secure connection. No
product behaviour ships here. It exists because S-01's acceptance criteria — frame
rate and audio/visual divergence — are measured on a handheld device, and a device
cannot reach the app until this lands.

## Starting Point

The repository holds documentation and workflow tooling only: no application code,
no package manifest, no test runner, no pipeline. Two details shape the approach —
`.claude/` contains a git submodule and a symlink into it, and the root `.gitignore`
is already substantial. Both are things a generator run at the repository root
could damage.

## Desired End State

`app/` holds a Vite + React + TypeScript application. Four commands — typecheck,
lint, test, build — pass locally and run on every pull request. Merging to the
default branch publishes to Cloudflare Pages, and the result loads on a phone over
`https://`.

## Key Decisions Made

| Decision            | Choice                          | Why (1 sentence)                                                                     | Source |
| ------------------- | ------------------------------- | ------------------------------------------------------------------------------------ | ------ |
| App location        | `app/` subdirectory             | Keeps the generator away from the submodule and symlink at the repository root.       | Plan   |
| Deploy mechanism    | Cloudflare's Git integration    | No API token to store and no secrets to manage; Cloudflare builds from the repo itself. | Plan   |
| Gating the deploy   | Branch protection on the default branch | Cloudflare builds independently of CI, so requiring a passing check before merge is what keeps a broken build from publishing. | Plan |
| Quality tooling     | Full gates now                  | S-01 needs a test runner anyway, and retrofitting it into the slice carrying the alignment work is the worst time to do it. | Plan |
| Preview deployments | Off — production only           | Nothing is public except what was deliberately merged.                                 | Plan   |
| Stack               | Vite + React + TypeScript, npm, Cloudflare Pages | One screen, no routes, no server — the framework's whole job is a fast dev loop and a static bundle. | Tech-stack |

## Scope

**In scope:** application scaffold in `app/`; strict TypeScript; lint and format;
test runner with one real assertion; CI on pull requests; Cloudflare Pages project;
branch protection; updated `CLAUDE.md` and `README.md`.

**Out of scope:** audio, clock, visuals, sessions (S-01); offline and installability
(S-04); error reporting (F-02); preview deployments; deploying from CI; any router,
component library, or state management.

## Architecture / Approach

Generate into a temporary directory, move the result to `app/`, then layer the gates
on top. GitHub Actions runs the gates on pull requests. Cloudflare Pages connects to
the repository directly with its root directory set to `app`, building the default
branch only. Because those two pipelines are independent, branch protection is what
ensures Cloudflare only ever sees commits that already passed.

## Phases at a Glance

| Phase                          | What it delivers                                  | Key risk                                                                       |
| ------------------------------ | ------------------------------------------------- | ------------------------------------------------------------------------------ |
| 1. Scaffold with gates         | Building, linting, typechecked, tested app in `app/` | Generator damaging the submodule or symlink if run at the root.                 |
| 2. CI and a published URL      | Checks on every PR; a live, secure URL             | Cloudflare's clone initialises submodules — a fetch failure breaks the build before the build command runs. |
| 3. Document the shape          | `CLAUDE.md` and `README.md` reflect reality        | Low; the risk is skipping it and paying later.                                 |

**Prerequisites:** a Cloudflare account with access to create a Pages project, and
admin rights on the GitHub repository to set branch protection.

**Estimated effort:** one short session for phase 1, one for phases 2–3, with the
dashboard configuration in phase 2 being the only part that cannot be scripted.

## Open Risks & Assumptions

- Cloudflare Pages initialises git submodules during its clone. The pack submodule is
  public so this should be fine, but a first deploy that fails during clone rather
  than during build points here, not at `app/`.
- Cloudflare's root-directory setting must be `app`; setting only the build command
  leaves the output directory resolving against the repository root and publishes
  nothing.
- CI cannot block a Cloudflare deploy directly. Branch protection is the mitigation,
  and it is a manual settings change rather than a file in the repository — so it
  can silently not happen.

## Success Criteria (Summary)

- Four gate commands pass locally and in CI, and a deliberately broken test is
  proven to fail the check.
- Merging publishes, and the published URL loads on a phone over a secure connection.
- Pushing a branch publishes nothing.
