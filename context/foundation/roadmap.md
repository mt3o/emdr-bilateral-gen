---
project: bilateral-gen
version: 1
status: draft
created: 2026-09-17
updated: 2026-09-17
prd_version: 1
main_goal: learn
top_blocker: skills
---

# Roadmap: bilateral-gen

> Derived from `context/foundation/prd.md` (v1) + codebase baseline.
> Edit-in-place; archive when superseded.
> Slices below are listed in dependency order. The "At a glance" table is the index.

## Vision recap

Someone wanting bilateral — left↔right alternating — sound for focus or relaxation
today plays a fixed recording: the speed can't be changed, nothing on screen moves
with it, it needs a connection, and ads interrupt the state they were reaching for.

Generating the alternation from a live clock instead of baking it into a file makes
speed, depth and shape adjustable while a session runs, lets a visual be driven from
that same clock so sound and image stay locked, and lets the whole thing run offline.

## North star

**S-01: Listener runs a complete session, and alignment is measured across it** —
this is the one slice whose success proves the product's central claim, so it is
placed as early as its prerequisites allow.

> "North star" here means the smallest end-to-end slice whose successful delivery
> would prove the core product hypothesis. Everything else in this roadmap only
> matters if this works: a version that alternates sound but lets image and audio
> drift apart is not a lesser version of this product, it is a different and worse
> one.

## At a glance

| ID   | Change ID                            | Outcome (user can …)                                          | Prerequisites | PRD refs                                  | Status   |
| ---- | ------------------------------------ | ------------------------------------------------------------- | ------------- | ----------------------------------------- | -------- |
| F-01 | deployed-app-shell                   | (foundation) a runnable shell reachable over a secure connection | —             | FR-007, NFR (frame-rate floor)            | ready    |
| F-02 | diagnostics-destination              | (foundation) opted-in reports have somewhere to land            | F-01          | FR-013, FR-014                            | proposed |
| S-01 | complete-session-with-measured-alignment | run a full session start to finish, with alignment measured | F-01          | US-01, US-05, FR-001, FR-002, FR-003, FR-004, FR-006 | proposed |
| S-02 | live-alternation-control             | change speed, shape and per-layer depth while it runs           | S-01          | US-02, US-03, FR-005                      | proposed |
| S-03 | preset-library                       | start from a named preset and adjust it                         | S-02          | FR-010, FR-011, FR-012                    | proposed |
| S-04 | offline-and-persisted-settings       | run with no connection and find settings still there            | S-01          | US-04, FR-007, FR-008                     | proposed |
| S-05 | finished-visual-scene                | watch a designed scene rather than a bare indicator             | S-01          | FR-009                                    | proposed |
| S-06 | inspectable-diagnostics-consent      | see exactly what would be shared, and decide                    | F-02, S-03    | US-06, FR-013, FR-014, FR-015, FR-016, FR-017 | proposed |

## Streams

Navigation aid — groups items that share a Prerequisites chain. Canonical ordering still lives in the dependency graph below; this table is the proposed reading order across parallel tracks.

| Stream | Theme               | Chain                                              | Note                                                                                  |
| ------ | ------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------- |
| A      | Engine and control  | `F-01` → `S-01` → (`S-02` → `S-03`) / `S-04` / `S-05` | The core product. After S-01 lands, three branches open that don't block each other. |
| B      | Consent and reporting | `F-02` → `S-06`                                  | Runs independently of the engine; its final slice also waits on Stream A's preset work. |

## Baseline

What's already in place in the codebase as of `2026-09-17`.
Foundations below assume these are present and do NOT re-scaffold them.

- **Frontend:** absent — no application code exists; the repository holds documentation, licence and workflow tooling only.
- **Backend / API:** absent — and permanently so; a server the product depends on is a stated non-goal.
- **Data:** absent — no store of any kind; settings persistence is local and not yet built.
- **Auth:** absent — and permanently so; the product has no accounts at any point.
- **Deploy / infra:** absent — a target is declared in `tech-stack.md`, but nothing is wired.
- **Observability:** absent — the diagnostics destination named in the shape notes is not stood up.

## Foundations

### F-01: A runnable shell, reachable over a secure connection

