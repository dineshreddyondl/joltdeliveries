# Review Rubric — Founder Visual Gate

> Shared yes/no checklist for the founder review gate of every V0.1 unit.
> Purpose: replace open-ended "does it look right?" with structured checks,
> so each review round costs one short pass instead of several vague loops.

## How this works

1. The lead presents the unit with: a screenshot set (`320/768/1440` +
   reduced-motion + freeze frames via `?v=N#t=SS.S`), a link to the mock
   (`file:///Users/dinesh/JOLT Website/design-reference/<file>.html`), and
   the objective results (Part A filled in by scripts — no founder time).
2. The founder reviews **Part B only** — yes/no per row + at most one
   short note per "no".
3. Feedback format: `#<row> fix: <one line>` (no paragraphs).
4. A gate passes when Part A is fully green and Part B has no open "no".
5. **Iteration budget: 3 rounds per gate.** On the 4th round, we stop,
   checkpoint state into `deepseek-harness-handoff.md`, and resume in a
   fresh session — the founder decides continue/adjust/next.

## Part A — Objective (lead verifies via scripts; founder skips unless a row fails)

| # | Check | How verified |
|---|---|---|
| A1 | Copy matches the frozen brief verbatim (incl. recorded overrides) | text diff vs brief §1 |
| A2 | Banned-claims sweep clean (exemptions: `hero.tsx`, `metrics-band.tsx`) | grep sweep |
| A3 | Contrast ≥ 4.5:1 for all body text | a11y-check.mjs |
| A4 | No horizontal overflow at 320/768/1440 | verify-browser.mjs |
| A5 | Grid correct: 2 cols → 1 col ≤768 | hero-geometry.mjs |
| A6 | Stage square 1:1, max-width 560 | hero-geometry.mjs |
| A7 | Loop timing: 9.6s period · 6×1.2s parade · flare↔stamp delta 0ms · 2.4s hold · clean reset | hero-timing.mjs |
| A8 | Reduced-motion static frame correct (first product, bar lit, stamp visible) | verify-browser.mjs |
| A9 | Chip + stamp inside stage bounds at all widths | hero-geometry.mjs |
| A10 | Freeze frames reproducible (`#t=SS.S`) | hash-freeze path |

## Part B — Founder's eyes (yes/no each)

| # | Check | What "yes" looks like |
|---|---|---|
| B1 | Left column reads benchmark-exact | Same rhythm as frozen v5; nothing added/subtracted |
| B2 | Orange accent discipline | ≤ 3 orange beats per screen; accent never decorative noise |
| B3 | Typography hierarchy | Space Grotesk display → Inter body → mono labels; no cramped tracking |
| B4 | Stage: product dominates | Product art is the biggest element; chip/stamp/journey bar support it |
| B5 | Stamp slam + hold feel right | Slam reads instant (not mushy); 2.4s hold reads intentional (not stuck) |
| B6 | Grain + spotlight subtle | Texture visible only on close look; no dirt, no banding |
| B7 | 320 mobile still legible | Chip/stamp/labels readable at 320; times row hidden; nothing clipped |
| B8 | Reduced-motion frame looks complete | Static frame reads "finished product", not "broken animation" |
| B9 | Nothing deviates from benchmark intent | Catch-all for any off-vibe detail |

## Freeze record

When both parts pass, one line goes into `docs/v01/freeze-log.md`:

```
| <date> | <unit> | Founder: '<sign-off line or note>'. Gate: A green, B all yes. Rounds: N. |
```

## Lead's per-round report format (kept compact)

```
Round N · Part A: 10/10 (or list failures) · Part B: rows 1–9 verdicts
New in this round: <one line> · Fixed since last: <one line>
Screenshots: <paths> · Freeze frame: <#t value>
```
