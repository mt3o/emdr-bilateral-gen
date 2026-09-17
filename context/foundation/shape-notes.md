---
project: null   # name not chosen — EMDR dropped from positioning; see Open Questions #1
context_type: greenfield
created: 2026-09-17
updated: 2026-09-17
checkpoint:
  current_phase: 8
  phases_completed: [1, 2, 3, 4, 5, 6, 7]
  gray_areas_resolved:
    - topic: "primary persona"
      decision: "author himself, plus non-clinical users seeking focus/relaxation; explicitly not a medical audience"
    - topic: "status quo replaced"
      decision: "fixed bilateral-stimulation tracks on YouTube/Spotify"
    - topic: "MVP scope"
      decision: "thin vertical slice — one shared phase clock, per-layer panning, one bilateral source, one ambience, one visual theme, timed session with fades"
    - topic: "delivery window"
      decision: "3+ months, hobby pace, no external deadline"
    - topic: "platform"
      decision: "web app / PWA — installable, offline after first load, one codebase"
    - topic: "access model"
      decision: "single user, no auth, settings on-device only"
    - topic: "naming & positioning"
      decision: "drop EMDR entirely from the product name and copy; repo name is legacy"
  frs_drafted: 8
  quality_check_status: warned
---

# Shape notes

Source: discovery conversation on 2026-09-17. Every decision below was stated or
selected by the project owner. Items the owner has not decided are in
`## Open Questions`, never guessed.

## Vision & Problem Statement

Someone who wants bilateral (left↔right alternating) sound for focus or
relaxation currently plays a fixed recording from YouTube or Spotify. Those
recordings are finished audio files: the alternation speed cannot be changed,
nothing on screen moves with the sound, playback needs a network connection,
and ads interrupt exactly the state the listener was trying to reach. The same
loop every session also makes the effect easy to tune out.

The insight: the stimulation does not have to be a recording. If alternation is
generated from a live clock rather than baked into a file, speed, depth, and
shape become things the listener adjusts mid-session, a visual element can be
driven from the same clock so sound and image stay locked together, and the
whole thing runs offline with nothing to interrupt it.

## User & Persona

**Primary:** the project owner, plus non-clinical users who come for focus or
relaxation. Not a clinical audience, not people in treatment, and not
therapists — the owner explicitly wants to stay away from medical use.

> Gap: the specific *moment* the persona reaches for this (at a desk before
> deep work? winding down at night? mid-anxiety?) was not pinned down. See
> Open Questions #2 — it shapes session length defaults and the start screen.

## Access Control

Single user; no auth; settings live on-device only. Follows directly from the
owner's "nothing leaves the device" guardrail and the "no accounts / backend /
sync" non-goal.

## Success Criteria

### Primary
- A listener completes a full timed session end to end: the session fades in,
  a bilateral source alternates left↔right under an ambience layer, a visual
  element tracks the same alternation, and the session fades out on the timer.
- The listener changes alternation parameters *during* a session and the
  stimulation follows continuously, without an audible or visible jump.

### Secondary
> Not captured. The owner did not name a secondary outcome. See Open Questions #3.

### Guardrails
- **Audio–visual sync never drifts.** The visual element and the audio pan read
  from one clock. Drift is a product failure even if everything else works.
- **Works fully offline.** After first load, a complete session runs with no
  network. This is the concrete difference from the status quo.
- **Nothing leaves the device.** No accounts, no analytics, no telemetry.
- **No therapeutic claims.** No language in the UI or store copy claiming to
  treat trauma, PTSD, or anxiety.

## Functional Requirements

Derived from the MVP slice the owner selected. All are must-have for the thin
slice unless marked otherwise.

### Session
- FR-001: Listener can start and stop a timed session. Priority: must-have
- FR-006: Session fades in at the start and fades out at the end. Priority: must-have

### Stimulation
- FR-002: Listener can hear a bilateral sound source alternate between the left and right channels. Priority: must-have
- FR-003: Listener can hear an ambience layer underneath the bilateral source. Priority: must-have
- FR-004: Listener can see a visual element that moves in lockstep with the audio alternation. Priority: must-have
- FR-005: Listener can set how strongly each layer follows the alternation, per layer. Priority: must-have

### Platform
- FR-007: Listener can run a complete session with no network connection. Priority: must-have
- FR-008: Listener's settings persist on-device between sessions. Priority: nice-to-have

> Note: FR-008 is inferred from the on-device/no-backend decisions rather than
> stated outright. Confirm or drop it before the PRD locks.

## Socratic challenges — UNANSWERED

The Socratic round (one counter-argument per FR) was not run; the owner asked
for shape notes to be produced from the conversation rather than a further
interview. The challenges below are recorded open so they can be answered
before `/10x-prd` locks scope. **No resolutions have been invented.**

- FR-002 — If alternation is the whole product, is a *sample-based* source
  needed at all for the slice, or would pure synthesis prove the same thing at
  a fraction of the loading and asset work?
