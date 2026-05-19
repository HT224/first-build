# person-picker.md

The Path B option generator for `/first-build`. Loaded by `SKILL.md` between Min 7 and Min 8. Given the 5 get-to-know-you answers, generate 3 personalized build options the PM picks from via text select.

**Iron rule:** always generate exactly 3 options. There is no "I can't pick" branch. If the answers feel thin, lean on the worked examples below and make a confident pitch anyway — `AskUserQuestion`'s "Other" handles the bail-out case.

---

## The 5 person-shaped input fields

| Field | What it captures | Drives |
|---|---|---|
| `role` | PM's job and team (e.g., "PM on growth at a 50-person logistics startup") | Persona context for the recap |
| `tools` | Tools they live in during the workday (Linear, Notion, Sheets, Slack) | Aesthetic signal only (NOT a primary anchor for the build) |
| `annoyance` | The most annoying recurring part of their week | **The single highest-signal field.** Primary anchor for template pick. |
| `weekend_project` | What they'd build for fun on a free weekend | Secondary anchor — strong signal when annoyance is thin |
| `hobby` | What they geek out about outside work | Recap copy + accent color only. **NEVER** the build's primary anchor. |

---

## Anchor priority (read in this order)

When generating each option, draw the build's *primary anchor* from the highest field that has substance:

```
annoyance  >  weekend_project  >  role  >  tools  >  hobby
```

- If `annoyance` is rich, every option's `because:` line should quote it.
- If `annoyance` is thin or vague, fall back to `weekend_project`.
- If both are thin, anchor on the `role` (e.g., "growth PMs spend half their week explaining trends to leadership").
- **`hobby` is NEVER the primary anchor.** A PM who rock climbs doesn't want a rock-climbing app — they want their actual work problem solved. Hobby flavors the accent color or shows up as a small joke in the recap, nothing more.

This rule prevents a common LLM failure mode: building a tool around the hobby because it's the most concrete-feeling answer. The hobby is the warm-up question; the work answers are the build signal.

---

## The three templates (same archetypes as Path A's `template-picker.md`)

### internal-tool
**Generate this option when:** the annoyance describes a *recurring workflow* (logging, tracking, capturing, managing). Verbs in the annoyance like "I keep losing track of," "I have to remember to," "every Monday I…" point here. The PM types data in.

Examples: standup commitment tracker, weekly priorities list, OKR check-in, customer-call notes, retro action items.

### dashboard
**Generate this option when:** the annoyance describes *information that should already be visible* (a metric, a trend, a report). Verbs like "I keep getting asked for," "I have to dig through Mixpanel," "my VP wants to see…" point here. The data exists; the tool just makes it legible.

Examples: weekly activation snapshot, KPI scorecard for the VP, conversion funnel, on-call incident summary, NPS trend.

### prototype
**Generate this option when:** the annoyance describes *aligning people on a future thing* (a pitch, a demo, a stakeholder meeting). Verbs like "I'm presenting this to," "I need to convince," "we're deciding whether to…" point here. No data, just screens.

Examples: feature pitch deck, onboarding flow mockup, pre-build stakeholder alignment, internal launch announcement, Q3 strategy walkthrough.

---

## Archetype balance rule

When generating the 3 options:

1. **Default: span ≥2 archetypes.** Three options should give the PM a meaningful choice. The lazy "all 3 are internal-tools because that was the strongest signal" is wrong — the PM came to Path B *because they weren't sure what to build*; show them range.
2. **Strong-signal exception:** if the answers strongly favor one archetype (e.g., `annoyance` and `weekend_project` BOTH name a tracking workflow + a metric report respectively), it's OK to have two internal-tools and one dashboard. Still span at least 2 archetypes.
3. **Flat-answers fallback:** if the PM gave one-word or "idk" answers to most of the 5 questions, default to **one option per archetype** (internal-tool / dashboard / prototype). Each gets a generic-but-tailored framing using whatever signal exists.

---

## The option generator prompt (use this verbatim against the 5 answers)

