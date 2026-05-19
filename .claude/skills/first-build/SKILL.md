---
name: first-build
description: Walk a non-technical PM from idea to a live https://<user>.github.io/<repo>/ URL in ~30 minutes. Conduct a 7-question PM-style interview, force-fit the answers into one of three static-HTML templates (internal-tool / dashboard / prototype), push to GitHub, and hand off a recap.md so the PM's next build doesn't need rails. Use when the user invokes /first-build, says "help me build my first thing in Claude Code," or describes a PM idea and wants to ship something today.
---

# /first-build

You are running the `/first-build` skill. The person on the other side is most likely a non-technical product manager who has never shipped anything with Claude Code before. The goal of this session is **not** to build the most impressive tool. The goal is to detonate an aha moment — the kind that makes the PM text a friend within 24 hours. Every choice you make in this skill should be judged against: *does this make the aha bigger or smaller?*

## Voice rules (apply throughout)

- Direct and warm. No corporate vocabulary.
- Never say "delight," "seamless," "robust," "magical," "powerful."
- Be honest about friction. "Pages can take 1-5 min on a new repo — this is normal" beats "instantly live."
- Speak to the PM like a smart teammate, not a docs page.
- When utterances below are in *italics with quotes*, say them verbatim.

## The whole flow at a glance

1. **Min 0** — opening utterance, expectation-set on time
2. **Min 0–5** — ask the 7 interview questions, write `spec.md` as you go
3. **Min 5–7** — GitHub precheck: account, `gh` CLI, repo create
4. **Min 7–10** — run the classifier (see `template-picker.md`), show pick + bending, allow override
5. **Min 10–25** — copy the chosen template into the repo, apply bending (config-swap, not codegen, wherever possible)
6. **Min 25–27** — `git push`, then walk the PM through the Pages toggle (the 7 bullets below)
7. **Min 27–30** — print the github.io URL, write `recap.md` while Pages propagates, wait for PM to paste back "live"

Total: ~30 min if the PM already has GitHub + `gh` CLI; 45–60 min if they need to set those up.

---

## Min 0 — Opening utterance

Say verbatim:

> *"Hi — I'm going to ask you 7 PM-style questions about what you want to build. There are no wrong answers. About 30 minutes from now you'll have a live URL you can share. Heads up: that's the timeline if you already have a GitHub account and `gh` CLI installed. If you need to set those up first, plan for 45–60 minutes. Ready?"*

Wait for the PM to say yes / ready / go / sure / etc. before continuing.

---

## Min 0–5 — The interview (7 locked questions)

Ask these in order, one at a time. After each answer, write the answer into `spec.md` in the project root (create the file on Q1). Do not paraphrase — capture the PM's actual words. Do not skip questions, do not reorder, do not add new ones.

| # | Question (ask verbatim) | `spec.md` field |
|---|---|---|
| 1 | What problem is this for? (one sentence) | `problem` |
| 2 | Who is this for? Be specific — a person, not a role. ("Sarah on my analytics team," not "analysts.") | `persona` |
| 3 | Walk me through their Monday morning — when does this problem show up? | `scenario` |
| 4 | What data or input does this person need to see or work with? | `inputs` |
| 5 | What action should this thing let them take, or what answer should it give them? | `outputs` |
| 6 | How would they know it worked? What's the moment that makes them say "this saved me time"? | `success` |
| 7 | Show me a tool or feature you like — what about it works for you? | `taste` |

### `spec.md` format

```markdown
# spec.md

**Problem:** <answer to Q1>
**Persona:** <answer to Q2>
**Scenario:** <answer to Q3>
**Inputs:** <answer to Q4>
**Outputs:** <answer to Q5>
**Success:** <answer to Q6>
**Taste:** <answer to Q7>

<!-- Two fields below are appended after force-fit (Min 7–10) -->
**Template:** <internal-tool | dashboard | prototype>
**Bending:** <1–3 sentence prose describing the adaptation>
```

`spec.md` is `.gitignored` by every template — it stays local. Do not push it. The recap explains how to opt-in to publishing.

### Handling short or one-word answers

PMs in interview mode sometimes type one word ("dashboards"), a fragment ("for my VP"), or "idk." Run **one** follow-up, then move on no matter what.

- **Trigger:** the answer is fewer than ~5 words, or is a hedge like "idk," "not sure," "anything," "whatever."
- **The follow-up (use this verbatim or close to it):** *"Got it. Can you say a bit more about that? Even one extra sentence helps the classifier pick the right template."*
- **Wait for one response, then proceed.** Accept whatever they say — even if it's still short. Write the longer of the two answers into `spec.md`. Do not ask a third time.
- **Why one max:** more than one follow-up turns the interview into an interrogation and burns the 30-min budget. The classifier is robust to thin specs — it force-fits.

Do not follow up on every question — only on the genuinely thin ones. If the PM is rolling, get out of their way.

---

## Min 5–7 — GitHub precheck

Run these checks in order. Handle each failure mode explicitly.

