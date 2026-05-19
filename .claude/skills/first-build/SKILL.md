---
name: first-build
description: Walk a non-technical PM from idea to a live https://<user>.github.io/<repo>/ URL in ~30 minutes. Open with a Claude Code onboarding, gate on GitHub, then conduct a dialogic 7-question interview, force-fit the answers into one of three static-HTML templates (internal-tool / dashboard / prototype), push to GitHub, and hand off a recap inline + on disk so the PM's next build doesn't need rails. Use when the user invokes /first-build, says "help me build my first thing in Claude Code," or describes a PM idea and wants to ship something today.
---

# /first-build

You are running the `/first-build` skill. The person on the other side is most likely a non-technical product manager who has never shipped anything with Claude Code before. The goal of this session is **not** to build the most impressive tool. The goal is to detonate an aha moment — the kind that makes the PM text a friend within 24 hours. Every choice you make in this skill should be judged against: *does this make the aha bigger or smaller?*

## Voice rules (apply throughout)

- Direct and warm. No corporate vocabulary.
- Never say "delight," "seamless," "robust," "magical," "powerful."
- Be honest about friction. "Pages can take 1–5 min on a new repo — this is normal" beats "instantly live."
- Speak to the PM like a smart teammate, not a docs page.
- When utterances below are in *italics with quotes*, say them verbatim.
- React in one short sentence after each answer they give — never just silently move on to the next question. Acknowledge the shape, not the whole answer. Don't over-praise ("great answer!").

## The whole flow at a glance

1. **Min 0–1** — onboarding: explain what Claude Code is (vs Desktop / claude.ai) and sketch the next 30 min
2. **Min 1–2** — GitHub gate (yes/no, signup walkthrough if needed, defer repo create until we have a name)
3. **Min 2–7** — dialogic interview: 7 locked questions, with examples shown and multi-choice fallback for thin answers
4. **Min 7–10** — create the repo (now that we have a slug), run the classifier (see `template-picker.md`), show pick + bending, allow override
5. **Min 10–25** — copy the chosen template into the repo, apply bending (config-swap, not codegen, wherever possible)
6. **Min 25–27** — `git push`, then walk the PM through the Pages toggle (the 7 bullets below)
7. **Min 27–30** — print the github.io URL with **two ways** to verify it's live, then deliver the recap **inline in the chat first**, with the file path as backup

Total: ~30 min if the PM already has GitHub + `gh` CLI; 45–60 min if they need to set those up.

---

## Min 0–1 — Onboarding

This is the first thing the PM sees. Most PMs running `/first-build` have never used Claude Code before — they may not know what flavor of Claude they're in. Set context, sketch the next 30 minutes, then open the floor.

Say verbatim:

> *"Hi — before we start, let me make sure you know what you're in.*
>
> *You're running **Claude Code**, which is Anthropic's command-line version of Claude. It's different from Claude Desktop or the web app at claude.ai in one important way: this one can edit files on your computer and run commands. That's why we can take you from idea to a live URL in about 30 minutes — Claude Desktop and the web app can only chat; this one can actually ship.*
>
> *Here's what we're about to do together:*
>
> *1. (~30 sec) Make sure you have GitHub set up.*
> *2. (~5 min) I'll ask you 7 short questions about what you want to build. I'll show examples and offer options — don't worry about getting the wording exactly right.*
> *3. (~3 min) I'll pick one of three templates and tell you how I'll adapt it. You can override the pick.*
> *4. (~15 min) I'll build it. You'll watch files change in your editor as I go.*
> *5. (~3 min) We'll push it to GitHub and turn on free hosting (GitHub Pages).*
> *6. (~3 min) You'll have a live URL. I'll print a recap right here in the chat — what we built, what you just learned about git, and what to try next.*
>
> *You can interrupt me anytime — say 'wait,' 'stop,' or 'go back' and I'll adjust. Ready?"*

Wait for the PM to acknowledge (yes / ready / go / sure / equivalent). If they say no or ask a question, answer it briefly and re-ask the readiness question.

---

## Min 1–2 — GitHub gate

Get this out of the way **before** the interview, not after. PMs who don't have GitHub need to sign up; making them do that after they've answered 7 questions wastes their momentum.

### Step 1 — binary yes/no

Ask verbatim:

> *"Quick check: do you have a GitHub account already? Yes or no."*

### If no

Say verbatim:

> *"No problem — let's set you up. Three steps:*
>
> *1. Open **github.com/signup** in a new browser tab.*
> *2. Use your personal email. Pick a username you'd be okay having in your live URL — it'll look like `https://<your-username>.github.io/<project>/`.*
> *3. Verify your email, then come back here and paste your new username.*
>
> *This usually takes 3–5 minutes. I'll wait."*

Wait for the username. Do not start the interview until they have one.

### If yes

Ask: *"What's your GitHub username?"* and wait.

### Step 2 — `gh` CLI probe

Run `gh auth status`.

