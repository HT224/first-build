# template-picker.md

The force-fit classifier for `/first-build`. Loaded by `SKILL.md` between Min 7 and Min 10. Given the completed `spec.md`, classify into exactly one of three V1 templates and write the bending instructions.

**Iron rule:** the classifier always returns one of the three. There is no "no template fits" branch. If nothing fits cleanly, pick the closest and be honest about the bend.

---

## The three templates (decision-shaped)

### internal-tool
**Picks this when:** the PM wants to *capture, store, or manage* something — for themselves or their team. CRUD-shaped. Inputs are user-entered (forms). Outputs are persistent lists or tables. Read + write.

Signals in the spec:
- Verbs in Q5 (outputs): "track," "log," "capture," "add," "edit," "save," "manage," "list."
- Q3 (scenario) describes a recurring action ("every Monday they add X").
- Q4 (inputs) describes things the PM types in, not data that already exists.
- One-user-at-a-time is fine — localStorage persists in their browser.

Examples: standup tracker, weekly priorities list, bug-intake form, OKR check-in tool, retro notes capture, customer-call log.

### dashboard
**Picks this when:** the PM wants to *display or visualize* data, usually for a stakeholder audience. Read-mostly. The data already exists (or has a known shape); the tool's job is to make it legible.

Signals in the spec:
- Verbs in Q5 (outputs): "show," "see," "compare," "trend," "summarize," "report," "monitor."
- Q2 (persona) is a stakeholder consuming the result, not the PM producing it.
- Q4 (inputs) describes data with a shape — time-series, categories, two-column lookup.
- Q6 (success) sounds like *"they glance at it and immediately know X."*

Examples: weekly metrics report, KPI scorecard, NPS over time, conversion funnel, feature adoption chart, on-call incident summary.

### prototype
**Picks this when:** the PM wants to *show what a future thing could look like* — to align stakeholders, pitch a feature, or walk through a flow. No real data, no persistence. Multi-page click-through.

Signals in the spec:
- Verbs in Q5 (outputs): "show," "demo," "walk through," "pitch," "align," "preview."
- Q3 (scenario) is *"I'm presenting this to X"* or *"we're trying to decide whether to build Y."*
- Q4 (inputs) describes screens or steps, not data.
- Q7 (taste) often points to onboarding flows, marketing pages, or other PM tools they admire visually.

Examples: stakeholder demo of a future dashboard, onboarding flow mockup, feature pitch deck (web version), pre-build alignment artifact, internal launch announcement.

---

## When the spec is ambiguous (force-fit heuristics)

Real PM specs will straddle these. Apply this priority:

1. **If the PM types data in → internal-tool.** Even if there's also a chart, start from the CRUD shell and add a chart via bending.
2. **If the data already exists and the goal is "make it legible" → dashboard.** Even if there's also a stakeholder audience.
3. **If there is no data at all, just screens → prototype.**
4. **If two fit equally, prefer in this order: internal-tool > dashboard > prototype.** Reason: internal-tool has the lowest "but it's just a mockup" risk for first-build aha. The PM ends up with something that actually does a thing.

Do not show this priority to the PM. Just pick.

---

## The classifier prompt (use this verbatim against the completed spec.md)

> Given this PM's `spec.md` — with fields `problem`, `persona`, `scenario`, `inputs`, `outputs`, `success`, `taste` — classify into exactly one of: `internal-tool`, `dashboard`, `prototype`.
>
> Apply the signals and the force-fit heuristics in `template-picker.md`. Do not invent a fourth option. Do not say "none fit." Pick the closest and explain the bend honestly.
>
> Return three things, in this exact shape:
>
> ```
> template: <internal-tool | dashboard | prototype>
> reasoning: <one sentence, grounded in a specific phrase from the PM's spec>
> bending: <1–3 sentences describing how to adapt the template to this spec, naming the specific config-swaps>
> ```
>
> Bending rules:
> - Prefer **config-swap** over **codegen**. Each template has named bending surfaces; name them.
> - `internal-tool` surfaces: `fields.json`, `copy.json`, `theme.css`.
> - `dashboard` surfaces: `data.json` (pick one of three pre-baked shapes: time-series, categorical-bar, two-column-table), `chart-config.json`, `narrative.md`.
> - `prototype` surfaces: `pages.json`, `copy/<page>.md`.
> - Only call for codegen when the spec genuinely needs a non-standard field type (e.g., file upload), a chart type outside Chart.js defaults, or a non-standard interaction (modal, drag-and-drop).

---

