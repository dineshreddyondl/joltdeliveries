# Brief 09 — Self-Serve Utility Bar

## Goal
A slim self-serve strip at the top of the fixed nav (Safexpress TRACK/BOOK pattern, uplift §2.3) that signals a real product — with **only real actions** (no fake TRACK; we have no order tracking).

## Read first
1. uplift-spec §2.3 · `docs/next-version-plan.md` row 14
2. `components/sections/nav.tsx` + `nav.module.css` · the `jolt:open-*` event pattern (pilot/checker)

## Deliverables
- `components/sections/nav.tsx` — fixed nav becomes a column: utility strip + main row. Strip (desktop only): left `● NETWORK LIVE`; right `Check lane` (opens checker via `jolt:open-checker`), `Start pilot` (opens pilot via `jolt:open-pilot`), `WhatsApp` (wa.me deep link).
- `components/serviceability/serviceability-checker.tsx` — `jolt:open-checker` external-open listener (same pattern as pilot); `handleOpenChange` → `useCallback`.
- `nav.module.css` — `.row` carries the old nav layout + glass-on-scroll; `.util` strip styles (dark `#08080A`, mono micro-labels, orange hover/focus, blink live dot, hidden <640px).

## Acceptance criteria
1. Utility bar renders above the main nav on desktop; hidden on mobile (<640px).
2. All three actions verified in browser: Check lane → checker dialog; Start pilot → pilot dialog; WhatsApp → wa.me href.
3. Main nav CTAs keep working; scrolled glass state applies to the row, not the strip.
4. Build + lint + tsc green; a11y 0 failures; no new banned strings.

## Out of scope
Real tracking (no fake TRACK) · grain overlay polish · estimate widget (12) · `frozen design/` / `public/` edits.
