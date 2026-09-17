---
project: "bilateral-gen"
version: 1
status: draft
created: 2026-09-17
context_type: greenfield
product_type: web-app
target_scale:
  users: small
  qps: n/a
  data_volume: minimal
timeline_budget:
  mvp_weeks: 12
  hard_deadline: null
  after_hours_only: true
---

# bilateral-gen — Product Requirements

## Vision & Problem Statement

Someone who wants bilateral (left↔right alternating) sound for focus or
relaxation plays a fixed recording from a streaming service. Those recordings
are finished audio: the alternation speed cannot be changed, nothing on screen
moves with the sound, playback needs a live connection, and ads interrupt
exactly the state the listener was trying to reach. Hearing the same loop every
session also makes the effect easy to tune out.

The stimulation does not have to be a recording. Generated from a live clock
rather than baked into a file, speed, depth and shape become things the listener
adjusts while a session is running; a visual element can be driven from that
same clock so sound and image stay locked together; and the whole session runs
with no connection and nothing to interrupt it.

## User & Persona

**Primary:** the project owner, plus non-clinical listeners who come for focus
or relaxation. Not a clinical audience, not people in treatment, and not
therapists — the product deliberately stays clear of medical use.

# TODO: the moment the persona reaches for the product — see Open Questions #1

## Success Criteria

### Primary
- A listener completes a full timed session end to end: the session fades in, a
  bilateral source alternates left↔right under an ambience layer, a visual
  element tracks the same alternation, and the session fades out on the timer.
- A listener changes alternation parameters *during* a session and the
  stimulation follows continuously, with no audible or visible jump.

### Secondary
# TODO: secondary success outcome — see Open Questions #2

### Guardrails
- Sound and image never drift apart. Both derive from one alternation position;
  divergence is a product failure even when everything else works.
- A complete session runs with no network connection, after first load.
- No session data, settings, or usage information leaves the listener's device.
- No text anywhere in the product claims to treat any condition.

## User Stories

# TODO: user stories — see Open Questions #3

No Given/When/Then acceptance criteria were captured during shaping. The Primary
success criteria above describe the intended flow but have not been written as
testable stories.

## Functional Requirements

### Session
- FR-001: Listener can start and stop a timed session. Priority: must-have
- FR-006: Session fades in at the start and fades out at the end. Priority: must-have

### Stimulation
- FR-002: Listener can hear a bilateral sound source alternate between the left and right channels. Priority: must-have
- FR-003: Listener can hear an ambience layer underneath the bilateral source. Priority: must-have
- FR-004: Listener can see a visual element that moves in lockstep with the audio alternation. Priority: must-have
- FR-005: Listener can set how strongly each layer follows the alternation, per layer. Priority: must-have

### Availability
- FR-007: Listener can run a complete session with no network connection. Priority: must-have
- FR-008: Listener's settings persist between sessions. Priority: nice-to-have

FR-008 was inferred from the local-only decisions rather than stated outright —
see Open Questions #6.

No Socratic round was run against these requirements during shaping; the
unanswered challenges are carried in `shape-notes.md` and mirrored in Open
Questions #7.

## Non-Functional Requirements

- Sound position and visual position derive from a single alternation value,
  with no divergence a listener can perceive across a full session.
  # TODO: numeric tolerance — see Open Questions #4
- A complete session runs with the network disabled, after first load.
- No session data, settings, or usage information leaves the listener's device.
- No product text claims to treat, cure, or alleviate any medical or
  psychological condition.
# TODO: performance floor for a continuous audio-and-motion session — see Open Questions #5

## Business Logic

One shared alternation clock drives every audible and visible element at once,
so the listener can change speed, depth and shape mid-session and the
stimulation follows smoothly without ever jumping or letting sound and image
drift apart.

The rule consumes what the listener sets — how fast the alternation runs, how
far each layer swings with it, and the shape of the movement — plus how far into
the session they are, since the opening and closing fades change the movement as
well as the volume. Its output is a single position value shared by everything
the listener perceives: where the sound sits between the ears, and where the
visual element sits on screen.

The listener encounters it as one coherent thing that responds while it is
running. Turning the speed up does not restart the alternation; it accelerates
the one already in motion. This is what a fixed recording cannot do, and it is
the reason the product is not simply a better-curated playlist.

## Access Control

Single user; no auth; data lives on-device only.

## Non-Goals

- **No accounts, backend, or cross-device sync.** Local-first is permanent, not
  a deferred feature. Rules out a large class of scope.
- **No preset sharing or community library.** Built-in presets plus local saves
  only.

Session recording/export and clinical features were both considered and left
undecided rather than ruled out — see Open Questions #8. They are not non-goals
and should not be treated as such.

## Open Questions

1. **What is the moment the persona reaches for the product?** — Owner. Shapes
   default session length and the opening screen. Block: no.
2. **What is a secondary success outcome?** — Owner. Block: no.
3. **What are the user stories?** — Owner. No Given/When/Then was captured, so
   nothing in this PRD is stated as testable acceptance criteria. Block: yes for
   implementation planning; the Primary criteria are prose, not tests.
4. **What sync tolerance counts as "no perceptible divergence"?** — Owner. Needs
   a number before the top guardrail can be tested rather than asserted.
   Block: yes for verifying the product's central guarantee.
5. **What is the performance floor?** — Owner. A continuous audio-and-motion
   session on a handheld device, with no stated frame-rate, thermal, or battery
   target. Block: no, but it constrains the visual scope.
6. **Is settings persistence (FR-008) in the first version?** — Owner. Inferred
   from the local-only decisions, not stated. Block: no.
7. **Have the requirements been stress-tested?** — Owner. The Socratic round was
   not run; per-requirement counter-arguments sit unanswered in
   `shape-notes.md`. Several question whether the first version needs a
   sample-based source, an ambience layer, and per-layer depth controls at all.
   Block: no, but resolving them may shrink scope materially.
8. **Are session recording/export and clinical features in or out?** — Owner.
   Both were offered as non-goals and neither was selected, so both remain in
   scope by default. Note the tension: clinical-shaped features (protocols, set
   counting, symptom scales) would sit badly against the "no treatment claims"
   guardrail and the decision to drop clinical framing from the product name.
   Worth resolving deliberately rather than by default. Block: no.