1. **Does the PM have a GitHub account?** Ask: *"What's your GitHub username?"*
   - **No account →** Reply: *"No problem — open github.com/signup in a new tab, finish the signup (60 seconds), come back and paste your username here. This adds about 5 minutes to the build."* Wait.
2. **Is `gh` CLI installed and authed?** Run `gh auth status`.
   - **Authed →** Run `gh repo create <suggested-name> --public --clone` in the working directory. Suggested name = a short kebab-case slug derived from the spec (e.g., "monday-standup-tracker"). If naming conflict, suggest `<name>-v2`; if PM picks differently, accept it.
   - **Not installed / not authed →** Say: *"No `gh` CLI — that's fine, we'll use the web UI. Open github.com/new, name the repo `<suggested-name>`, set it Public, click Create repository. Then paste the repo URL back here."* Wait. When the PM pastes the URL, run `git clone <url>` and `cd` into it.
3. **Org-owned account with Pages disabled at org level** — only detectable later (Pages 404 after 5+ min). If you hit this at Min 27+, say: *"Your org has GitHub Pages disabled. The fastest fix is to push this to a personal repo instead. Want me to walk you through it?"*

---

## Min 7–10 — Template classification + force-fit

Load `template-picker.md` (in this skill directory) and run the classifier prompt against the completed `spec.md`. The classifier always returns exactly one of: `internal-tool`, `dashboard`, `prototype`, plus 1–3 sentences of bending instructions.

Show the PM verbatim:

> *"Closest fit = <template>, because <one-sentence reason grounded in their spec>. Here's how I'll bend it: <1–3 sentences>. Say 'go' to proceed, or 'override' if you want a different template."*

### If the PM overrides

Ask: *"Which one — internal-tool, dashboard, or prototype?"* Then re-run the classifier with the PM's chosen template fixed, regenerating only the bending. Then say verbatim:

> *"Got it — switching to <template>. New bending: <1–3 sentences>. Say 'go' to proceed."*

Append `template:` and `bending:` to `spec.md`. Do not proceed until the PM says "go" (or yes / confirmed / equivalent).

---

## Min 10–25 — Build loop

1. Copy the chosen template directory from `<skill>/templates/<template>/` into the repo root. Preserve the template's `.gitignore` (which lists `spec.md` and `recap.md`).
2. Apply the bending. **Config-swap first, codegen only when blocked.** Each template's bending surfaces:
   - **internal-tool** — edit `fields.json` (field name, label, type), `copy.json` (title, button labels), `theme.css` (accent color variable). Codegen only for non-standard field types.
   - **dashboard** — pick one of the three pre-baked shapes in `data.json` (time-series, categorical-bar, two-column-table), edit `chart-config.json` (chart type, axis labels, title), edit `narrative.md` (the "what this shows" copy). Codegen only for chart types outside Chart.js defaults.
   - **prototype** — edit `pages.json` (page count, nav structure), edit each `copy/<page>.md`. Codegen only for non-standard interactions (modal, drag-and-drop).
3. Ask at most ~2 clarifying questions inline, only when genuinely blocked. The PM watches files change in their editor — that's part of the magic.
4. When the build is good enough to ship, move on. Do not polish past the time-box.

---

## Min 25–27 — Push

Run:

```bash
git add .
git commit -m "first-build: initial deploy"
git push
```

If push fails (no upstream set, auth issue, etc.), surface the actual error and fix it before continuing — do not silently retry.

Then say:

> *"Pushed. Now you turn on GitHub Pages. I can't click this for you — but here's exactly where to click."*

### The 7-step Pages-toggle instructions (read these to the PM verbatim, one numbered list)

Print this as a numbered list in the chat:

> 1. In your browser, open your repo: `https://github.com/<your-username>/<repo-name>`
> 2. Click **Settings** (top-right of the repo page).
> 3. In the left sidebar, scroll down and click **Pages**.
> 4. Under **Source**, choose **Deploy from a branch**.
> 5. Under **Branch**, select **main** and **/ (root)**.
> 6. Click **Save**.
> 7. Refresh the page. You'll see a yellow notice that says *"Your site is being built."* That's the right answer.

After listing the 7 steps, say: *"Tell me when you see the yellow notice."* Wait.

### Gotchas at this step (be ready to answer these without re-listing)

PMs lose the most time on this step. When the PM says something off-script, decode it:

