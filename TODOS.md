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
- [ ] **T11 (P2)** — ~~Dogfood: builder runs `/first-build` end-to-end for each of the 3 templates Sunday morning, times it, fixes the slowest 1-2 issues~~ **RESCHEDULED to after V1.5 (T28).** Sunday launch slips ~1-2 weeks per the V1.5 design (see `docs/design-v1.5.md`).
- [ ] **T12 (P2)** — ~~Launch post: Twitter/LinkedIn/PM communities, link to the GitHub repo~~ **RESCHEDULED to after V1.5 (T29).** Same reason. Launch announcement will mention both paths.

## V1.5 build-time observations (surfaced during T22–T27)

- **SKILL.md is approaching the limit of "single-file readable."** Grew 345 → 537 lines during T23. The path-A and path-B walkthroughs are mostly independent, and recap-rendering rules live alongside them. The next time we add a path / mode / major branch, splitting SKILL.md into a slim orchestrator + per-path files (e.g. `path-a.md`, `path-b.md`) starts being the right move. Not blocking V1.5 ship — but flag for V2 architecture work. Tracked as T30 in V2 backlog.

## V1 build-time deferrals (surfaced during T1–T10)

- [x] **T1a** — `docs/design.md` § Min 28–30 still has stale "I'm polling the URL — when it returns 200, I'll print it here" text. The locked decision is manual paste-back; SKILL.md and recap.md.tmpl already reflect that. Edit design.md to match so a fresh-session re-read doesn't reintroduce the curl-poll behavior. **Fixed in commit; Min 25–28 also reworked to point at the 7-step bullet list and to bump "1–2 min" → "1–5 min."**
- [x] **T1b** — `recap.md.tmpl` defines `<<config-swaps>>` and `<<codegen-notes>>` placeholders that aren't named in `SKILL.md`'s Min 27–30 step. **Fixed:** inlined full placeholder schema in SKILL.md as a reference table so the agent doesn't have to read both files to render correctly.
- [x] **T1c** — `templates/dashboard/examples/` ships to the PM's deployed site (no harm — inert JSON, ~2KB) but the recap doesn't tell them what those folders are. **Fixed:** added a new `<<template-note>>` placeholder to recap.md.tmpl (rendered as a "First small change to try" callout right after the spec echo) with a per-template hint — for dashboard it points at `examples/`; for internal-tool it suggests adding a field; for prototype it suggests adding a page.

## V1.5 — two-path /first-build (Path A: problem-shaped, Path B: person-shaped)

Designed via /office-hours on 2026-05-19 after dogfood r2 surfaced: PMs without a specific idea freeze at Q1 of V1's 7-Q problem interview. Full design doc at `docs/design-v1.5.md` (pointer at `~/.gstack/projects/PM_dev_tool/himanshutandon-main-design-20260519-162428.md`).

**Approach: A (two distinct paths with explicit gate at Min 1.5).** Approaches B (minimal) and C (adaptive single interview) considered and rejected. Effort estimate: ~4-6 CC hours / ~1 week part-time. (Revised down from 6-10 hours after D5/D6 removed the demo-hosting requirement — no PNGs to bundle, no Pages subdirectory to deploy.)