> Given the PM's 5 get-to-know-you answers — `role`, `tools`, `annoyance`, `weekend_project`, `hobby` — generate exactly **3 build options** the PM will pick from.
>
> Apply the anchor priority (`annoyance > weekend_project > role > tools > hobby`) and the archetype balance rule. Each option has 4 fields, in this exact shape:
>
> ```
> 1) build_name: <a short title in the PM's voice — kebab-case slug also derivable, e.g. "Monday commitments tracker">
>    template: <internal-tool | dashboard | prototype>
>    description: <one sentence describing what the build does>
>    because: <one line that quotes a specific phrase from the PM's answers and explains why this option fits>
> 2) ...
> 3) ...
> ```
>
> Rules:
> - Generate exactly 3. Not 2, not 4.
> - Span ≥2 archetypes by default (3 different ones if you can; 2-and-1 if the PM strongly favors one).
> - `because:` must quote a specific phrase from a specific answer. Paraphrase is not allowed — use the PM's actual words in quotes.
> - `hobby` may NOT be the primary anchor of any option. It may appear as a small touch (accent color, a sentence in the recap, a name pun) but not as the build itself.
> - Build names should sound like the PM said them, not like a product brief. *"Monday commitments tracker"* good. *"Standup Accountability Platform"* bad.

---

## The "Other" regeneration prompt (use this when PM picks "Other" the first time)

If the PM picks "Other" in the 3-option picker and types a free-form answer (e.g., *"None of those — I want something to track my customer calls"*), use this prompt:

> The PM rejected the original 3 options and said: "<free-form text>". Re-read their 5 answers as additional context, but weight the free-form text as the highest signal — they've now told you what they actually want. Generate 3 fresh options. Same shape as before. Same archetype balance rule. The first option should be the closest match to their free-form text; options 2 and 3 should explore alternatives in different archetypes.

If the PM picks "Other" a second time, **do not regenerate again.** Per `SKILL.md` Min 7–8, offer to switch to Path A's problem interview.

---

## Worked examples (these double as informal eval cases)

These examples constrain Claude's outputs by demonstration. If person-picker.md ever regresses, the regression will show up as a divergence from one of these example outputs.

### Example 1 — Growth PM, workflow + metric pain

**Inputs:**
```
role: PM on growth at a 50-person logistics startup
tools: Linear, Sheets, Slack
annoyance: I keep losing track of what eng committed to between Monday standup and Friday demo prep
weekend_project: Something that auto-summarizes my customer calls
hobby: Rock climbing
```

**Expected options (3, spans 3 archetypes):**

```
1) build_name: Monday commitments tracker
   template: internal-tool
   description: A simple CRUD tool to log what each engineer commits to in standup. You scan it Friday morning before demo prep.
   because: You said "I keep losing track of what eng committed to between Monday standup and Friday demo prep" — this is literally that, in a URL.

2) build_name: Growth metric snapshot
   template: dashboard
   description: A one-chart dashboard showing your team's weekly activation rate with a "what good looks like" line. Bookmark-able for your VP.
   because: You live in Linear and Sheets, which means metrics live in three places. A growth PM's VP always wants the number — this collects it in one URL.

3) build_name: Customer-call summarizer pitch
   template: prototype
   description: A clickable 3-page prototype of the call-summarizer you said you'd build for fun on a weekend. Stakeholder-shareable.
   because: You said you'd build "something that auto-summarizes my customer calls" — let's build the pitch deck for it now, so you can show it to leadership before you build the real thing.
```

Note: `hobby: rock climbing` does NOT appear as the primary anchor of any option. It may show up as the recap's accent color (e.g., harness orange) or a one-liner ("the trend line goes up like a 5.10").

---

### Example 2 — Eng manager, alignment pain

**Inputs:**
```
role: Eng manager, platform team, ~12 engineers
tools: GitHub, Notion, Slack, mostly
annoyance: I'm always re-explaining the same architecture decisions to new joiners and stakeholders
weekend_project: Idk, maybe a generative art thing in p5.js
hobby: I'm learning Japanese
```

**Expected options (3, spans 3 archetypes; annoyance is alignment-shaped → prototype-heavy but still balanced):**

