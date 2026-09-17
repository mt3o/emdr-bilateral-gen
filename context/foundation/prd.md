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

There is no single dominant moment. Focus, evening wind-down and general
restlessness all count, and none leads. This is recorded as the owner's answer
rather than a gap — but it has a consequence worth stating: session-length and
fade defaults have no particular situation to be tuned for, so the shipped
defaults are a guess until real use contradicts them. See Open Questions #1.

## Success Criteria

### Primary
- A listener completes a full timed session end to end: the session fades in, a
  bilateral source alternates left↔right under an ambience layer, a visual
  element tracks the same alternation, and the session fades out on the timer.
- A listener changes alternation parameters *during* a session and the
  stimulation follows continuously, with no audible or visible jump.

### Secondary
- The owner returns to it unprompted — reaching for a session without having
  decided to test the product. Not sufficient on its own, but the signal least
  vulnerable to self-deception.

### Guardrails
- Sound and image never drift apart: never more than 25 ms out of alignment, and
  no accumulation of offset over the length of a session. Both derive from one
  alternation position; divergence is a product failure even when everything
  else works.
- A complete session runs with no network connection, after first load.
- Nothing leaves the listener's device unless they have explicitly chosen to
  share it. Sharing is off until chosen, every level is revocable, and the
  product behaves identically whichever level is set.
- No text anywhere in the product claims to treat any condition.

## User Stories

Derived from the requirements below and the success criteria above. Numbers used
here are the ones already settled — the alignment budget and the frame-rate
floor — and no new ones are introduced.

### US-01: Listener runs a complete session

- **Given** a listener who has opened the product and chosen a session length
- **When** they start the session
- **Then** the sound fades in, a bilateral source alternates left↔right beneath
  an ambience layer, a visual scene tracks the same alternation, and the session
  fades out and ends on the timer

#### Acceptance Criteria
- The alternating source is audible in both ears across a full cycle, never
  silent in one ear for a whole cycle
- Fade-in and fade-out are audible ramps, not steps
- The session ends on its own at the chosen length without intervention
- Nothing in the flow requires a network connection

### US-02: Listener changes the alternation while it runs

- **Given** a session already running
- **When** the listener changes the alternation speed, depth or shape
- **Then** the stimulation follows the new setting continuously, with no jump in
  sound position or visual position

#### Acceptance Criteria
- No audible discontinuity at the moment of change
- The visual element does not teleport; its motion stays continuous
- Sound and visual remain within 25 ms of each other across the change

### US-03: Listener sets how much each layer moves

- **Given** a listener on the controls
- **When** they change the depth for one layer
- **Then** only that layer's movement changes; the others keep their own depth

#### Acceptance Criteria
- Depth is settable per layer, not only globally
- Setting one layer's depth to zero leaves that layer audible but stationary
- Other layers are unaffected by the change

### US-04: Listener's settings survive a restart

- **Given** a listener who has adjusted settings and closed the product
- **When** they open it again
- **Then** their previous settings are still in place

#### Acceptance Criteria
- Settings persist across a restart without any account or sign-in
- Settings are stored locally and are not transmitted anywhere, unless the
  listener has turned on a sharing level that includes parameter values

### US-06: Listener decides what, if anything, is shared

- **Given** a listener opening the product for the first time
- **When** the consent prompt appears
- **Then** they see what each level sends in plain language, and nothing is
  transmitted unless they pick a level above Off

#### Acceptance Criteria
- The initial state is Off; no network request carrying diagnostic data is made
  before a level is chosen
- Dismissing the prompt without answering leaves the level at Off, and the
  product remains fully usable
- The level can be changed or returned to Off later from settings, and lowering
  it stops further transmission immediately
- At every level, a session runs identically — sharing never gates a feature

### US-05: Alignment holds for a full session

- **Given** a session running its full length
- **When** sound position and visual position are sampled throughout
- **Then** they never differ by more than 25 ms, and the difference at the end
  is no larger than at the start

#### Acceptance Criteria
- Maximum observed divergence ≤ 25 ms at any sample
- Divergence shows no upward trend across the session
- Holds at a sustained 30 fps on a handheld device and 60 fps on a desktop

## Functional Requirements

### Session
- FR-001: Listener can start and stop a timed session. Priority: must-have
- FR-006: Session fades in at the start and fades out at the end. Priority: must-have

### Stimulation
- FR-002: Listener can hear a bilateral sound source alternate between the left and right channels. Priority: must-have
- FR-003: Listener can hear an ambience layer underneath the bilateral source. Priority: must-have
- FR-004: Listener can see a visual element that moves in lockstep with the audio alternation. Priority: must-have
- FR-009: The visual element is presented as a finished, designed scene rather than a bare indicator. Priority: must-have
- FR-005: Listener can set how strongly each layer follows the alternation, per layer. Priority: must-have

### Presets
- FR-010: Listener can start from one of four named presets rather than setting every parameter themselves. Priority: must-have
- FR-011: Listener can change any preset's parameters, and the result becomes their working settings. Priority: must-have
- FR-012: Alternation speed carries a plain-language descriptor that updates as the listener moves the control. Priority: must-have