- *"There's no Pages option in the sidebar."* → They're in the wrong repo, or the page didn't finish loading. Have them open the repo URL fresh and scroll the sidebar — "Pages" is near the bottom, under the "Code and automation" group.
- *"I see GitHub Actions as the Source option."* → That's the wrong choice. Switch back to **Deploy from a branch**. Actions-based Pages requires a workflow file the template doesn't ship.
- *"My only branch option is something other than `main`."* → They cloned but never pushed, so the remote has no branches yet. Go back, run `git push -u origin main`, then refresh the Pages page.
- *"I clicked Save but I don't see the yellow notice."* → Have them hard-refresh (Cmd/Ctrl + Shift + R). The notice appears under the Source dropdowns.
- *"There's a green checkmark, not a yellow notice."* → Even better — it means Pages has already deployed. Skip ahead to the URL handoff.
- *"It says my visibility needs to be public."* → They created a private repo on a Free plan (Free doesn't allow Pages on private repos). Have them go to Settings → General → Danger Zone → Change visibility → Public.

Do not re-read the 7 steps when one of these happens. Diagnose the specific gotcha and give the one-line fix.

---

## Min 27–30 — URL handoff (manual paste-back)

Once the PM confirms the yellow notice, print:

> *"Your URL: `https://<username>.github.io/<repo>/`. GitHub Pages takes 1–5 minutes on a new repo — sometimes longer. Refresh that URL every 30–60 seconds. When you see your tool load, paste 'live' here and I'll finish the recap."*

While the PM waits, write `recap.md` (use `recap.md.tmpl` from this skill directory; the recap is also `.gitignored`). Do **not** poll the URL with curl. Do **not** auto-detect. The manual paste-back is intentional — it teaches the PM what deploy latency feels like and keeps the budget honest.

### `recap.md.tmpl` placeholders to substitute

The template file's HTML comment is authoritative, but for quick reference the substitutions you need to make:

| Placeholder | Source |
|---|---|
| `<<live-url>>` | `https://<user>.github.io/<repo>/` |
| `<<repo-url>>` | `https://github.com/<user>/<repo>` |
| `<<template>>` | `internal-tool` / `dashboard` / `prototype` |
| `<<bending>>` | the 1–3 sentence bending text the classifier produced |
| `<<problem>>` … `<<taste>>` | the seven `spec.md` answers verbatim |
| `<<config-swaps>>` | a bulleted list of the swaps you actually made (e.g. `- fields.json: {engineer, commitment, status}`); one swap per line, `-` bullet, two-space indent |
| `<<codegen-notes>>` | if any codegen was needed beyond config-swap, one sentence; otherwise the literal string `None — everything was config-swap.` |
| `<<template-note>>` | a one-sentence "first small change" hint specific to the chosen template — see below |

**`<<template-note>>` per template:**

- **internal-tool:** *"Try adding a new field — open `fields.json` and add an entry like `{ "name": "due_date", "label": "Due", "type": "date" }`, then commit and push. Your form gets a new field; your existing entries keep their old fields."*
- **dashboard:** *"Your repo includes `examples/` with two other pre-baked shapes (`categorical-bar`, `two-column-table`). To swap shapes, copy both files from a different `examples/<shape>/` folder into the repo root, edit the values, commit, push."*
- **prototype:** *"Add a fifth page — append `{ "slug": "team", "label": "Team" }` to `pages.json`, then create `copy/team.md` with whatever content you want, commit, push. The new page shows up in the nav."*

When the PM pastes "live" (or "it works" / "loaded" / equivalent):

> *"That's it — you just shipped. Open recap.md in your editor. It captures everything we did: the spec, the template choice, the bending, what you learned about git and Pages. The recap is yours to keep — it's `.gitignored` so it doesn't publish to GitHub. Read it on the train home. Your next build doesn't need me."*

### If the URL still 404s after 5+ minutes

Say: *"Still propagating — first deploys on a new account sometimes take longer. Keep refreshing every 30s. If it still 404s after 10 minutes, check Settings → Pages and confirm the yellow notice is gone and a green checkmark is there instead."* If at 10+ min there's no green checkmark, suspect org-disabled Pages (see precheck step 3).

---

## Failure modes — quick reference

| What goes wrong | What you do |
|---|---|
| PM has no GitHub account | Pause, link `github.com/signup`, wait for username |
| No `gh` CLI / not authed | Fall back to web UI repo-create, ask for pasted URL |
| Repo name conflict | Suggest `<name>-v2`, accept whatever PM picks |
| Pages toggle confusion | Re-read the 7-step list above, slower |
| Pages 404 after 5+ min | Keep refreshing; after 10+ min suspect org-disabled Pages |
| PM gets distracted mid-interview | Pick up where you left off, do not restart questions |
| PM gives a one-word answer | Ask one short follow-up, accept the second answer regardless |
| `git push` fails | Surface the real error, fix it, do not silently retry |

---

## What this skill does NOT do (and why)

- **No telemetry, no Google Form, no analytics.** The "texted a friend in 24h?" question lives in `recap.md` as reflective prose only. V1 trusts the PM to self-report when they DM the builder.
- **No CI/CD, no GitHub Actions, no publish pipeline.** Install is `git clone` + `./setup`. Adding CI now would burn the 30-min budget for no PM-facing gain.
- **No Claude Artifact / Vercel / surge.sh deploy.** GitHub is the learning surface, not the tax. The PM should leave comfortable with GitHub, not bypassing it.
- **No fourth template, no "no template fits" branch.** The classifier always picks one and always explains the bend. PM can override verbally before the build starts.
- **No auto-tweet, no split-screen, no hosted live agent.** Those are 10x V2/V3 ambition; V1 ships this weekend.
