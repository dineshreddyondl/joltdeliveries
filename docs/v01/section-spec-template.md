# Section Spec Template — V0.1

Copy this per unit into `docs/v01/briefs/0X-<unit>.md`. Founder reviews and edits BEFORE any code.

```markdown
# V0.1 Brief — <UNIT NAME>

## 1. Job to be done & target user
- Who reads this unit, and what single belief or action it must produce.
- Conversion job: awareness / proof / action — exactly one primary.

## 2. Full copy spec (every string, verbatim)
- All visible text, labels, buttons, microcopy, aria text.
- Mark every number/claim: ✅ sourced · ⚠️ placeholder to verify · 🚫 banned (never).

## 3. Claims & data register
| Claim | Status | Source / verification needed | Action |
|---|---|---|---|

## 4. Layout & visual deltas vs skeleton
- Skeleton section reference (frozen v5 lines / CSS lines).
- What we keep exactly, what we change, what we add/remove — each delta justified.

## 5. Motion & states matrix
- Animations (timing, triggers, hover-pause, reduced-motion behavior).
- Every state: idle / hover / focus / loading / empty / error / reduced-motion / 320px / 768px / 1440px.

## 6. A11y & responsive requirements
- Contrast targets, aria, focus, keyboard, motion-safe.

## 7. Performance notes
- Asset sizes, fonts, LCP budget impact for this unit.

## 8. Founder inputs needed (before build)
- Decisions, data, wording choices this unit is blocked on.

## 9. Acceptance criteria (checkable)
1. …
2. …

## 10. Freeze
- [ ] Founder review passed · date · notes → recorded in freeze-log.md
```

## Out of scope per unit
- (list what must NOT change here)