## The override re-classification prompt

If the PM rejects the classifier's pick and asks for a different template, use this prompt — same spec, but the template is fixed by the PM, and you regenerate only the bending:

> The PM overrode the classifier and chose `<chosen-template>`. Re-read their `spec.md` and write fresh bending instructions for this template, using only the named bending surfaces. Be honest if the override forces a noticeably bigger bend than the original pick would have — name what's getting stretched.
>
> Return:
>
> ```
> template: <chosen-template>
> bending: <1–3 sentences>
> ```

---

## Worked examples (for calibration)

**Example 1**

```
problem: I forget what my team committed to on Monday by the time we sync on Friday.
persona: Me — I'm the PM for the growth pod.
scenario: Every Monday standup, four engineers say what they're working on. I scribble notes but lose them.
inputs: Engineer name, what they committed to, status (todo/doing/done).
outputs: A list I can scan before Friday demo prep.
success: I open one tab Friday morning and remember exactly who said what.
taste: Linear's issue list — clean, scannable, one row per thing.
```

Classification:
```
template: internal-tool
reasoning: PM types commitments in every Monday ("Engineer name, what they committed to, status") and reads them back Friday — classic CRUD shape.
bending: Swap fields.json to {engineer, commitment, status}. Set copy.json title to "Monday commitments" and the add-button to "Log commitment." Theme accent stays default; Linear's "clean, scannable" taste is already the template's default.
```

**Example 2**

```
problem: My VP keeps asking "how are we trending on activation?" mid-week and I dig through Mixpanel each time.
persona: Anjali, my VP of Product.
scenario: Wednesday afternoons, she Slacks me asking for the activation number.
inputs: Weekly activation rate, last 8 weeks.
outputs: A chart she can glance at and immediately see direction.
success: She stops asking — she just bookmarks the URL.
taste: Stripe's metrics dashboard — one big number, one trend line, nothing else.
```

Classification:
```
template: dashboard
reasoning: Data already exists (weekly activation rate, last 8 weeks) and the stakeholder Anjali consumes the result — "she can glance at it and immediately see direction" is textbook dashboard.
bending: Use the time-series shape in data.json with 8 weekly points. Set chart-config.json to a line chart titled "Activation rate, last 8 weeks." Replace narrative.md with one sentence framing what "good" looks like; Stripe-clean = leave styling minimal.
```

**Example 3**

```
problem: I want to pitch a new self-serve onboarding flow to leadership next Thursday.
persona: My CPO and head of design — they decide whether we build this Q3.
scenario: Thursday's roadmap review, I have 10 minutes.
inputs: Three screens — sign-up, first-run, the aha moment.
outputs: A click-through they can navigate themselves while I narrate.
success: They ask "when can we start" instead of "what would this look like."
taste: Linear's onboarding — every screen earns its place.
```

Classification:
```
template: prototype
reasoning: No data, no persistence — the PM literally describes "three screens" and a click-through for stakeholders to navigate during a 10-minute pitch.
bending: Set pages.json to a 3-page nav: signup → first-run → aha. Write each copy/<page>.md as the screen content (headline, one sentence, primary CTA). No codegen needed — the template's default click-through nav is exactly the flow.
```

**Example 4 (force-fit — straddles internal-tool + dashboard)**

```
problem: I log my deep-work blocks and I can never tell whether I'm actually doing more deep work month-over-month.
persona: Me.
scenario: End of each day I jot down deep-work hours; end of the month I want to see the trend.
inputs: Date + number of deep-work hours that day.
outputs: A log of entries AND a chart of monthly totals.
success: I see the line going up.
taste: A Notion table with an inline chart.
```

Classification:
```
template: internal-tool
reasoning: PM types data in every day ("End of each day I jot down deep-work hours") — heuristic 1 says start from the CRUD shell even though there's also a chart need.
bending: Swap fields.json to {date, deep_work_hours}. Add a Chart.js snippet under the table that aggregates localStorage entries into a monthly bar chart — this is the one codegen carve-out (chart on top of CRUD). Copy.json title: "Deep work log."
```

---

## What the classifier must NOT do

- Invent a fourth template ("survey" or "automation"). Those are V2.
- Refuse to classify ("nothing fits"). Force-fit is the design.
- Recommend "do nothing" or "talk to an engineer." The PM is shipping today.
- Skip the bending. Even a perfect-fit pick has 1–3 sentences of bending — at minimum which config-swaps to apply.
- Bend by codegen when a config-swap would do. Codegen is the last resort, not the default.
