# /first-build

**A Claude Code skill that walks a non-technical PM from "I have an idea" to a live `https://<you>.github.io/<repo>/` URL in about 30 minutes.**

You answer 7 PM-style interview questions. The skill picks one of three static-HTML templates (internal tool, dashboard, or clickable prototype), bends it to your spec, pushes it to GitHub, and walks you through enabling GitHub Pages. You leave with a working URL you can DM to a friend — and a `recap.md` that explains what just happened, so your next build doesn't need the rails.

The goal isn't to ship the most impressive tool. The goal is the aha moment.

---

## Honest expectations

- **~30 minutes** if you already have a GitHub account, `git` installed, and the `gh` CLI authed.
- **45–60 minutes** if you need to set those up first.
- GitHub Pages takes 1–5 minutes to propagate after you enable it on a new repo. That's normal, not broken.
- The skill cannot click the "enable Pages" toggle for you. You'll click it in your browser. That's part of the learning.

---

## Prerequisites

You need these installed and ready before you start:

1. **Claude Code** — the CLI from Anthropic. If you don't have it yet, follow Anthropic's install guide: <https://docs.claude.com/en/docs/claude-code/overview>. Come back when `claude` runs in your terminal.
2. **git** — comes with macOS by default; on Windows install via <https://git-scm.com/downloads>. Verify with `git --version`.
3. **A GitHub account** — sign up at <https://github.com/signup> if you don't have one. Free is fine.
4. **The `gh` CLI** (optional but recommended) — <https://cli.github.com>. Install it, then run `gh auth login` once and follow the prompts. If you skip this, the skill falls back to creating the repo via github.com's web UI; that's ~2–3 extra minutes per build.

If any of the optional pieces are missing, the skill will detect it and walk you through the fallback. Nothing here is a hard blocker except Claude Code itself.

---

## Install

```bash
git clone https://github.com/HT224/first-build.git
cd first-build
./setup
```

The `setup` script symlinks this repo into `~/.claude/skills/first-build/`, which is where Claude Code looks for installed skills. After it finishes, restart any open Claude Code sessions so the skill is picked up.

To upgrade later, `cd` into this folder and `git pull`. The symlink already points at this directory, so the update is live immediately — no re-run of `setup` needed.

---

## Run it

In a new, empty folder where you want your project to live (e.g. `mkdir ~/code/my-first-build && cd ~/code/my-first-build`), start Claude Code:

```bash
claude
```

Then type:

```
/first-build
```

The skill takes it from there. The first thing it'll say is roughly:

> *"Hi — I'm going to ask you 7 PM-style questions about what you want to build. There are no wrong answers. About 30 minutes from now you'll have a live URL you can share."*

Answer the questions in your own words. The skill writes a `spec.md` as you go. After question 7, it picks a template, shows you the bending plan, asks for your "go," builds, pushes, and walks you through enabling Pages. At the end you'll have a live URL and a `recap.md`.

---

## What ends up on your computer

After a build, your project folder will contain:

- The template files (HTML / CSS / JS / JSON) that became your live site.
- `spec.md` — the structured answers to the 7 interview questions. **Local only, gitignored by default** so you don't accidentally publish customer or employer names.
- `recap.md` — the exit memo: what you built, the bending applied, what you just learned about GitHub, and what to try next. **Also local only, gitignored by default.**
- A `.gitignore` that keeps those two files out of GitHub.

The recap explains how to opt-in to publishing either file later if you want to.

---

## When something goes wrong

The skill handles the common failure modes inline (no GitHub account, `gh` not installed, repo name conflict, Pages toggle confusion, Pages propagation > 5 min, org-disabled Pages). If you hit something it doesn't recover from:

- **It got stuck mid-interview.** Tell it where you were. It picks back up; it doesn't restart.
- **`git push` failed.** It'll surface the real error. Usually it's an auth issue — `gh auth login` again, or set a personal access token.
- **The URL 404s after 10+ minutes.** Open `Settings → Pages` in your repo and check for a green checkmark. If there's a red error, your GitHub account's organization may have Pages disabled — create a personal repo instead and rerun the skill there.
- **You want to bail out.** Close Claude Code. Your `spec.md` is saved. You can re-run `/first-build` later — it'll pick up the spec if you re-run in the same folder.

---

## Privacy & what this skill does NOT do

- **No telemetry.** Nothing about your run is sent to Anthropic, to this skill's author, or anywhere else. There is no Google Form, no analytics, no "phone home."
- **No publishing your spec or recap by default.** `spec.md` and `recap.md` are gitignored by every template. They live on your laptop only.
- **No automatic deployment.** The skill never clicks the GitHub Pages toggle for you. That click stays in your hands so you learn what's happening.
- **No bypassing GitHub.** Some skills deploy to Vercel or Claude Artifacts to skip the GitHub friction. This one doesn't, on purpose — the friction is the learning. By the end you'll be comfortable enough with `git` and Pages to do a build #2 alone.

The `recap.md` includes a reflective question — *"did you text a friend within 24 hours about what you just built?"* — as prose only. No link, no form. It's a quiet self-test, not a metric.

---

## Roadmap

V1 ships three templates (internal-tool, dashboard, prototype) and a single skill (`/first-build`). On the table for V2, depending on what shows up when real PMs run this:

- A sister `/next-build` skill that's intentionally less hand-holdy (validates whether the recap created standalone capability).
- "Glass-box" mode that surfaces the skill's own prompts so PMs can fork and adapt them.
- Survey and automation templates (V1 force-fits both into prototype today).
- A classifier eval suite once we have ~10 real specs to train against.

---

## Contributing

V1 is intentionally small. If you ran the skill and have feedback, please open an issue at <https://github.com/HT224/first-build/issues> — especially if the classifier picked a weird template for your spec, the Pages toggle instructions got you confused, or you couldn't finish in the time-box.

Pull requests are welcome, but please open an issue first to align on whether a change is V1 or V2 scope. Several decisions are deliberately locked (no telemetry, no Claude Artifact deploy, no CI/CD, no 4th template, GitHub Pages only) — see `docs/design.md` for context.

---

## License

MIT.

---

*Built by [@HT224](https://github.com/HT224) — a PM who recently hit the vibe-coding aha moment and wants to detonate the same moment for other PMs.*
