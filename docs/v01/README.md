# V0.1 Operating Pack

> The frozen v5 design is a **skeleton** — visual direction only. These docs govern how every unit of the site reaches **V0.1 production depth**, one section at a time, each frozen by the founder before the next starts.

## The pipeline (per unit)

```
INTAKE (new unit only) → BRIEF (founder reviews & edits) → BUILD
→ QA (gates + visual review) → FOUNDER REVIEW → FREEZE (signed)
→ next unit
```

1. **Brief first, always.** No code before the founder approves the brief. The brief is the definition of done.
2. **QA gates per unit:** `tsc` · `eslint` · `next build` · banned-claims sweep (with recorded exemptions) · Playwright browser suite · contrast/keyboard audit · visual screenshots at 320/768/1440 (+ freeze-frame where animated).
3. **Founder review is mandatory.** A unit is NOT done until the founder reviews and signs it off ("freeze"). The freeze is recorded in `freeze-log.md` with date and notes.
4. **One frozen unit at a time** — the founder freezes Hero+Header, then we open the next brief.

## The five questions every brief must answer

1. **Who** — target user for this unit, and what they must believe here.
2. **What** — full copy spec: every visible string, every number sourced or marked placeholder ⚠️.
3. **How** — interactions and ALL states (hover/focus/loading/empty/error/reduced-motion).
4. **Why it converts** — the single conversion job of this unit; anything not serving it gets cut.
5. **Proven how** — acceptance criteria that are checkable, not vibes.

## Docs in this pack

| File | Purpose |
|---|---|
| `section-inventory.md` | Every unit of the site, its rating, status, owner, open questions |
| `section-spec-template.md` | The brief template to copy per unit |
| `intake.md` | Process for adding NEW sections or pages (e.g. /track) |
| `freeze-log.md` | Freeze records — founder sign-offs per unit |

## Roles

- **Lead** — composes the page, owns shared files (`page.tsx`, `lib/`, tokens, gates), runs every QA gate, keeps the freeze log.
- **Specialists** — Narrative (Why Now/Gap/How It Works), Conversion+APIs (checker/pilot/WhatsApp/estimate), Trust+Legal (CTA/footer/legal), Proof+SEO (metrics/marquee/SEO). A specialist owns its sections through ALL iterations until freeze.

## Standing rules (unchanged)

- Commits allowed; **push requires TWO founder confirmations**.
- Claims guardrails (AGENTS.md) remain binding unless the founder records an override in the brief.
- Founder inputs (WhatsApp number, legal copy) remain TBD.