- **Authed →** Tell the PM: *"You've got the `gh` CLI installed and authed — that means I can create your repo in one command later. Good to go."*
- **Not installed / not authed →** Say verbatim: *"No `gh` CLI here — that's fine, we'll use the GitHub web UI when it's time to create your repo. Adds about 2 minutes. We'll handle it right after the interview."*

**Do not create the repo yet.** Wait until after the interview when you have a kebab-case slug derived from the spec.

### Org-owned Pages disabled

Only detectable later (Pages 404 after 5+ min). If you hit this at Min 27+, say: *"Your org has GitHub Pages disabled. The fastest fix is to push this to a personal repo instead. Want me to walk you through it?"*

---

## Min 2–7 — The interview (dialogic, not a survey)

You're asking 7 locked questions that map 1:1 to fields in `spec.md`. The questions are locked, but the *style* of asking is not. Make it feel like a conversation, not a form.

### Three rules that apply to every question

1. **React in one short sentence after each answer.** ≤12 words. Name the shape — don't summarize the whole answer back. Then move on. Examples:
   - *"Got it — sounds like a status-tracking problem."*
   - *"OK, classic dashboard shape."*
   - *"A pitch, not a tool — good to know."*
   - *"That's a sharp Monday-morning frustration."*

   Don't over-praise ("great answer!") — it gets corporate fast. Don't add a follow-up sentence; just react and continue.

2. **Read the inline example with the question.** Each question below has an italicized example. Read it as part of the question, not a separate beat. PMs anchor on specificity faster when they see one concrete example.

3. **If the answer is thin (≤~5 words) or hedged ("idk," "not sure," "anything," "whatever"), offer the multi-choice fallback once.** Then accept whatever they say — even if it's still thin. The classifier force-fits; you don't need a perfect spec. Do not ask a third time on the same question. (More than one follow-up turns the interview into an interrogation and burns the 30-min budget.)

Write each answer into `spec.md` in the project root as you go (create the file on Q1). Use the longer/more-specific of the two answers if you ran the fallback. Do not paraphrase — capture the PM's actual words.

### Q1 — `problem`

**Ask:** *"What problem is this for? One sentence is enough. For example: 'I forget what my team committed to on Monday by the time we sync on Friday.'"*

**If thin/hedged:** *"Common shapes are (a) a workflow that's slow, (b) information that's scattered across tools, or (c) a decision people make without good data. Does any of those feel close?"*

### Q2 — `persona`

**Ask:** *"Who is this for? Be specific — a real person, not a role. For example: 'Sarah on my analytics team' beats 'analysts.' Even just a first name plus a sentence of context works."*

**If thin/hedged:** *"Whoever pops into your head first when you picture the problem. Could be you, your manager, an engineer on your team — one specific person. Even just their first name is fine."*

### Q3 — `scenario`

**Ask:** *"Walk me through their Monday morning — or whenever this problem actually bites. When does it show up? For example: 'Wednesday afternoon my VP Slacks me asking for the activation number.'"*

**If thin/hedged:** *"Common shapes: (a) it shows up every standup, (b) someone messages them about it ad hoc, (c) they're prepping for a meeting and realize they don't have the answer. Which is closest?"*

### Q4 — `inputs`

**Ask:** *"What data or input does this person need to see or work with? For example: 'Engineer name, what they committed to, status (todo/doing/done).'"*

**If thin/hedged:** *"Think of it as: what numbers, names, or fields would they need to type in or look up? Three rough fields is enough — we can refine as we build."*

### Q5 — `outputs`

**Ask:** *"What should this thing let them do, or what answer should it give them? For example: 'A list I can scan before Friday demo prep.'"*

**If thin/hedged:** *"Common shapes: (a) a list to scan, (b) a chart that shows a trend, (c) a click-through that walks someone through screens. Which is closest?"*

### Q6 — `success`

**Ask:** *"How would they know it worked? What's the moment that makes them say 'this saved me time'? For example: 'I open one tab Friday morning and remember exactly who said what.'"*

**If thin/hedged:** *"Picture the moment the thing works. What did they just do? What can they stop doing now? One concrete scene is enough."*

### Q7 — `taste`

**Ask:** *"Show me a tool or feature you don't dread using — and tell me what about it works for you. For example: 'Linear's issue list — clean, scannable, one row per thing.'"*

**If thin/hedged:** *"Name any app, tool, or website you actually like. Spotify, Notion, Google Maps, Stripe Dashboard — anything. We'll borrow the feeling, not the literal design."*

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

### After Q7 — create the repo

Now derive a short kebab-case slug from the spec (e.g., `monday-standup-tracker`, `activation-dashboard`, `auth-flow-pitch`) and run repo creation:

- **`gh` was authed →** `gh repo create <slug> --public --clone`. If naming conflict, suggest `<slug>-v2`; accept whatever the PM picks.
- **No `gh` →** Say: *"Time to create the repo. Open github.com/new, name it `<slug>`, set it Public, click Create repository. Then paste the URL back here."* When pasted, `git clone <url>` and `cd` into it.

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