- **Outcome:** (foundation) the project scaffolds, builds, publishes on merge, and is reachable on a real handheld device over a secure connection.
- **Change ID:** deployed-app-shell
- **PRD refs:** FR-007 (offline), NFR frame-rate floor (30 fps handheld / 60 fps desktop)
- **Unlocks:** S-01 — its acceptance criteria are frame rate and alignment *on a handheld device*, which cannot be observed until the app is reachable on one. A secure connection is not a preference here: the installability and screen-wake behaviour the product depends on are unavailable without it.
- **Prerequisites:** —
- **Parallel with:** —
- **Blockers:** —
- **Unknowns:** —
- **Risk:** Sequenced first because every later slice is verified on a device rather than a desktop browser. The risk of doing it first is small; the risk of deferring it is discovering late that the numbers only hold on a laptop. Kept deliberately minimal — a shell that builds, ships and loads, with no feature work.
- **Status:** ready

### F-02: Opted-in reports have somewhere to land

- **Outcome:** (foundation) a reachable destination accepts a report, and records nothing the consent levels never promised — client network address in particular.
- **Change ID:** diagnostics-destination
- **PRD refs:** FR-013, FR-014
- **Unlocks:** S-06 — a consent flow cannot be verified end to end without somewhere for an accepted report to arrive. Also reduces the implementation obligation recorded in the shape notes: the destination retains a network-level identifier by default, which no consent level in the PRD offers to send.
- **Prerequisites:** F-01
- **Parallel with:** S-01, S-02, S-03, S-04, S-05
- **Blockers:** —
- **Unknowns:**
  - Can the retention of client network address be switched off at the destination, or does it need stripping before a report leaves the device? — Owner: user. Block: no.
- **Risk:** Scoped to standing up and configuring a destination, not to building reporting. If the identifier question resolves badly the fix lands here rather than inside S-06, which is why it is separated.
- **Status:** proposed

## Slices

### S-01: Listener runs a complete session, and alignment is measured across it

- **Outcome:** user can start a session and have it fade in, alternate a source left↔right beneath an ambience layer with a visual element tracking the same alternation, then fade out and end on the timer — with sound and image measured as aligned throughout.
- **Change ID:** complete-session-with-measured-alignment
- **PRD refs:** US-01, US-05, FR-001, FR-002, FR-003, FR-004, FR-006
- **Prerequisites:** F-01
- **Parallel with:** F-02
- **Blockers:** —
- **Unknowns:**
  - How are the two positions sampled together to produce the divergence figure US-05 requires? — Owner: `/10x-plan`. Block: no.
- **Risk:** The largest slice, and deliberately so: fades, ambience and a tracking visual are not separable from "a session" without the result being something nobody would sit through. It carries the whole hypothesis, which is why the sequencing goal placed it first. The thing most likely to go wrong is the alignment guarantee itself — this is the unfamiliar work, and it is faced immediately rather than after a month of scaffolding. The visual here is functional, not designed; S-05 makes it a finished scene.
- **Status:** proposed

### S-02: Listener changes the alternation while it runs

- **Outcome:** user can change speed, shape and each layer's depth during a session and have the stimulation follow continuously, with no jump in sound or image.
- **Change ID:** live-alternation-control
- **PRD refs:** US-02, US-03, FR-005
- **Prerequisites:** S-01
- **Parallel with:** S-04, S-05, F-02
- **Blockers:** —
- **Unknowns:** —
- **Risk:** This is the capability a fixed recording fundamentally cannot offer, so it is the first slice that makes the product distinct rather than merely working. Sequenced immediately after S-01 because it stresses the same clock: if changing speed mid-session introduces a discontinuity, the alignment guarantee was weaker than S-01 suggested.
- **Status:** proposed

### S-03: Listener starts from a named preset and adjusts it

- **Outcome:** user can begin from one of four named presets instead of setting every parameter, change any of them, and read a plain-language descriptor of what the current speed feels like.
- **Change ID:** preset-library
- **PRD refs:** FR-010, FR-011, FR-012
- **Prerequisites:** S-02
- **Parallel with:** S-04, S-05, F-02
- **Blockers:** —
- **Unknowns:**
  - Are the four preset values right? — Owner: user, by running sessions. Block: no.
- **Risk:** Depends on S-02 because a preset is only meaningful once the parameters it sets are live and adjustable. The preset numbers are first guesses made without a dominant moment of use to tune against, so treat the values as provisional and the mechanism as the deliverable.
- **Status:** proposed

### S-04: Listener runs offline and finds their settings still there