- FR-003 — Does the ambience layer earn its place in the *thinnest* slice, or
  is it the first thing that could be cut to reach a running session sooner?
- FR-004 — Is the visual genuinely part of the stimulation, or is it a comfort
  feature that could ship after the audio is proven?
- FR-005 — Per-layer depth is three controls. Would one global depth control
  prove the concept and defer the rest?
- FR-006 — Fades are polish. What breaks if the first version starts and stops
  abruptly?
- FR-007 — Offline is a guardrail. Does it need to hold in the *slice*, or only
  before anyone else uses it?
- FR-008 — If the slice has one preset, is there anything worth persisting yet?

## Business Logic

One shared alternation clock drives every audible and visible element at once,
so the listener can change speed, depth, and shape mid-session and the
stimulation follows smoothly without ever jumping or letting sound and image
drift apart.

The rule consumes what the listener sets — how fast the alternation runs, how
far each layer swings with it, and the shape of the movement — plus how far
into the session they are, since the opening and closing fades change the
movement as well as the volume. Its output is a single position value shared by
everything the listener perceives: where the sound sits between the ears, and
where the visual element sits on screen.

The listener encounters it as a single coherent thing that responds while it is
running. Turning the speed up does not restart the alternation; it accelerates
the one already in motion. This is what a fixed recording cannot do, and it is
the whole reason the product is not simply a better-curated playlist.

## Non-Functional Requirements

- Sound and image derive from one clock, with no drift a listener can perceive
  over a full session. *(Numeric tolerance not set — see Open Questions #4.)*
- A complete session runs with the network disabled, after first load.
- No session data, settings, or usage information leaves the device.
- No UI text, store copy, or marketing material claims to treat any condition.

> Gap: no performance floor (frame rate, CPU, battery) was stated, despite the
> product being a continuous animated audio session likely to run on a phone
> for many minutes. See Open Questions #5.

## Non-Goals

Selected by the owner:

- **No accounts, backend, or cross-device sync** — local-first and permanent,
  not a deferred feature. Rules out a large class of scope.
- **No preset sharing or community library** — built-in presets plus local
  saves only.

Explicitly *not* claimed as non-goals: session recording/export and clinical
features were both offered and **not** selected, so they remain in scope or
undecided rather than ruled out. See Open Questions #6.

## Forward: tech-stack

Product-level decisions that constrain the stack step downstream (not PRD
content):

- Target is a web app / PWA: installable, offline after first load, one
  codebase for phone and desktop.
- Known platform constraints flagged during the decision: on iOS, audio can
  only start from a user gesture, and the hardware mute switch silences web
  audio. Both need handling in the start flow.
- The clock, the audio panning, and the visual all have to read from a single
  shared time source — a hard requirement on whatever audio/animation approach
  is chosen.

## Timeline acknowledgment

Acknowledged on 2026-09-17: 3+ months at hobby pace with no external deadline;
owner accepted that the dominant risk at this pace is stalling rather than
scope. `mvp_weeks: 12` is a placeholder for that window, not a commitment.

## Quality cross-check

Ran 2026-09-17. `quality_check_status: warned` — the owner's decisions cover
the load-bearing sections, but these gaps are carried forward verbatim:

- **Project name** — the product name is unset after dropping EMDR. `/10x-prd`
  cannot fill `project:` frontmatter without it.
- **Persona moment** — no named situation that triggers reaching for the app;
  session defaults and the start screen have nothing to anchor to.
- **Secondary success criteria** — none stated; only Primary and Guardrails.
- **Socratic round not run** — no FR has been stress-tested; the slice may
  still be thicker than it needs to be.
- **No performance floor** — a continuous audio-plus-animation session with no
  stated frame-rate or battery target.
- **Recording/export and clinical features undecided** — neither ruled in nor
  out, and "no clinical features" sits in tension with the "no therapeutic
  claims" guardrail and dropping EMDR from the name.

## Open Questions

1. **What is the product called?** — Owner. Blocks PRD frontmatter `project:`.
   EMDR was dropped from positioning, so the repo name is legacy and not a
   fallback.
2. **What is the moment the persona reaches for this?** — Owner. Shapes default
   session length and the start screen.
3. **What is a secondary success outcome?** — Owner. Non-blocking.
4. **What sync tolerance counts as "no drift"?** — Owner. Needs a number before
   it can be tested rather than asserted.
5. **What is the performance floor on a phone?** — Owner. Frame rate, session
   length under battery.
6. **Are recording/export and clinical features in or out?** — Owner. Both were
   offered as non-goals and not selected. Note the tension: shipping
   clinical-shaped features (protocols, set counting, symptom scales) would sit
   badly against the "no therapeutic claims" guardrail and the decision to drop
   EMDR from the name. Worth resolving deliberately, not by default.
7. **Is FR-008 (settings persistence) in the slice?** — Owner. Inferred, not
   stated.
