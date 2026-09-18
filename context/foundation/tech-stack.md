---
starter_id: vite-react
package_manager: npm
project_name: bilateral-gen
hints:
  language_family: js
  team_size: solo
  deployment_target: cloudflare-pages
  ci_provider: github-actions
  ci_default_flow: auto-deploy-on-merge
  bootstrapper_confidence: verified
  path_taken: custom
  quality_override: true
  self_check_answers:
    understands_gate_failure: true
    gate_failure_applies_to_this_project: false
    alternative_considered: true
    compensation_accepted: true
    proceeding_knowingly: true
  has_auth: false
  has_payments: false
  has_realtime: false
  has_ai: false
  has_background_jobs: false
---

## Why this stack

The product is a single screen with no routes, no server and no stored data
beyond local settings, so the framework's job is narrow: hand over a fast dev
loop, explicit types, and a static bundle that runs offline. Vite plus React
does exactly that and nothing more. The vetted default for a JS web app bundles
a hosted database and auth, which the PRD rules out twice — as a non-goal and as
a privacy guardrail — so it was rejected rather than trimmed down. Next.js and
Angular both pass every quality gate but carry server-side machinery this
product would never call. Vite + React fails one gate, convention-based, because
it dictates no routing or folder layout; with one screen and no routes there is
no layout to dictate, so the gap is recorded rather than compensated for. React
was preferred over Vue for corpus size at equal machinery. Static hosting on
Cloudflare Pages gives HTTPS by default, which is not optional here: screen wake
lock and installability both require a secure context.
