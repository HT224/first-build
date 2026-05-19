# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project context

**What this is:** A Claude Code skill called `/first-build` that walks a non-technical product manager from "I have an idea" to a live `https://<user>.github.io/<repo>/` URL in ~30 minutes. The skill ships in this repo (`github.com/HT224/first-build`). Install path = `git clone` + a small `setup` script that symlinks into `~/.claude/skills/first-build/`.

**Who it's for:** Non-technical PMs who just installed Claude Code and have never successfully shipped anything with it. The builder of this project IS the target user — they hit the vibe-coding aha moment recently and want to detonate the same moment for other PMs.

**The core framing (most important sentence in the whole project):** *Transmit a feeling, not a tool.* The aha moment IS the product. Success metric isn't "tools shipped," it's *"did the PM text a friend within 24 hours."* Every V1 decision is judged: does this make the aha bigger or smaller?

**The secondary goal:** Leave the PM **comfortable with using GitHub** (not bypassing it). The friction of git/gh/Pages-toggle is part of the *learning*, not a bug to engineer around. The recap.md tells the PM what they just learned about deployment so their next build doesn't need rails.

### Load-bearing decisions (do NOT relitigate)

These were locked through /office-hours + /plan-eng-review (2026-05-18). Each is in `docs/design.md` with full context.

- **V1 ships as a standalone Claude Code skill `/first-build`** — no gstack admin gates, no preamble bash, no telemetry, no decision-brief AskUserQuestions. PM-facing product, not gstack ecosystem citizen.
- **No gstack dependency.** PMs install just Claude Code + git (+ optional `gh` CLI). They do not need gstack.
- **Deploy target = GitHub Pages.** Not Claude Artifacts, not Vercel, not surge.sh. GitHub is the learning surface, not the tax. Manual paste-back for URL verification — no Bash curl polling.
- **3 templates with force-fit classifier:** `internal-tool` (HTML + localStorage CRUD), `dashboard` (HTML + Chart.js + pre-baked data shapes), `prototype` (multi-page clickable HTML). Classifier always picks one, never dead-ends. PM can override.
- **7 locked interview questions** (problem, persona, scenario, inputs, outputs, success, taste) → `spec.md`. See `docs/design.md`.
- **`spec.md` + `recap.md` are `.gitignored` by default** in every template — protects PMs against accidentally publishing employer names, internal product strategy, customer names. Recap explains how to opt-in to publishing.
- **Realistic time-box messaging:** opening utterance is "30 min if you have GitHub + gh CLI set up; 45-60 if you need to set those up first." Honest over magical.
- **V1 ships with NO telemetry / no Google Form.** The "texted a friend in 24h?" question lives in `recap.md` as reflective prose only.

### Decided AGAINST (do NOT propose these again — they were considered and rejected)

- ❌ Claude Artifact deployment — required manual claude.ai paste handoff, defeats the GitHub-comfort goal.
- ❌ 0 templates (let Claude generate per spec) — drops anchoring; user explicitly rejected.
- ❌ 5 templates — cut to 3 for Saturday shippability (survey + automation deferred to V2).
- ❌ CI/CD pipeline in V1 — install is `git clone`, no publish step.
- ❌ Committing `spec.md` / `recap.md` publicly by default — privacy risk.
- ❌ Bash `curl` loop to auto-detect URL live — burns tokens, manual paste is bulletproof.
- ❌ Classifier eval suite in V1 — deferred to V2; first 3 DM'd PMs are V1's classifier QA.
- ❌ Hosted live-agent / split-screen / auto-tweet — 10x version, V2/V3 ambition.
- ❌ Following gstack-skill conventions (preamble bash, AUQ decision briefs, telemetry log) — kills the 30-min budget.

### Voice for PM-facing strings

- Direct, warm, no corporate. PMs notice tone.
- Honest about friction ("Pages can take 1-5 min on first deploy — this is normal").
- Never marketing-shaped. Never "delight," "seamless," "robust."
- The opening, closing, override, and post-deploy utterances are written verbatim in `docs/design.md` — use them as-is unless the user changes them.
- The recap should sound like a smart teammate explaining what just happened, not a Stripe docs page.

## How to resume on a fresh session

1. You've already read `CLAUDE.md`.
2. Read `docs/design.md` (the full design doc, status APPROVED).
3. Read `docs/tasks.jsonl` (12 implementation tasks, T1-T12).
4. Read `TODOS.md` for V1-followup + V2 backlog context.
5. Run `git log --oneline` to see what's already shipped.
6. Pick the lowest-numbered task in `docs/tasks.jsonl` that doesn't have a matching commit, and start there.
7. After each task, commit with `git commit -m "<task-id>: <one-line>"` and `git push`.

When V1 is built, run `/ship` for the release commit + tag.

## Commands

- `git push` — push current branch to `origin/main` (set up; no `-u` needed)
- `git log --oneline` — see what's already shipped
- `gh repo view --web` — open the live repo at github.com/HT224/first-build
- `bash setup` — symlink the skill into `~/.claude/skills/first-build/` (after the skill files are written)

## gstack

For all web browsing in this project, use the `/browse` skill from gstack. Never use `mcp__claude-in-chrome__*` tools.

Available gstack skills:

- `/office-hours`
- `/plan-ceo-review`
- `/plan-eng-review`
- `/plan-design-review`
- `/design-consultation`
- `/design-shotgun`
- `/design-html`
- `/review`
- `/ship`
- `/land-and-deploy`
- `/canary`
- `/benchmark`
- `/browse`
- `/connect-chrome`
- `/qa`
- `/qa-only`
- `/design-review`
- `/setup-browser-cookies`
- `/setup-deploy`
- `/setup-gbrain`
- `/retro`
- `/investigate`
- `/document-release`
- `/document-generate`
- `/codex`
- `/cso`
- `/autoplan`
- `/plan-devex-review`
- `/devex-review`
- `/careful`
- `/freeze`
- `/guard`
- `/unfreeze`
- `/gstack-upgrade`
- `/learn`

## Skill routing

When the user's request matches an available skill, invoke it via the Skill tool. When in doubt, invoke the skill.

Key routing rules:
- Product ideas/brainstorming → invoke /office-hours
- Strategy/scope → invoke /plan-ceo-review
- Architecture → invoke /plan-eng-review
- Design system/plan review → invoke /design-consultation or /plan-design-review
- Full review pipeline → invoke /autoplan
- Bugs/errors → invoke /investigate
- QA/testing site behavior → invoke /qa or /qa-only
- Code review/diff check → invoke /review
- Visual polish → invoke /design-review
- Ship/deploy/PR → invoke /ship or /land-and-deploy
- Save progress → invoke /context-save
- Resume context → invoke /context-restore