The four presets and their starting values:

| Preset | Speed | Session | Fade | Bilateral depth | Ambience depth |
|---|---|---|---|---|---|
| **Settle** (initial) | 0.5 Hz — one pass every second | 15 min | 20 s | 80% | 35% |
| **Focus** | 0.8 Hz — brisker, stays in the background | 10 min | 10 s | 60% | 20% |
| **Unwind** | 0.3 Hz — slow, wide swing | 20 min | 30 s | 85% | 50% |
| **Drift** | 0.2 Hz — barely moving | 30 min | 45 s | 70% | 60% |

Speed is stated as full left→right→left cycles per second. `Settle` is what a
first-time listener gets.

Preset names describe how a session feels, not what it is for. They make no
claim about an effect on the listener, and none is named after a condition,
symptom, or desired outcome.

The descriptors under the speed control (FR-012) follow the same rule — they
name the sensation at that speed, not a purpose or a result. Across the range:
*brisk · steady · slow · drifting*. They are orientation for someone who has no
intuition for what 0.4 Hz feels like, not a recommendation to seek any
particular state.

### Diagnostics and consent
- FR-013: On first launch, listener is asked once whether to share diagnostic data, with sharing off until they choose otherwise. Priority: must-have
- FR-014: Listener can choose how much to share, from a graded set of levels. Priority: must-have
- FR-015: Listener can change or withdraw their choice at any time from settings. Priority: must-have
- FR-016: The consent prompt names what each level sends, in plain language, before the listener chooses. Priority: must-have

The levels, each including everything above it:

| Level | What leaves the device |
|---|---|
| **Off** (initial) | Nothing. |
| **Errors** | Error reports: what failed, product version, browser and OS version. |
| **Errors + preset** | Which of the four presets was chosen. |
| **Errors + parameters** | The parameter values in use — speed, depths, session length, fades. |

No level sends session timestamps, session durations, or anything identifying
the listener. The product asks what was set, never when or for how long someone
listened. That boundary is deliberate: a timestamped record of when a person
reaches for a calming tool is a different and more revealing artifact than a
record of which preset they preferred, and the second is enough to tell whether
the preset values are wrong.

The prompt is dismissible without answering, and dismissing leaves sharing off.
Sharing is never a condition of using the product.

### Availability
- FR-007: Listener can run a complete session with no network connection. Priority: must-have
- FR-008: Listener's settings persist between sessions. Priority: must-have

Every requirement above is in the first version. The scope round on 2026-09-17
confirmed the ambience layer, per-layer depth controls, fades, settings
persistence and a finished visual scene all stay in, and deferred nothing.
Presets were added on the same date.

## Non-Functional Requirements

- Sound position and visual position never diverge by more than 25 ms, measured
  at any instant during a session.
- Divergence does not accumulate: a 20-minute session ends as tightly aligned as
  it began. Both positions are read from one alternation value, so there is no
  second timebase for them to drift against.
- A complete session runs with the network disabled, after first load.
- With sharing off — the initial state — no session data, settings, or usage
  information leaves the listener's device.
- With sharing on, only the categories the listener selected are transmitted,
  and nothing else. Raising a level never applies retroactively to anything
  recorded earlier.
- Transmission never blocks or degrades a session: a failed or slow send is
  invisible to the listener, and a session runs identically with the network
  unavailable.
- No product text claims to treat, cure, or alleviate any medical or
  psychological condition.
- Motion is sustained at 60 fps on a desktop machine and at no less than 30 fps
  on a handheld device, for the length of a full session.
- Audio plays without dropout, click or glitch for the length of a full session.
  Where the two compete, audio continuity is the one that holds: a dropped frame
  is recoverable, an audible glitch ends the session's usefulness.

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

- **No accounts, no cross-device sync, and no backend the product depends on.**
  Local-first is permanent. Amended 2026-09-17: diagnostic reports now have a
  destination off the device for listeners who opt in, but it is not part of how
  the product works — every feature functions with it unreachable, and the
  offline guarantee is unchanged. Nothing about a listener is retained off the
  device beyond what they chose to send.
- **No preset sharing or community library.** Built-in presets plus local saves
  only.

- **No clinical features.** No treatment protocols, no bilateral-set counting,
  no symptom or distress scales, no progress tracking against any measure of
  wellbeing. Ruled out permanently, not deferred. The product exposes its
  parameters directly and describes them in plain language; it does not
  prescribe values, infer a condition, or record anything about the listener's
  state.

Session recording and export remain undecided — neither ruled in nor out. See
Open Questions #2.

## Open Questions

1. **Are the preset values right?** — Owner, by use. The four presets replace a
   single arbitrary default, but their numbers are still first guesses made
   without a dominant moment of use to tune against. Speed and session length
   are the two most likely to be wrong. Resolvable by running sessions, not by
   deciding now. Block: no.
2. **Is session recording/export in or out?** — Owner. Still undecided; it was
   not part of the clinical-features decision and remains genuinely open.
   Block: no.