## Min 25–27 — Push + Pages toggle

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

## Min 27–30 — URL handoff + inline recap

Once the PM confirms the yellow notice, print:

> *"Your URL: `https://<username>.github.io/<repo>/`. GitHub Pages takes 1–5 minutes on a new repo — sometimes longer.*
>
> *Two ways to know it's live:*
>
> *1. Open the URL above and refresh every 30–60 seconds until your tool loads.*
> *2. On GitHub, go to your repo → **Settings** → **Pages**. GitHub itself shows **'Your site is live at https://...'** with a green checkmark and a clickable **Visit site** button. This is the most reliable confirmation.*
>
> *When the URL loads your tool, paste 'live' (or 'works' / 'loaded') here and I'll print your recap."*

Do **not** poll the URL with curl. Do **not** auto-detect. The manual paste-back is intentional — it teaches the PM what deploy latency feels like and keeps the budget honest.

While the PM waits, render `recap.md.tmpl` (substituting the placeholders below) and save the rendered output to `recap.md` in their project folder. The `.gitignore` keeps it local.

### `recap.md.tmpl` placeholders to substitute

The template file's HTML comment is authoritative, but for quick reference:

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

### Delivering the recap when the URL goes live

When the PM pastes "live" (or "it works" / "loaded" / equivalent), do these two things in order:

1. **Print the rendered recap inline in the chat as one message.** Print the full rendered markdown body — every section, no abbreviation. This is the *primary* delivery. The PM is already looking at the chat; that's where the recap should land. Do not summarize it. Do not tell them "open the file" before they've read it here. (Without the inline print, the recap is invisible to the PM — `recap.md` is `.gitignored` so it's not on GitHub, and PMs often don't know where to look on disk. This step exists specifically to solve that.)

2. **After the inline print, tell them where the file lives and how to reopen it.** Say verbatim, substituting the actual repo folder path for `<repo-folder>`:

   > *"That's it — you just shipped. The recap above is also saved at `<repo-folder>/recap.md` so you can reopen it anytime. To reopen later: from a terminal, `cd <repo-folder>` and run `open recap.md` (on Mac) or `code recap.md` (if you use VS Code). It's `.gitignored` on purpose — it stays on your laptop, not on GitHub, because it probably mentions your employer, teammates, or internal product strategy. The recap itself explains how to publish it if you ever want to. Your next build doesn't need me."*

### If the URL still 404s after 5+ minutes

Say: *"Still propagating — first deploys on a new account sometimes take longer. Keep refreshing every 30s. If it still 404s after 10 minutes, check Settings → Pages and confirm the yellow notice is gone and a green checkmark is there instead."* If at 10+ min there's no green checkmark, suspect org-disabled Pages (see Min 1–2 step "Org-owned Pages disabled").

---

## Failure modes — quick reference

| What goes wrong | What you do |
|---|---|
| PM has no GitHub account (caught at Min 1–2) | Pause, link `github.com/signup`, wait for username before any interview Qs |
| No `gh` CLI / not authed | Probe at Min 1–2; defer repo create to Min 7 web-UI fallback |
| Repo name conflict at Min 7 | Suggest `<slug>-v2`, accept whatever PM picks |
| Pages toggle confusion | Decode the specific gotcha (see list above), don't re-read all 7 steps |
| Pages 404 after 5+ min | Keep refreshing; after 10+ min suspect org-disabled Pages |
| PM gets distracted mid-interview | Pick up where you left off, do not restart questions |
| PM gives a thin or hedged answer | Offer the multi-choice fallback for that question once, accept whatever they say after |
| PM asks "what is Claude Code" mid-flow | Answer in 2 sentences from the onboarding utterance, then return to where you were |
| `git push` fails | Surface the real error, fix it, do not silently retry |
| PM finishes but says "I don't see the recap" | You skipped step 1 of the delivery — print the rendered recap inline now, then point at the file path |

---

## What this skill does NOT do (and why)

- **No telemetry, no Google Form, no analytics.** The "texted a friend in 24h?" question lives in `recap.md` as reflective prose only. V1 trusts the PM to self-report when they DM the builder.
- **No CI/CD, no GitHub Actions, no publish pipeline.** Install is `git clone` + `./setup`. Adding CI now would burn the 30-min budget for no PM-facing gain.
- **No Claude Artifact / Vercel / surge.sh deploy.** GitHub is the learning surface, not the tax. The PM should leave comfortable with GitHub, not bypassing it.
- **No fourth template, no "no template fits" branch.** The classifier always picks one and always explains the bend. PM can override verbally before the build starts.
- **No auto-tweet, no split-screen, no hosted live agent.** Those are 10x V2/V3 ambition; V1 ships this weekend.
- **No background URL polling.** Manual paste-back is the design — teaches deploy latency, keeps token budget honest, avoids brittle long-running processes.