```
1) build_name: Architecture decision walkthrough
   template: prototype
   description: A 4-page clickable explainer of your team's key architecture decisions — open it, walk through it once, send the URL to anyone who asks.
   because: You said you're "always re-explaining the same architecture decisions to new joiners and stakeholders" — this URL replaces that conversation.

2) build_name: ADR tracker
   template: internal-tool
   description: A lightweight tool for logging architecture decisions as they happen — title, context, decision, status. Always linkable, never lost.
   because: You said "I'm always re-explaining the same decisions" — most of that re-explaining happens because no one can find the original. This is the canonical log.

3) build_name: Platform team weekly
   template: dashboard
   description: A read-only dashboard with one metric per week for your team — incidents, on-call load, PR throughput — so stakeholders self-serve instead of asking.
   because: You said you re-explain "to new joiners and stakeholders" — half the stakeholder questions are about metrics. Put them on a URL.
```

Hobby (`Japanese`) does NOT drive any option; it may show up as a one-liner in the recap (e.g., "your build name in romaji is…") or get ignored entirely if it doesn't fit.

---

### Example 3 — PM with flat answers (fallback to one-per-archetype)

**Inputs:**
```
role: Product manager
tools: idk, the usual
annoyance: meetings I guess
weekend_project: not sure
hobby: video games
```

**Expected options (3, one per archetype, generic-but-tailored):**

```
1) build_name: Meeting prep tracker
   template: internal-tool
   description: A tool to capture "what I need from this meeting" before it starts, and "what got decided" after. Friday review-able.
   because: You said your annoyance is "meetings" — most meeting pain comes from going in unprepared and forgetting outcomes. This catches both ends.

2) build_name: Time-spent dashboard
   template: dashboard
   description: A simple chart of where your hours went this week (meetings vs heads-down vs interrupt). Quick weekly read.
   because: You said "meetings" — the way you change that is by seeing how much of the week they actually eat. Hard to fix what you can't measure.

3) build_name: "Less meetings" pitch
   template: prototype
   description: A 3-page click-through pitch for your team or manager about reclaiming meeting time. Use it as a Tuesday conversation starter.
   because: Sometimes the answer to "too many meetings" isn't a tracker, it's a pitch to your manager. This is that pitch with a real URL behind it.
```

Note how each option still grounds in *"meetings"* (the one signal the PM gave), even though every other field was empty. Force-fit applies at the option level, not just the archetype level.

---

### Example 4 — Strong-signal exception (annoyance + weekend project both point at internal-tool)

**Inputs:**
```
role: Designer turned PM at a Series B SaaS
tools: Figma, Linear, Loom
annoyance: I never remember which design feedback I've already addressed across 4 different stakeholders
weekend_project: An organizer for my Figma feedback comments by status
hobby: Bouldering
```

**Expected options (3, spans 2 archetypes per strong-signal exception — two internal-tools but one dashboard):**

```
1) build_name: Feedback resolution tracker
   template: internal-tool
   description: A simple tool to log each design feedback item — who said it, what they said, status (todo/addressed/declined). Scan it before the next review.
   because: You said you "never remember which design feedback I've already addressed across 4 different stakeholders" — this is exactly that, structured.

2) build_name: Figma comment organizer
   template: internal-tool
   description: A lightweight tool to triage Figma comments by status — yours from work, but reusable for other PMs/designers. The thing you said you'd build for fun.
   because: You said your weekend project would be "an organizer for my Figma feedback comments by status" — let's just build it. You already have the spec.

3) build_name: Stakeholder feedback heatmap
   template: dashboard
   description: A read-only chart of who gave you the most feedback this cycle, color-coded by status. Shows you (and them) where the load lives.
   because: You mentioned "4 different stakeholders" — sometimes the data point is who's giving you the most heat. This visualizes that.
```

Two internal-tools is allowed here because both the annoyance and the weekend project point at the same archetype with different shapes. Option 3 still gives a meaningful third choice.

---

## What the option generator must NOT do

- Generate fewer than 3 or more than 3 options. Always exactly 3.
- Generate 3 options all of the same archetype (unless strong-signal exception applies, and even then keep ≥2 archetypes).
- Use `hobby` as the primary anchor of any option. Hobby is accent color and recap copy, never the build.
- Paraphrase the PM's answers in the `because:` line. Quote them directly with their actual words.
- Use product-brief language in `build_name`. *"Project Coordination Platform"* is bad. *"Monday commitments tracker"* is good — sounds like the PM said it.
- Refuse to pitch ("I can't tell what you want"). Force-fit applies at the option level — even a one-word answer like *"meetings"* is enough to anchor 3 builds (see Example 3).
