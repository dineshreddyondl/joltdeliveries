# Brief 07 — Ecosystem (Live Across Your Logistics Ecosystem)

## Goal
Port the frozen v5 Ecosystem section (dark band + two full-bleed audience bands + marquee) into React with claim-correct, verified-only copy. Dual-audience *routing* (per-audience CTAs, sennder pattern) stays Phase 3 — this brief is the faithful port.

## Read first
1. AGENTS.md guardrails (real-brand marquees) · uplift-spec §0 real-brand risk, §2.4
2. `docs/next-version-plan.md` row 8
3. `frozen design/jolt-landing-v5.html` lines 848–882 (markup); CSS lines 566–575 (`.band*`), 458–461 + 575 (`.marquee`)
4. `components/sections/how-it-works.tsx` — same reveal + module conventions

## Copy (final — verbatim)

- tag: `Live Across Your Logistics Ecosystem`
- H2 (unchanged): `No integration effort. We're already live where you are.`
- lede: `Express SLAs for your distributors and your end-consumers. Zero IT overhaul required — our API plugs into your existing stack. Just switch us on.` ("We plug directly" → grounded in the real API product)
- **Band B2B — For Your Distributors / B2B Replenishment:** `Guaranteed 24-48 hour arrivals mean your distributors stop holding defensive buffer stock. It compresses working capital cycles, kills out-of-stock losses, and unlocks trapped cash.` (unchanged)
- **Band D2C — For Your Consumers / D2C Heavy Delivery:** `Consumers won't wait for heavy purchases. Give them a courier-grade post-purchase experience. Drop your cart cancellations and eliminate doorstep rejections on your heaviest items.` ("10 days" dropped — no invented numbers)
- **Marquee:** brand names REMOVED (unverified relationships — AGENTS release blocker). Generic capability tokens only: `REST APIs · Webhooks · EDI · Custom REST APIs` repeated for the loop.

## Spec
- Port `.band` full-bleed styling 1:1 (`#0d0d10` B2B, ember gradient D2C, orange band-tags, responsive 1fr → 1fr/1.25fr grid).
- Marquee: CSS scroll loop (26s linear), edge mask, hover-pause, reduced-motion static (globals kill-switch).
- Compose in `app/page.tsx` after `<HowItWorks />`.

## Acceptance criteria
1. Section renders after How It Works with both bands + generic marquee; copy matches verbatim.
2. Zero brand names anywhere in the section (SAP/Oracle/Clickpost/Pando/eShipz absent).
3. Build + lint + tsc green; banned-sweep zero hits; a11y 0 failures; 320px no overflow.
4. Copy-change list in the summary (3 changes: lede, D2C band, marquee de-branding).

## Out of scope
Dual-audience routing/CTAs (Phase 3) · Challenge CTA + footer (08) · `frozen design/` / `public/` edits.
