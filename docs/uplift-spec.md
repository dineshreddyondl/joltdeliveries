# JOLT Website — Uplift Spec (Synthesis of research swarms)

> Master handoff for VS Code development. Sources: `research/01–06` (2026-10-17). Read the full reports for citations; this spec is the decision layer.

---

## 0. Act on this first: claim corrections (urgent)

The frozen v5 makes 8 claims. Six need changing before ANY version of this copy goes live. Evidence in `research/05-claims-validation.md`.

| # | Claim (v5 wording) | Verdict | Action |
|---|---|---|---|
| 1 | "India's first express layer for heavy shipments" | **RISKY** | Amazon has run rail express since 2019 (140+ trains / 130 routes / 100+ cities by Aug 2026); RaillExpress, RailParcel, Bholenath position as rail express; IR runs JPP-RCS + SCR launched a door-to-door "Rail Parcel" app pilot (Feb 2026) covering Hyderabad/Bengaluru/Chennai — our exact turf. → Drop "first". Reposition: "India's rail-first express network for 200kg+ B2B" or similar scoped claim. |
| 2 | "80% less carbon" | **PASS (conservative)** | NITI Aayog: rail 11.5 vs road 101 gCO₂/tkm (~89% less); Smart Freight Centre India 2025: 81–87% less (97% vs LCV). Can safely say "up to 85–90% less carbon" with a footnote. Strongest asset — lead with it more. |
| 3 | "99.2% SLA adherence" | **RISKY** | Not externally verifiable. BlueDart publishes 99.96% (with money-back guarantee); Delhivery ~91%. Publishable only with: definition + methodology + audit trail + money-back remedy. |
| 4 | "1.4T CO₂ saved per lane" | **UNSUPPORTED** | Unit/period ambiguous. Real math: ~8.2 kg CO₂e saved per 200kg shipment (HYD→BLR). → Use per-shipment stat or dated figure with N-shipments basis. |
| 5 | Lane TATs ("HYD→BLR 24hrs vs 3 days") | **REWORD** | Road FTL on HYD–BLR is 7–9h driving, ~24h door-to-door; the 3-day baseline only holds vs LTL/part-load consolidation. → Label the comparison column "LTL / Part-Load" not "Traditional Logistics", or pick lanes where the gap is real (DEL→BOM: 4–5 days road vs 2 days rail is the credible showcase lane). |
| 6 | "Cut transit to 2 days, rotate cash 3x faster" | **REWORD** | Inventory-turnover math: 3x only holds on lanes where road ≥3x rail transit, and only for in-transit capital. → "Up to 3x faster rotation of in-transit working capital on our longest lanes" + footnote. |
| 7 | "Parcel-speed expectations for 200kg" | **PASS (as narrative)** | Backed by Datum (69% prefer 10-min), PwC (42% ditched traditional shopping), Bain/Flipkart 2025. Phrase as expectation-setting, not a measured heavy-goods stat. |
| 8 | "Quick-commerce killed consumer patience" | **PASS (soften)** | Same sources. Prefer "reset expectations" phrasing. |

**Real-brand risk (both marquees):** customer logos (Ather, Wakefit, Ola Electric, Duroflex) and integration names (SAP, Oracle, Clickpost, Pando, eShipz) are real trademarks. Only ship logos where a relationship is real. Two-tier pattern from Retool: logo + receipt chip ("X shipments for <client>") — only with permission. Until then, keep the marquee generic or use the integrations list (those are interop claims, lower risk than customer logos — but verify each integration exists).

---

## 1. Design direction (from `02-design-motion-trends.md`)

