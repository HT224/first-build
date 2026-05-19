# Changelog

All notable changes to this project will be documented here. Format inspired by [Keep a Changelog](https://keepachangelog.com/), versioning follows `MAJOR.MINOR.PATCH.MICRO`.

## [1.5.0] — 2026-05-19

The first shipping release of `/first-build` — a Claude Code skill that takes a non-technical PM from idea (or no idea) to a live GitHub Pages URL in about 30 minutes.

### Added

- **`/first-build` skill** — install via `git clone` + `./setup`, invoke from any folder with `/first-build` in a Claude Code session.
- **Two experience paths**, gated at Min 1.5 with a single fork question:
  - **Path A — "I have an idea"** — 7-question problem interview, force-fit into one of three templates (`internal-tool` / `dashboard` / `prototype`) via `template-picker.md`, bend, deploy.
  - **Path B — "Surprise me"** — 5-question get-to-know-you interview (role / daily tools / weekly annoyance / weekend project / hobby). `person-picker.md` generates 3 personalized build options from the answers; PM picks via text select. A 2-question micro-interview personalizes the deploy with the PM's chosen build name and footer name.
- **Three static-HTML templates**, each working and deployable as-is:
  - `internal-tool` — CRUD form + table view + `localStorage`. Bending surfaces: `fields.json`, `copy.json`, `theme.css`.
  - `dashboard` — Chart.js + narrative + data table, with 3 pre-baked data shapes (time-series, categorical-bar, two-column-table).
  - `prototype` — Multi-page clickable mockup with hash routing and per-page markdown copy.
- **Inline recap delivery** — the exit recap prints inline in the chat as the primary handoff; the file on disk is the backup. `recap.md.tmpl` includes a `<<path>>` placeholder that branches between problem-shaped and person-shaped variants; Path B recaps quote the PM's answers back in a "Here's how I read you" callout.
- **GitHub Pages deploy flow** — manual paste-back URL verification (no `curl` polling), 7-step Pages-toggle bullet list, dual-source URL confirmation (the printed string + GitHub's own "Your site is live at..." display in Settings → Pages).
- **Privacy by default** — `spec.md` and `recap.md` are `.gitignored` in every template. The recap explains the opt-in process if the PM ever wants to publish them.
- **`README.md`** at the project root — GitHub landing page with install onramp, prerequisites, run instructions, and a walkthrough of what to expect.
- **`LICENSE`** — MIT.
- **`VERSION`** — file tracking semver.

### Decisions explicitly locked (do not relitigate)

These were settled during design + engineering review and should stay out of scope for future versions unless real PM feedback contradicts them:

- Three templates only — no fourth, no survey, no automation template in 1.x.
- GitHub Pages only — no Vercel, Cloudflare, or Claude Artifact deploy.
- No telemetry, no Google Form, no "phone home" — the *"did you text a friend within 24h?"* question lives in the recap as prose.
- No CI/CD, no GitHub Actions, no publish pipeline — install is `git clone` + `./setup`.
- Manual paste-back URL verification — no background polling.
- No intent detection on Path B's "Other" — two-strike soft cap (regenerate once, then offer Path A) instead.
- Path B uses runtime LLM generation, not a pre-baked sample gallery.

### Roadmap

- **T31** — A longer guided `/next-build` or `/level-up` skill that takes the PM beyond the 30-min ship moment into a real working relationship with Claude Code. Strictly vanilla Claude Code surface (no third-party skill dependencies). Tiered by user level of need.
- **T30** — Split `SKILL.md` (537 lines) into a slim orchestrator + per-path files (`path-a.md`, `path-b.md`) when V2 adds a third path or major mode.
- **T16** — Classifier eval suite covering both `template-picker.md` and `person-picker.md`, deferred until ~10 real PM specs are available to design eval cases against.

See `TODOS.md` for the full V2 backlog and `docs/design-v1.5.md` for the current design.
