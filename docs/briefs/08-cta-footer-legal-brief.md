# Brief 08 — Challenge CTA + Footer + Legal Pages

## Goal
Port the frozen Challenge CTA and footer with **real wiring and zero dead anchors**, and create the three legal routes (ToS / Privacy / SLA). The SLA page carries the §0 #3 definition + methodology + money-back remedy — it is the claim-risk mitigation for every "guaranteed SLA" line on the page.

## Read first
1. AGENTS.md conventions (footer dead-anchor rule) · uplift-spec §0 #3, §6 phase-1 #3
2. `docs/next-version-plan.md` rows 9, 10, 15
3. `frozen design/jolt-landing-v5.html` lines 884–933 (markup); CSS 494–503, 579–593

## Deliverables
- `components/sections/cta.tsx` + `cta.module.css` — frozen port; "Check Active Routes" → `#live-lanes` (hero lanes table now carries that id); "Start Pilot" → opens the pilot dialog (`jolt:open-pilot`); fineprint links `/sla`.
- `components/sections/footer.tsx` + `footer.module.css` — frozen port, claim-corrected tagline; Product links → real on-page sections; Legal links → `/tos` `/privacy` `/sla` `/sla#refunds`; Company: Contact → WhatsApp only (About/Careers/Case Studies dropped — no pages exist, we don't invent routes).
- `app/(legal)/sla|tos|privacy/page.tsx` + `components/legal/legal-shell.tsx` — server pages. **Legal copy is DRAFT for founder review.**
- `components/sections/hero.tsx` — add `id="live-lanes"` to the lanes box.
- Compose `Cta` + `Footer` in `app/page.tsx`.

## SLA page (critical copy)
- Definition: % of shipments arriving within the committed delivery window.
- Methodology: rolling 90-day window, all live serviceable routes, numerator/denominator stated.
- Remedy: "If we miss the guaranteed TAT on a shipment covered by a valid pilot agreement, that shipment is free." + 14-business-day credit/refund + claim process.
- Exclusions mirror the checker disclaimer (loading/unloading, weather, force majeure, off-route/off-spec shipments).

## Acceptance criteria
1. CTA renders after Ecosystem; both buttons terminate in real flows; fineprint → /sla.
2. Footer renders with ZERO `href="#"` anchors; all links resolve (on-page ids or 200 routes).
3. `/tos`, `/privacy`, `/sla` return 200 with legal-shell chrome; `/sla#refunds` exists.
4. Build + lint + tsc green; banned-sweep zero hits; a11y 0 failures.
5. Copy-change list in summary (footer tagline corrected; About/Careers/Case Studies removed; CTA buttons wired; fineprint extended with SLA link).

## Out of scope
Real legal counsel review · customer marquee (09) · SEO/meta beyond page titles (11) · `frozen design/` / `public/` edits.
