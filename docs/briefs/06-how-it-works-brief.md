# Brief 06 — How It Works (The Orchestration Layer)

## Goal
Port the frozen v5 "How It Works" section (dark `#08080A`, pipeline + 3 columns) with **claim-corrected copy** per the narrative audit. Pipeline animation stays lightweight (CSS-only loop — no GSAP; the pinned set-piece is Phase 3 and not in this brief).

## Read first
1. `docs/audits/narrative-claim-audit.md` — Orchestration Layer rows (authoritative)
2. `docs/next-version-plan.md` row 7 · uplift-spec §0 #2, §5
3. `frozen design/jolt-landing-v5.html` lines 825–846 (markup), CSS lines 552–565 (`.pipeline`, `.pipe-*`, `@keyframes pulse`), JS 992–1000 (loop timing reference)
4. `components/sections/why-now.tsx` — follow the same reveal pattern + module CSS conventions

## Copy (final — verbatim)

- tag: `The Orchestration Layer`
- H2: `Not another marketplace. We built the intelligence to unlock the fastest mid-mile network in India.` ("India's fastest network" → scoped, audit)
- lede: `Marketplaces match supply and demand, then wash their hands of the SLA. We don't. Indian rail was always the cleanest way to move weight. It was just an analog black box. We built the tech to run it end-to-end, and we take full accountability for the delivery.`
- **01 / NTO — Next Train Out (NTO) Speed:** `Aviation has Next Flight Out. We built Next Train Out for heavy commerce. Your payload doesn't wait for a truck to fill up. High-capacity rail bypasses highway tolls and traffic to deliver non-stop linehaul — up to 89% less CO₂ per tonne-km vs road.` + † footnote (`lib/metrics-data.ts` FOOTNOTES.co2). ("borders" removed — domestic lanes; "80%" synced to hero figure)
- **02 / HUBLESS — End-to-End Hubless Execution:** `From first-mile pickup to final-mile delivery. No multi-day consolidation waits. No waiting in truck hubs. We pick up your payload, load it directly onto the rail linehaul, and deliver it straight to the destination. One seamless motion. Zero mid-journey sorting delays.` ("No consolidation yards" → honest reword; leased capacity IS consolidation)
- **03 / VISIBILITY — Control Tower Visibility:** frozen copy unchanged.

## Spec
- Pipeline: CSS-only loop — fill `width 0→100%` and dot `left 0→100%` over ~5.2s with a hold, stops light as the dot passes (keyframe delays), `animation-play-state: paused` on hover, `prefers-reduced-motion` → completed static state (globals kill-switch + `animation-fill-mode: forwards`).
- Styling: port frozen `.pipeline` CSS 1:1 into `how-it-works.module.css`; columns grid 1fr → 3fr at ≥768px; body text `#8B8B90`-family with ≥4.5:1.
- Compose in `app/page.tsx` after `<Gap />`.

## Acceptance criteria
1. Section renders after Gap in frozen order with pipeline + 3 columns; copy matches verbatim; † footnote under the columns.
2. Pipeline loop animates; hover pauses; reduced-motion shows the completed static state; 320px no overflow.
3. Build + lint + tsc green; banned-sweep zero hits (incl. "borders" and "slashing carbon" absent).
4. Copy-change list in the delivery summary (4 changes: H2, lede sentence, NTO sentence, HUBLESS sentence).

## Out of scope
GSAP pinned set-piece · Ecosystem (07) · any other section · `frozen design/` / `public/` edits.