- **Outcome:** user can complete a full session with no connection, and reopen the product later to find their previous settings in place.
- **Change ID:** offline-and-persisted-settings
- **PRD refs:** US-04, FR-007, FR-008
- **Prerequisites:** S-01
- **Parallel with:** S-02, S-03, S-05, F-02
- **Blockers:** —
- **Unknowns:** —
- **Risk:** Offline is the concrete difference from the status quo this product replaces, so it is not deferred to polish. Runs parallel to the control and preset work because it touches delivery and storage rather than the clock.
- **Status:** proposed

### S-05: Listener watches a finished scene rather than a bare indicator

- **Outcome:** user can watch a designed visual scene that tracks the alternation, rather than a functional placeholder.
- **Change ID:** finished-visual-scene
- **PRD refs:** FR-009
- **Prerequisites:** S-01
- **Parallel with:** S-02, S-03, S-04, F-02
- **Blockers:** —
- **Unknowns:**
  - Does a designed scene still hold the frame-rate floor on a handheld device alongside every audio layer? — Owner: `/10x-plan`, by measurement. Block: no.
- **Risk:** Separated from S-01 so the alignment proof is not entangled with visual design, and so the scene's cost to frame rate is measured against a known-good baseline rather than hidden inside the first slice. This is where the performance floor is most likely to be threatened.
- **Status:** proposed

### S-06: Listener sees exactly what would be shared, and decides

- **Outcome:** user can read the actual content each sharing level would send, filled with their own current values, choose a level or none at all, and return later to inspect or withdraw.
- **Change ID:** inspectable-diagnostics-consent
- **PRD refs:** US-06, FR-013, FR-014, FR-015, FR-016, FR-017
- **Prerequisites:** F-02, S-03
- **Parallel with:** —
- **Blockers:** —
- **Unknowns:** —
- **Risk:** Depends on S-03 because the higher sharing levels show the listener their own preset and parameter values — there is nothing truthful to display before those exist. Sequenced last among user-facing work because it is the only slice that sends anything anywhere, and shipping it earlier would mean building a consent screen around features not yet built.
- **Status:** proposed

## Backlog Handoff

| Roadmap ID | Change ID                                | Suggested issue title                                      | Ready for `/10x-plan` | Notes                                   |
| ---------- | ---------------------------------------- | ---------------------------------------------------------- | --------------------- | --------------------------------------- |
| F-01       | deployed-app-shell                       | Scaffold and publish a runnable shell on a secure connection | yes                   | Run `/10x-plan deployed-app-shell`      |
| F-02       | diagnostics-destination                  | Stand up a diagnostics destination with identifier retention off | no                | Needs F-01                              |
| S-01       | complete-session-with-measured-alignment | Complete session end to end with alignment measured         | no                    | Needs F-01. North star.                 |
| S-02       | live-alternation-control                 | Change alternation and per-layer depth mid-session          | no                    | Needs S-01                              |
| S-03       | preset-library                           | Four named presets with adjustable parameters               | no                    | Needs S-02                              |
| S-04       | offline-and-persisted-settings           | Run offline and persist settings between sessions           | no                    | Needs S-01                              |
| S-05       | finished-visual-scene                    | Replace the placeholder visual with a designed scene        | no                    | Needs S-01                              |
| S-06       | inspectable-diagnostics-consent          | Inspectable, graded, withdrawable diagnostics consent       | no                    | Needs F-02 and S-03                     |

## Open Roadmap Questions

1. **Are the four preset values right?** — Owner: user, by running sessions. Block: `S-03` (non-blocking; the mechanism can be built on provisional numbers).
2. **Is session recording/export in or out?** — Owner: user. Block: roadmap-wide (nothing is sequenced for it; if it comes in, it is new scope rather than a reordering).
3. **Does the diagnostics destination retain a client network address, and if so is it switched off there or stripped before sending?** — Owner: user. Block: `F-02` (non-blocking, but it decides where the fix lives).

## Parked

- **Accounts, cross-device sync, and a backend the product depends on** — Why parked: PRD §Non-Goals. Local-first is permanent, not deferred.
- **Preset sharing or a community library** — Why parked: PRD §Non-Goals. Built-in presets plus local saves only.
- **Clinical features — protocols, set counting, symptom or distress scales, progress tracking** — Why parked: PRD §Non-Goals. Ruled out permanently; they would contradict the product's own no-treatment-claims guardrail.
- **Sample-based bilateral sources** — Why parked: the scope round chose synthesis for v1 behind a seam samples can replace later. Not a non-goal, just not now.
- **Session timestamps and durations in diagnostics** — Why parked: no consent level offers them. The product asks what was set, never when or for how long.

## Done
