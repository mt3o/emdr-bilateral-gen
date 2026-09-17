---
project: "bilateral-gen"
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
      decision: "revised 2026-09-17 by the scope round — every layer kept, nothing deferred, visual fully themed; no longer a thin slice. Original slice wording in the Scope round section"
    - topic: "delivery window"
      decision: "3+ months, hobby pace, no external deadline"
    - topic: "platform"
      decision: "web app / PWA — installable, offline after first load, one codebase"
    - topic: "access model"
      decision: "single user, no auth, settings on-device only"
    - topic: "naming & positioning"
      decision: "drop EMDR entirely from the product name and copy; repo name is legacy"
    - topic: "product name"
      decision: "bilateral-gen — describes the mechanism, carries no clinical claim"
  frs_drafted: 9
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

> Answered 2026-09-17: there is no single dominant moment — focus, evening
> wind-down and general restlessness all count, none leads. The consequence is
> that session-length and fade defaults have nothing specific to be tuned for,
> so the first values shipped are a guess. See Open Questions #1.

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
- The owner returns to it unprompted, without having decided to test it
  (answered 2026-09-17).

### Guardrails
- **Audio–visual sync never drifts.** Never more than ±25 ms apart, with no
  accumulation over a session. The visual element and the audio pan read from
  one clock. Drift is a product failure even if everything else works.
- **Works fully offline.** After first load, a complete session runs with no
  network. This is the concrete difference from the status quo.
- **Nothing leaves the device.** No accounts, no analytics, no telemetry.
- **No therapeutic claims.** No language in the UI or store copy claiming to
  treat trauma, PTSD, or anxiety.

## Functional Requirements

Derived from the MVP slice the owner selected, then revised by the scope round
on 2026-09-17. All are must-have for v1.

### Session
- FR-001: Listener can start and stop a timed session. Priority: must-have
- FR-006: Session fades in at the start and fades out at the end. Priority: must-have

### Stimulation
- FR-002: Listener can hear a bilateral sound source alternate between the left and right channels. Priority: must-have
- FR-003: Listener can hear an ambience layer underneath the bilateral source. Priority: must-have
- FR-004: Listener can see a visual element that moves in lockstep with the audio alternation. Priority: must-have
- FR-009: The visual element is presented as a finished, designed scene rather than a bare indicator. Priority: must-have
- FR-005: Listener can set how strongly each layer follows the alternation, per layer. Priority: must-have

### Platform
- FR-007: Listener can run a complete session with no network connection. Priority: must-have
- FR-008: Listener's settings persist on-device between sessions. Priority: must-have

> FR-008 was inferred during shaping and promoted to must-have by the scope
> round on 2026-09-17.

## Scope round — 2026-09-17

The challenges below were put to the owner after the PRD was first written.
Outcome: **nothing was deferred.** The ambience layer, per-layer depth controls,
fades and settings persistence all stay in v1, and the visual ships as a
finished themed scene rather than a bare indicator. The only simplification
taken was synthesizing the bilateral source instead of using recorded audio.

This means the first version is no longer the "thin vertical slice" recorded
below. It is a complete small product. That is a defensible choice against a
3-month window, but it is a different bet than the one made during shaping, and
the original slice wording is kept below as the record of what changed.

Settled by the round:
- Alignment budget: ±25 ms, no accumulation over a session.
- Bilateral source: synthesis for v1, behind a seam samples can replace.
- Visual: in v1, fully themed.
- Deferred: nothing.

## Socratic challenges — RAISED 2026-09-17, mostly answered by the scope round

Each challenge and how it landed:

- FR-002 — If alternation is the whole product, is a *sample-based* source
  needed at all for the slice, or would pure synthesis prove the same thing at
  a fraction of the loading and asset work?
  > **Answered:** synthesis for v1, behind a seam samples can replace later.
- FR-003 — Does the ambience layer earn its place in the *thinnest* slice, or
  is it the first thing that could be cut to reach a running session sooner?
  > **Answered:** stays in v1.
- FR-004 — Is the visual genuinely part of the stimulation, or is it a comfort
  feature that could ship after the audio is proven?
  > **Answered:** stays in v1, and fully themed. The sync guardrail cannot be
  > tested without a visual to test it against.
- FR-005 — Per-layer depth is three controls. Would one global depth control
  prove the concept and defer the rest?
  > **Answered:** stays in v1.
- FR-006 — Fades are polish. What breaks if the first version starts and stops
  abruptly?
  > **Answered:** stays in v1.
- FR-007 — Offline is a guardrail. Does it need to hold in the *slice*, or only
  before anyone else uses it?
  > **Still open.** Not put to the owner. Offline remains a v1 guardrail by
  > default.
- FR-008 — If the slice has one preset, is there anything worth persisting yet?
  > **Answered:** stays in v1; promoted from nice-to-have to must-have.

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
- **Bilateral source: synthesis first, samples behind a seam** (decided
  2026-09-17). v1 synthesizes the bilateral source rather than playing recorded
  audio, so there is no asset pipeline, no loop-point preparation and no loading
  step before the clock can be proven. The source sits behind an interface that
  a sample-based implementation can replace later without touching the clock or
  the panning. This is an implementation decision, so it is recorded here rather
  than in the PRD.
- The ±25 ms alignment budget with no accumulation constrains the audio and
  animation approach jointly: both positions must be derived from one value, and
  a design that gives sound and visuals separate timebases cannot meet it.

## Timeline acknowledgment

Acknowledged on 2026-09-17: 3+ months at hobby pace with no external deadline;
owner accepted that the dominant risk at this pace is stalling rather than
scope. `mvp_weeks: 12` is a placeholder for that window, not a commitment.

## Quality cross-check

Ran 2026-09-17. `quality_check_status: warned` — the owner's decisions cover
the load-bearing sections, but these gaps are carried forward verbatim:

- ~~**Project name**~~ — resolved 2026-09-17: `bilateral-gen`.
- ~~**Socratic round not run**~~ — resolved 2026-09-17 by the scope round; six
  of seven challenges answered, nothing deferred.
- ~~**Sync tolerance unset**~~ — resolved 2026-09-17: ±25 ms, no accumulation.
- ~~**No performance floor**~~ — resolved 2026-09-17: 60 fps desktop, 30 fps
  floor on handheld, clean audio throughout, audio winning where the two
  compete.
- **Session defaults unanchored** — with no dominant moment of use, the shipped
  session length and fade times are a guess until real use corrects them.
- **Recording/export and clinical features undecided** — put to the owner again
  on 2026-09-17 and deliberately left open. The tension is unchanged and now
  knowingly carried: clinical-shaped features would sit against the product's
  own no-treatment-claims guardrail and the decision to drop clinical framing
  from the name.

## Open Questions

1. **What should the default session length and fade times be?** — Owner, or
   observation. Downstream of there being no dominant moment of use: the
   defaults have nothing in particular to be tuned for. Resolvable by using the
   product rather than by deciding now.
2. **Are recording/export and clinical features in or out?** — Owner. Both were
   offered as non-goals and not selected. Note the tension: shipping
   clinical-shaped features (protocols, set counting, symptom scales) would sit
   badly against the "no therapeutic claims" guardrail and the decision to drop
   EMDR from the name. Worth resolving deliberately, not by default.
3. **Does the offline guarantee have to hold in v1?** — Owner. The only
   challenge from the scope round not put to them; offline stays a v1 guardrail
   by default.
