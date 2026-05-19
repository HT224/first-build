# first-build

**A Claude Code skill that takes a non-technical PM from idea — or no idea — to a live URL in about 30 minutes.**

You install one skill, run one command, answer a handful of questions, and end up with a live thing on the internet at `https://<your-username>.github.io/<your-repo>/`. Something you can DM to a friend and have them open on their phone. The goal isn't to ship the most impressive tool — it's the aha moment.

There are two ways in:

| If you have… | Pick this path | What you'll do |
|---|---|---|
| A specific build in mind | **"I have an idea"** | Answer 7 short questions about the problem. The skill picks one of three templates and bends it to your spec. |
| No idea, but you're curious | **"Surprise me"** | Answer 5 short questions about *you* (your role, what bugs you, what you'd build for fun). The skill pitches 3 personalized options and you pick one. |

Either way, same three templates (a CRUD tool, a chart dashboard, or a clickable mockup), same deploy to GitHub Pages, same takeaway: a working URL plus a recap that explains what just happened so your next build doesn't need this skill at all.

---

## Why this exists

I'm a PM. I hit the aha moment when I figured out how to build real things with Claude Code, and I want other non-technical PMs to feel that same thing — but on a schedule. 30 minutes from "I have Claude Code installed" to "my coworker just opened my tool on their phone."

This skill is the rail. The recap is the take-home. After one run, you should be able to do your second build without me.

---

## Honest expectations

- **~30 minutes** if you already have GitHub set up and the `gh` CLI authed.
- **45–60 minutes** if you need to set GitHub up first.
- GitHub Pages takes 1–5 minutes to propagate after you turn it on. That's normal, not broken.
- The skill **cannot click the "enable Pages" toggle for you**. That click stays in your hands — it's part of how you learn what's happening.
- Each run creates a real public GitHub repo on your account. If you want to clean them up later, `gh repo delete <user>/<repo>` works.

---

## What you'll need

You need these installed and ready before you start. None of them cost money.

1. **Claude Code** — Anthropic's CLI. If you don't have it yet, follow Anthropic's install guide at <https://docs.claude.com/en/docs/claude-code/overview>. Come back when typing `claude` in your terminal opens it.
2. **git** — comes with macOS by default. On Windows install via <https://git-scm.com/downloads>. Verify with `git --version`.
3. **A GitHub account** — sign up at <https://github.com/signup> if you don't have one. Free is fine.
4. **The `gh` CLI** (optional but recommended) — <https://cli.github.com>. Install it, then run `gh auth login` once. If you skip this, the skill falls back to creating your repo via github.com's web UI; that's ~2–3 extra minutes per build.

If anything in (3) or (4) is missing, the skill will detect it and walk you through the fallback. Only Claude Code itself is a hard requirement.

---

## Install

Open a terminal. Run:

```bash
git clone https://github.com/HT224/first-build.git
cd first-build
./setup
```

The `setup` script creates a symlink at `~/.claude/skills/first-build/` pointing back at this folder. That's how Claude Code finds the skill.

After it finishes, restart any open Claude Code sessions so the skill is picked up.

To upgrade later, `cd` back into this folder and `git pull`. The symlink already points here, so updates are live immediately — no need to re-run `setup`.

---

## Run it

Make a new, empty folder for your first project, open a terminal there, start Claude Code, and type the skill name:

```bash
mkdir ~/my-first-build
cd ~/my-first-build
claude
```

Then in the Claude Code session:

```
/first-build
```

The first thing you'll see is the skill introducing itself — what Claude Code is (vs. Claude Desktop or claude.ai), and a quick preview of the next 30 minutes. Read that, say "ready" (or "yes" or "go"), and you're off.

After the intro, the skill asks one fork question:

> *"Do you have a specific build in mind, or would you rather I figure out what to build based on a few questions about you?"*

Pick **"I have an idea"** for the 7-question problem interview. Pick **"Surprise me"** for the 5-question get-to-know-you path. Either path takes about the same time.

The rest of the flow:

1. **GitHub gate** (~30 sec) — confirm your username, the skill handles the rest.
2. **Interview** (~5 min) — answer the questions in your own words. Don't worry about getting the wording exactly right; the skill shows examples for each question and offers options if you're stuck.
3. **Template + bending** (~3 min) — the skill picks the right template (or pitches 3 options if you're on Path B) and tells you exactly how it'll adapt it. You confirm or override.
4. **Build** (~12–15 min) — the skill writes the code. Your editor will show files changing. That's the magic. You can watch.
5. **Push + Pages** (~3 min) — `git push` happens, then the skill walks you through enabling GitHub Pages with a 7-step click-by-click list.
6. **Live URL + recap** (~3 min) — you'll see the URL, refresh it until your tool loads, and the skill prints a recap right in the chat: what you built, what you just learned about GitHub, and what to try next.

---

## What ends up on your computer

After a build, your project folder will contain:

- The template files (HTML/CSS/JS/JSON) that became your live site. These are public — pushed to your GitHub repo.
- `spec.md` — your interview answers. **Local only, gitignored by default** so you don't accidentally publish a coworker's name or your employer's internal details.
- `recap.md` — the exit memo: what you built, what you just learned about GitHub, and what to try next. **Also local only, gitignored by default.**
- A `.gitignore` that keeps `spec.md` and `recap.md` out of GitHub.

The recap explains how to opt-in to publishing either file later if you want to (e.g., to share the recap as a blog post).

---

## What you'll learn (and why we did it this way)

The skill walks you through GitHub on purpose, even though other tools could "deploy for you" with one click. Reason: by the end of this run, you'll have actually used `git push`, you'll have toggled GitHub Pages with your own hands, and you'll know what a `commit` is. The next time you have an idea on a Tuesday afternoon, you'll be able to open a folder, run `git init`, write some HTML, `git push`, toggle Pages — without needing this skill at all.

The recap names every concept you touched (repo, commit, push, Pages, propagation) in plain language. Read it once. The vocabulary sticks.

---

## When something goes wrong

The skill handles the common failure modes inline — no GitHub account, `gh` not installed, repo name conflict, Pages toggle confusion, Pages taking longer than 5 min to propagate, organization-owned Pages disabled. If you hit any of those, the skill will diagnose it and tell you what to do.

For things it can't recover from:

- **It got stuck mid-interview.** Tell it where you were. It picks back up — it doesn't restart.
- **`git push` failed.** It'll surface the real error. Usually it's an auth issue: `gh auth login` again, or set a personal access token.
- **The URL 404s after 10+ minutes.** Open `Settings → Pages` in your repo and check for a green checkmark. If there's a red error, your GitHub account's organization may have Pages disabled — create a personal account / repo instead and rerun the skill there.
- **You want to bail out.** Close Claude Code. Your `spec.md` is saved. You can re-run `/first-build` later — it'll pick up the spec if you re-run in the same folder.

For deeper troubleshooting or to read the full skill internals, see [.claude/skills/first-build/README.md](./.claude/skills/first-build/README.md).

---

## Privacy

- **No telemetry.** Nothing about your run is sent to Anthropic, to this skill's author, or anywhere else. There is no Google Form, no analytics, no "phone home."
- **No publishing your spec or recap by default.** Both files are gitignored by every template. They live on your laptop only. The recap explains how to opt-in if you ever want to publish them.
- **No automatic deployment.** The skill never clicks the GitHub Pages toggle for you. That click stays in your hands so you learn what's happening.
- **Each build creates a public GitHub repo.** Pages requires a public repo on Free plans, so by default your code (but not your spec or recap) is publicly readable on GitHub. If you only want to ship a private demo, the skill can't help with that today.

The recap includes one reflective question — *"did you text a friend within 24 hours about what you just built?"* — as prose only. No link, no form. It's a quiet self-test, not a metric.

---

## What this skill does NOT do (and why)

- **No "deploy for you" via Vercel, Cloudflare, or Claude Artifacts.** GitHub is the learning surface, not the tax. The friction is the lesson.
- **No CI/CD, no GitHub Actions, no publish pipeline.** Install is `git clone` + `./setup`. Nothing fancier.
- **No fourth template, no "no template fits" branch.** Three templates, force-fit always. The classifier picks one and explains the bend.
- **No background URL polling.** You refresh the URL yourself. That's how you learn what Pages propagation feels like.

---

## Roadmap

The current shipping version covers three templates (CRUD tool, dashboard, clickable prototype) and two paths (problem-shaped, person-shaped) through one skill (`/first-build`).

On the table for what comes next, depending on what real PMs hit when they run this:

- A `/next-build` or `/level-up` skill that takes the PM beyond first-build's 30-minute ship moment into a real working relationship with Claude Code — building something more functional and robust, authoring a proper project `CLAUDE.md`, adding tests and asking Claude to write them, learning to QA your own work, customizing Claude Code via `settings.json`, writing your own skills, and the broader Claude Code surface. Strictly vanilla Claude Code — no third-party skill dependencies. Tiered by user level of need.
- Survey and automation templates.
- A classifier eval suite once we have ~10 real specs to train against.

See [`TODOS.md`](./TODOS.md) for the full backlog and [`docs/design-v1.5.md`](./docs/design-v1.5.md) for the current design.

---

## Contributing

If you ran the skill and have feedback, please open an issue at <https://github.com/HT224/first-build/issues>. Especially helpful:

- The classifier or option generator picked something weird for your spec.
- The GitHub Pages instructions got you confused.
- You couldn't finish in the time-box.
- The recap landed flat (or hit different than you expected).

Pull requests are welcome, but please open an issue first to align on whether a change is V1.5 or V2 scope. Several decisions are deliberately locked — no telemetry, no Artifact-style deploy, no CI/CD, no 4th template, GitHub Pages only. See [`docs/design.md`](./docs/design.md) and [`docs/design-v1.5.md`](./docs/design-v1.5.md) for the reasoning.

---

## License

MIT.

---

*Built by [@HT224](https://github.com/HT224) — a PM who recently hit the vibe-coding aha moment and wants to detonate the same moment for other PMs.*