**Verdict: keep the v5 foundation.** White/orange hero + alternating dark sections (#08080A) is exactly the 2026 "cyber-monochrome + single accent" premium formula. Uplift, don't rebuild:

1. **Grain/noise overlay** (SVG feTurbulence, low opacity) on hero + dark sections — cheapest premium upgrade, kills banding. Effort: Low.
2. **Hairline borders + background-tint elevation** on dark (Resend style) — no heavy shadows on dark. Effort: Low.
3. **Live ticking counter** — add mono timestamp + one interval-varying number to the metrics band ("the number is the message", Stripe pattern). Effort: Low.
4. **Progressive dashboard reveal** — hero teases cropped control surface; scroll assembles it widget-by-widget (ticker → map → alerts → full board). Maps perfectly to dispatch board → lanes table → metrics. Effort: Med.
5. **Scroll-pinned pipeline scene** (GSAP ScrollTrigger pin/scrub, glowing route line — Madar/Terminal Industries pattern) as the ONE set-piece. Effort: Med.
6. **Marquee tickers** — counter-direction accent line, hover-pause, reduced-motion static fallback. Effort: Low.
7. **Real product UI as hero, not stock** — lane IDs, timestamps, status chips (Flexport Drum-award restraint). Effort: Low.

**Skip:** purple AI gradients, scroll-jacking (Lando Norris F1 cautionary), stock crane/truck photos, default glassmorphism.

**Motion stack:** framer-motion → now `motion` (import from `motion/react`); covers 80–90% of spec. GSAP (free since Apr 2025, non-OSI) only for the pinned set-piece.

---

## 2. Competitor whitespace to win (from `01-competitor-teardown.md`)

The frozen lane-TAT table has **no competitor equivalent** — keep and strengthen it.

1. **Instant quote/estimate widget in hero** — Porter's "Get an Estimate (~2 mins)" and DHL's no-registration Freight Quotation Tool (instant price + transit, up to 2,500 kg). No Indian heavy-freight player does instant honest quotes. 3 fields (origin pin / destination pin / weight) → TAT + price band. **Category-leading if we ship it.** Effort: Med.
2. **Outcome-metric strip** (Flock Freight: 22% savings / 70% less transit / 99.3% damage-free / 97%+ on-time) — replaces vanity counters with outcome math that mirrors JOLT's value (faster, cheaper, safer). Effort: Low.
3. **Sticky self-serve utility bar** (Safexpress: TRACK / BOOK NOW / Waybill above hero) — signals real product. Effort: Low.
4. **Dual-audience routing** (sennder: Shippers vs Carriers, separate metrics + CTAs) — template for making B2B/D2C bands a routing device with per-audience proof. Effort: Med.
5. **Embedded live demo** (Flexport fake-account dashboard: shipments, map, milestones, exceptions) — strongest trust element seen anywhere; upgrade path for the dispatch board. Effort: High (phase 2).
6. **WhatsApp floating capture** (Blowhorn: address confirm / reschedule / live tracking via WhatsApp) — highest-converting Indian B2B channel, incumbents barely use it. Effort: Low.
7. **Transit-time calculator with printed SLA caveats** (BlueDart) — legitimizes TAT claims while de-risking. Effort: Med.

**Anti-patterns to avoid:** Delhivery's 20x-duplicated banner bug; XpressBees misattributing testimonials (QA attribution!); long 12–15-field forms (5–8% completion); login-gated calculators (Delhivery/Porter gate theirs — we ship ungated, it's free differentiation).

---

## 3. Component stack (from `03-component-harvest.md`)

**Backbone:** shadcn/ui (officially supports React 19 + Tailwind v4). **Motion:** Magic UI + Motion-Primitives (both MIT). All animated components must be `'use client'` islands.

| Section | Component | Source |
|---|---|---|
| Nav (scroll state) | Navbar Menu | ui.aceternity.com/components/navbar-menu |
| Hero dispatch board | Images Slider + Animated Beam | Aceternity / magicui.design/docs/components/animated-beam |
| Live lanes table | Table | ui.shadcn.com/docs/components/table |
| Logo marquee | react-fast-marquee (MIT) | npmjs.com/package/react-fast-marquee |
| Count-up metrics | Number Ticker | magicui.design/docs/components/number-ticker |
| Why Now timeline | Timeline | ui.aceternity.com/components/timeline |
| Workaround cards | Magic Card | magicui.design/docs/components/magic-card |
| Pipeline | Stepper | shadcnblocks.com/components/stepper |
| Terminal modal | Terminal + shadcn Dialog | magicui.design/docs/components/terminal |
| Scroll reveal | In View | motion-primitives.com/docs/in-view |
| Tracking map | react-map-gl + maplibre-gl (MIT/BSD-3) | visgl.github.io/react-map-gl |

**Avoid:** Mapbox (50k free loads/mo pricing trap), react-leaflet (Hippocratic License, non-OSI), Tailwind UI/Plus (sign-ups closing — Shopify acquisition), Cult UI (migrating to paid Pro).