**D5/D6 revision (2026-05-19, post-design-doc):** Path B uses a **text-based 3-option picker**, not live thumbnails or inline screenshots or external demo URLs. After the 5-Q get-to-know-you, Claude generates 3 personalized build options (each: build name + one-sentence description + one-line reason grounded in the PM's answers) and presents them via `AskUserQuestion`. The "Other" auto-option handles the override case. T24 (deploy demos) is removed. Zero new operational surface.

- [x] **T22 (P1)** — Write `.claude/skills/first-build/person-picker.md` (parallel to `template-picker.md`). Takes 5 person-shaped answers, emits 3 build options each with `build_name / template / description / because`. Heuristics: 3 options should span 2+ archetypes when answers are ambiguous; flat-favoring answers can collapse to a same-archetype set if needed. Include 3-4 worked examples.
  - **Eng-review refinement (D2 / Premise #9):** Add explicit determinism constraints to the prompt: anchor priority `annoyance > weekend_project > role > tools > hobby` (hobby restricted to accent color or recap copy, never the build's primary anchor); archetype balance rule (3 options must span ≥2 archetypes unless answers strongly favor one); each `because:` line must quote a specific phrase from a specific answer, not paraphrase. Worked examples double as informal eval cases.
- [x] **T23 (P1)** — Restructure `SKILL.md`: new Min 1–1.5 path gate section with verbatim utterance, new Min 2–7 Path B walkthrough (5 get-to-know-you Qs with examples + multi-choice fallbacks, mirroring Path A's structure), new Min 7–8 3-option text-select picker section with verbatim AskUserQuestion sketch, 2-Q micro-interview at Min 8–10. Path A walkthrough renamed but otherwise unchanged.
  - **Eng-review refinement (D3 / Open Question #7):** Specify the "Other" path behavior as a two-strike soft cap: on first "Other," Claude takes the free-form as additional context and regenerates 3 fresh options. On second "Other," Claude offers verbatim: *"Two strikes — let me switch tack. Want to try the problem-shaped interview instead? I'll ask you 7 questions about what you want to build."* Bounded; no intent detection LLM call.
- [x] ~~**T24 (P1)** — Deploy 3 live demos to `HT224.github.io/first-build/demos/<archetype>/`.~~ **REMOVED** in D5/D6 revision. Path B uses a text-based picker; no demos exist.
- [x] **T25 (P1)** — Update `recap.md.tmpl`: add `<<path>>` placeholder, add Path B "Here's how I read you" section that quotes get-to-know-you answers back ("you said you geek out about rock climbing — that's where the accent color came from"). Handle both spec.md schemas (problem-shaped vs person-shaped).
- [x] **T26 (P2)** — Update `README.md` to mention both paths and the gate. Frame Path B as "different way in for the curious," not "shortcut for the indecisive" (per /office-hours framing insight).
- [x] **T27 (P2)** — Update `docs/design.md` to cross-reference `docs/design-v1.5.md` so a fresh-session re-read sees both V1 (load-bearing decisions, locked) and V1.5 (additive).
- [ ] **T28 (P1)** — Dogfood r3: builder runs each path end-to-end at least once. Time both. Watch for: does the gate question feel like a wrong-foot? Does Claude pick the right template 4/5 times? Does the live demo confirmation beat actually convert? Fix top 2 frictions.
  - **Eng-review refinement (regression risk on `recap.md.tmpl`):** **Run Path A FIRST** — V1.5 adds the `<<path>>` placeholder to `recap.md.tmpl`, which is shared between paths. If the Path B placeholders (`<<picked_because>>`, the "Here's how I read you" section) leak into a Path A render as "undefined" or literal placeholder text, V1 PMs see broken recaps. Path A end-to-end must produce a valid recap before Path B is tested at all. Then run Path B happy path, then Path B "Other" double-pick, then Path B twice with the same answers (informal determinism check per D2). See test plan at `~/.gstack/projects/PM_dev_tool/himanshutandon-main-eng-review-test-plan-20260519-171939.md`.
- [ ] **T29 (P2)** — Launch post (originally T12), updated to mention both paths. Push only after T28 succeeds and Path B's friend-text rate is at least 50% of Path A's in dogfood r3 — otherwise cut Path B and ship V1 as-is.

## QA verdict — templates pre-dogfood r2 (2026-05-19)

Ran `/qa-only` against all three templates served from a local HTTP server. Health score **95/100**, zero critical/high/medium/low findings. Report at `.gstack/qa-reports/qa-report-templates-2026-05-19.md` (gitignored — see `.gitignore`).

- **internal-tool:** form renders, add/persist-across-reload/delete all work, localStorage key `first-build:entries` shape verified, required-field validation fires. Clean.
- **dashboard (time-series default):** Chart.js v4.4.1 CDN loads (205KB, 104ms), line chart renders all 8 data points, narrative markdown renders bold + headings, data table appears below chart. Clean.
- **dashboard (categorical-bar / two-column-table):** example JSON files validated, but the in-memory `fetch` override didn't cleanly re-execute the IIFE so these shapes weren't *visually* verified. Risk: low — the shape-conditional code path in app.js is trivial. Optional 3-min manual swap test would close this fully.
- **prototype:** sticky nav + 4 page tabs, hash routing + active-state highlight + deep-link + missing-slug graceful, markdown (headings/bold/bullets). Clean.

Translation for dogfood r2: any friction you hit is **UX / flow friction**, not "the page doesn't work" friction. Proceed.

## Dogfood round 1 fixes (2026-05-19, from builder's first /first-build run)

All five landed in one commit ("dogfood-r1") — the new Min 0–10 flow is meaningfully different from the original T1 flow.

- [x] **DF1** — Interview was too survey-like ("open ended and on the nose"). Fix: redesigned Min 2–7 as dialogic. Three rules now apply to every question — react in ≤12 words after each answer, read an inline example *with* the question, offer a multi-choice fallback if the answer is thin/hedged. Old standalone "short-answer follow-up" section folded into per-question fallback blocks.
- [x] **DF2** — GitHub setup happened at Min 5–7, after the PM had already answered 7 questions. Fix: moved GitHub gate to Min 1–2 with a binary yes/no first, then signup walkthrough or username collection. Repo creation deferred to Min 7 once we have a kebab-case slug from the spec.
- [x] **DF3a** — Skill didn't explain what Claude Code is vs Claude Desktop vs claude.ai, so PMs didn't know why this version can ship and the others can't. Fix: new dedicated Min 0–1 onboarding step with a verbatim utterance covering (a) what Claude Code is, (b) the file-edit / run-commands difference, (c) a 6-step roadmap of the next 30 min, (d) the "you can interrupt me anytime" affordance.
- [x] **DF3b** — PMs had only one source of truth for the deployed URL (the string the skill printed). Fix: at Min 27, dual-source the URL — refresh-the-link AND check Settings → Pages where GitHub itself shows "Your site is live at..." with a green Visit-site button.
- [x] **DF4** — Biggest one. Recap was `.gitignored` (privacy decision, locked), so the PM couldn't see it on GitHub and didn't know where to find it on disk — the whole "ready for next build" goal evaporated. Fix: recap is now delivered **inline in the chat as the primary handoff** (full rendered markdown, no abbreviation). File path + reopen command (`open recap.md` / `code recap.md`) given as backup. Privacy default unchanged — file still gitignored. New failure-mode row added: "PM finishes but says 'I don't see the recap' → you skipped step 1, print it inline now."

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

- [ ] **T30 (V2 — architecture)** — Split `SKILL.md` into a slim orchestrator + per-path files. **Current state:** 537 lines in one file after V1.5 (was 345 pre-V1.5). The path-A walkthrough (~85 lines), path-B walkthrough (~75 lines), 3-option picker section (~40 lines), and 2-Q micro-interview (~20 lines) are largely independent — they're co-located in the file mainly because both paths inherit shared rules (voice, reactive glue, multi-choice fallback). **Proposed split:** `SKILL.md` keeps the frontmatter + voice rules + flow diagram + path gate + Min 25–30 (shared). New `path-a.md` and `path-b.md` hold the per-path interviews + per-path picker logic. `SKILL.md` loads the right one based on the path-gate answer. **When to trigger:** as soon as V2 adds a third path or major mode (e.g. T31's guided experience). Splitting earlier is premature; splitting later turns a maintainable file into an illegible one. Surfaced during T23 in the V1.5 build.

- [ ] **T31 (V2 — major direction)** — `/next-build` or `/level-up`: a longer, guided "major experience into Claude Code" that takes the PM beyond the 30-min ship moment into a real working relationship with the tool. /first-build's job is *transmit the feeling* in 30 minutes; T31's job is *teach the craft* in 2–4 hours, tiered by user level. **Examples of what it would cover** (per user's note 2026-05-19): set up a proper project `CLAUDE.md`; introduce tests and how to ask Claude to write them; QA flow via `/qa` or `/qa-only`; when to run `/office-hours` / `/plan-eng-review` / `/plan-ceo-review`; how to talk to Claude Code at the prompt level (file references, scope, intent); iterating safely with commits/branches; what `/ship` does and when to run it. **Tiered by user level of need** — a non-technical PM picking it up after `/first-build` doesn't need the same depth as a technical PM who's done a dozen builds. Possibly supersedes T18 (laddered `/next-build`) — this is closer to a "major guided onboarding into Claude Code and all it can do" than a less-hand-holdy sister to first-build. **Likely needs its own `/office-hours` session to design before any implementation.** Surfaced by the builder mid-V1.5.

## Known V1 risks (from outside voice, accepted)

- Realistic p50 may be 60-75 min on first attempt for PMs without GitHub/gh setup. Opening utterance sets honest expectation ("30 min if you have GitHub set up; 45-60 if you don't").
- The Pages toggle is multi-step on first time; SKILL.md mitigates with bullet-by-bullet instructions.
- Force-fit picks may surprise PMs whose spec doesn't cleanly fit. Recap explains the bend honestly. If pattern emerges, T15 triggers.
