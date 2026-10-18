# Brief 12 — Instant Freight Estimate Widget (hero)

## Goal
The category-leading ungated estimator (uplift §2.1): 3 fields → indicative ₹ estimate + eta via the existing `/api/estimate` route, with ClickPost-style disclaimers and the WhatsApp contract-rate path. Placed as a full-width light card under the hero grid.

## Read first
1. uplift-spec §2.1 · `docs/next-version-plan.md` row 17
2. `app/api/estimate/route.ts` (mock: zone-delta pricing) · `lib/validation.ts` `estimateSchema`
3. `components/serviceability/serviceability-checker.tsx` — state-machine + copy conventions

## Deliverables
- `components/estimate/estimate-widget.tsx` + module CSS — 4 states (idle/loading/result/error), RHF + zod, response rendered verbatim, disclaimers ("Estimates based on published rail-freight rate slabs…"), WhatsApp CTA with pre-filled lane message, aria-live, hydration-safe ready-gated motion (house pattern).
- `components/sections/hero.tsx` — renders `<EstimateWidget />` in a `heroWrap`-width strip under the grid (fade-up 1.05s, reduced-motion static).

## Acceptance criteria
1. Widget renders in the hero below the grid; estimate flow verified in browser (500001→110001/200kg → "Indicative estimate: ₹…" + disclaimer + WhatsApp).
2. Ungated: no login/signup; invalid input shows per-field errors and never calls the API.
3. Build + lint + tsc green; banned-sweep zero hits; reduced-motion zero hydration errors (verified); a11y 0 failures.
4. Copy-change list: the widget is new (frozen v5 has none); its strings follow the checker's disclaimer copy verbatim.

## Out of scope
Real rate data (mock-gated) · real-time pincode validation · `frozen design/` / `public/` edits.