---

## 4. Conversion spec (from `04-conversion-lead-capture.md`)

**Replaces the fake quirk modal with real machinery.** Full field-level spec in the report; architecture:

1. **Serviceability checker (nav CTA becomes real):** 2 pincode inputs → 6 states: LOADING → SERVED (tiered rate comparison + EDD + disclaimer) → PARTIAL → NOT-SERVED (**lead capture here** — "we're expanding to this pincode, get notified") → INVALID → ERROR. Ungated — Delhivery hides theirs behind login, so this is differentiation.
2. **3-step pilot flow:** screen 1 = name, email, phone, company (4 fields); screen 2 = lanes + monthly volume + payload class; screen 3 = success + reference ID + "call you back in 2 hours" promise. 25–40% completion vs 5–8% for long forms.
3. **WhatsApp click-to-chat** with pre-filled structured freight-query template (Company / Mode / Origin / Destination / Commodity / Weight / Readiness date) — ₹0 channel, V-Trans runs this in production; template captured verbatim in the report.
4. **Backend:** Next.js API route with env-gated provider `MOCK | SHEET | FORMSPREE` (Formspree free 50 subs/mo, official Next.js guide). UI never changes when the backend becomes real. Keep the quirk modal's typed-terminal charm for the waitlist/notify state only — never as a fake success.

---

## 5. Rail story ground truth (from `06-rail-reality-check.md`)

**The NTO story is real and precedented.** Copy implications:

1. **Amazon precedent:** first e-commerce on IR (2019), first on DFC (2023), 140+ trains / 130 routes / 100+ cities by Aug 2026. → The story is "we're bringing Amazon-grade rail execution to B2B heavy commerce" — powerful, and honest.
2. **SCR "Rail Parcel" app pilot (Feb 2026)** covers Hyderabad, Bengaluru, Chennai — validation AND competition. The "first" claim is dead; the "execution + SLA" claim is the moat (CAG 2024 found NO zonal railway has guaranteed-delivery SLAs — our guarantee is the differentiator).
3. **Train times back the physics:** HYD→BLR 8h15m (Vande Bharat), BLR→CHE 4h30m, MUM→HYD 14h10m. Rail costs ~half of road per tonne-km; multimodal parity at 500–600 km = our lane band.
4. **Don't claim DFC.** WDFC/EDFC serve north-west/east only; south corridors are DPR-stage. Say "scheduled express trains", not "dedicated freight corridors".
5. **Favorable tailwind:** 2025 liberalization removed turnover bars for parcel-cargo-express leases — small rail-first players can formally enter. Great founder-story material.
6. **Mechanics to be careful about:** default parcel caps at 150 kg/package (double rate >100 kg "bulky"); the real model is SLR compartment leasing (min 4-tonne unit). Vande Bharat parcel train (264T, 160 km/h) is announced but NOT in service — don't reference it as live infra.

---

## 6. Priority order (impact ÷ effort)

**Phase 1 — launch blockers:**
1. Claim corrections (Section 0) — copy rewrite of hero, metrics, lanes, gap.
2. Real serviceability checker + pilot flow + WhatsApp CTA (Section 4) — no fake forms live.
3. Footer links: replace dead anchors or remove (ToS/Privacy/SLA pages needed — SLA policy page doubles as claim-risk mitigation).

**Phase 2 — cheap uplift (Low effort, big perceived premium):**
4. Grain overlay + hairline borders + live counter timestamps.
5. Outcome-metric strip (Flock Freight style).
6. Sticky self-serve utility bar.
7. Marquee polish (hover pause, counter-direction accent).
8. SEO basics: real title (drop "· V5"), meta description, OG tags, favicon, robots/sitemap.

**Phase 3 — differentiation bets (Med–High effort):**
9. Instant quote widget in hero (category-leading).
10. Progressive dashboard reveal + pinned pipeline set-piece (GSAP).
11. Dual-audience routing for B2B/D2C.
12. Embedded live demo (phase 4, Flexport-grade).

---

*Research swarm sources: 01 competitor teardown (19 sites), 02 design trends (10+ sources), 03 component catalog (14 sections), 04 conversion playbook (20+ surfaces), 05 claims validation (~45 sources), 06 rail fact base (63 sources). All citations live in the respective files.*
