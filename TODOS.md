# TODOS

## V1 (this weekend)

- [x] **T1 (P1)** — Write `SKILL.md` with 7 locked interview Qs, minute-marker walkthrough script, exact verbatim opening/closing utterances, and the Pages-toggle bullet-by-bullet instructions
- [x] **T2 (P1)** — Write `template-picker.md` with the force-fit classifier prompt + bending logic
- [x] **T3 (P1)** — Write `recap.md.tmpl` with `.gitignore` opt-in guidance, the reflective "texted a friend in 24h?" prose-only question, and a "what you just learned about GitHub" section
- [x] **T4 (P1)** — Write `setup` shell script (5-line symlink installer, verbatim from design doc)
- [x] **T5 (P1)** — Write `README.md` with pre-install onramp (link to Claude Code install docs), GitHub prereqs ("you'll need a GitHub account + gh CLI optionally"), and run instructions
- [x] **T6 (P1)** — Build `templates/internal-tool/` — static HTML form + localStorage + table view, with `fields.json`, `copy.json`, `theme.css`, and `.gitignore` containing `spec.md` + `recap.md`
- [x] **T7 (P1)** — Build `templates/dashboard/` — static HTML + Chart.js + 3 pre-baked `data.json` shapes (time-series, categorical-bar, two-column-table), with `chart-config.json`, `narrative.md`, and `.gitignore`
- [x] **T8 (P1)** — Build `templates/prototype/` — static multi-page clickable HTML mockup, with `pages.json`, `copy/*.md`, and `.gitignore`
- [x] **T9 (P1)** — Write one-word-answer follow-up logic into `SKILL.md` (one follow-up max, then accept)
- [x] **T10 (P2)** — Add explicit Pages-toggle step-by-step instructions to `SKILL.md` (the 7-step bullet list from the design doc's Failure Modes section). Slot also used to add the six common gotcha-decode rules for things PMs say off-script at this step.
- [ ] **T11 (P2)** — Dogfood: builder runs `/first-build` end-to-end for each of the 3 templates Sunday morning, times it, fixes the slowest 1-2 issues
- [ ] **T12 (P2)** — Launch post: Twitter/LinkedIn/PM communities, link to the GitHub repo

## V1 build-time deferrals (surfaced during T1–T10)

- [x] **T1a** — `docs/design.md` § Min 28–30 still has stale "I'm polling the URL — when it returns 200, I'll print it here" text. The locked decision is manual paste-back; SKILL.md and recap.md.tmpl already reflect that. Edit design.md to match so a fresh-session re-read doesn't reintroduce the curl-poll behavior. **Fixed in commit; Min 25–28 also reworked to point at the 7-step bullet list and to bump "1–2 min" → "1–5 min."**
- [ ] **T1b** — `recap.md.tmpl` defines `<<config-swaps>>` and `<<codegen-notes>>` placeholders that aren't named in `SKILL.md`'s Min 27–30 step. Either: (a) inline the placeholder schema in SKILL.md, or (b) leave the agent to read the template before rendering. Pick once after T11 dogfood reveals whether the agent reliably opens the template.
- [ ] **T1c** — `templates/dashboard/examples/` ships to the PM's deployed site (no harm — inert JSON, ~2KB) but the recap doesn't tell them what those folders are. Mention in recap.md.tmpl's "what to try next" or add a one-line README pointer in each template.

## V1 follow-up (next week)

- [ ] **T13 (P2)** — Watch 3 DM'd PMs use `/first-build` without helping. Bite tongue. Record: did they finish? How long? Did they text a friend in 24h?
- [ ] **T14 (P2)** — Ask 1 of those 3 PMs to attempt a **second build using ONLY their recap.md** (no `/first-build`). Validates whether V2 should be Approach B (laddered) or C (glass box). This is the V1-validates-V2-direction signal.
- [ ] **T15 (P3)** — If 2+ of the 3 PMs got bad classifier picks: fix the `template-picker.md` prompt mid-week, document the fix.

## V2 backlog (deferred from V1)

- [ ] **T16 (V2)** — Classifier eval suite: 5-10 synthetic PM specs → expected templates. Deferred from V1 (decided in D4). Add once we've seen 3+ real PM specs and know what edge cases real-world look like.
- [ ] **T17 (V2)** — Survey template (Tally-style form + results dashboard) and automation template (webhook → Slack). Deferred from V1 because they need non-URL artifacts (Loom, screenshots) which V1 doesn't support.
- [ ] **T18 (V2)** — Pick V2 direction based on real-PM feedback: laddered (`/next-build` sister skill) OR glass-box (transparent + exportable prompts) OR something the PMs surfaced.
- [ ] **T19 (V2)** — Hosted live-session experience (from office-hours subagent's "coolest version"): PM joins a URL, paired with an autonomous agent that interviews + builds split-screen + auto-tweets at minute 28. Skipped V1 because it's a hosted product, not a Claude Code skill.
- [ ] **T20 (V2)** — Telemetry: Google Form (or similar) for the "texted a friend in 24h?" measurement. V1 ships with the question as prose only.
- [ ] **T21 (V2)** — Investigate cleaner V1 deploy mechanisms that don't require git/PAT: anonymous Cloudflare Pages upload, surge.sh integration, Vercel preview deploys. Outside voice flagged GitHub friction as the highest-dropoff step; V2 may want a "no-git fast path" for the first-build, with GitHub as an "upgrade to durability" V3.

## Known V1 risks (from outside voice, accepted)

- Realistic p50 may be 60-75 min on first attempt for PMs without GitHub/gh setup. Opening utterance sets honest expectation ("30 min if you have GitHub set up; 45-60 if you don't").
- The Pages toggle is multi-step on first time; SKILL.md mitigates with bullet-by-bullet instructions.
- Force-fit picks may surprise PMs whose spec doesn't cleanly fit. Recap explains the bend honestly. If pattern emerges, T15 triggers.
