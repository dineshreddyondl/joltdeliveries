# JOLT v6 — Upgrade Plan

> Planning doc only — no code changes here. Every verdict traces to `uplift-spec.md` (§) or `docs/research/01–06` (file:section). Briefs 01–02 exist and are DONE in code; 03+ are assigned below.

## v6 thesis

v6 is the claim-correct, conversion-real React port of the frozen v5 landing page for heavy-shipment B2B buyers (distributors, D2C brands, auto-parts makers). It fixes two release-blocking defects: (1) six of v5's eight claims fail validation (uplift §0) and (2) every v5 CTA terminates in a fake quirk terminal instead of a real flow (AGENTS.md conversion machinery, research 04:Anti-patterns #1). It keeps the white/orange hero + dispatch board + lanes table — the site's only category-leading asset (research 01:Exec brief, research 02:Exec brief).

## Current React state (do NOT rebuild these)

- `app/page.tsx`: nav + dark inline hero + proof strip + `<MetricsBand />`. **The inline hero is off-system** (dark zinc, not frozen white/orange per AGENTS.md design system) — v6 replaces it, doesn't tune it.
- `components/sections/metrics-band.tsx` + `components/ui/number-ticker.tsx` + `lib/metrics-data.ts` — **Brief 01 shipped and committed** (claim-correct outcome strip: 24–48h / 100% SLA-backed / up-to-89% CO₂† / up-to-3×‡ + LIVE IST timestamp, founder-gated Option A).
- `components/serviceability/serviceability-checker.tsx` + `components/ui/dialog.tsx` — **Brief 02 shipped, UNCOMMITTED**: 6-state ungated pincode checker in nav, WhatsApp deep links via single `WHATSAPP_NUMBER` const (placeholder `91XXXXXXXXXX`).
- API routes (all mock-gated via `lib/api-proxy.ts`, `JOLT_API_MOCK` default): `/api/serviceability` (Brief 02 shape incl. PARTIAL + rate band), `/api/pilot` (mock + reference ID), `/api/estimate` (mock estimateInr + eta).
- `lib/validation.ts`: serviceability/pilot/estimate zod schemas. `lib/api-proxy.ts`: MOCK|proxy switch.
- `next.config.ts`: `'/' → /jolt-landing-v5.html` redirect **TEMP-DISABLED** (React app currently served at `/`).
- Orphaned: `components/sections/hero.tsx` (old brutalist-mono hero, imports `framer-motion`, stale copy "India's First Express Layer", fake Wakefit/Ola/Duroflex/Ather proof) — **not imported anywhere; delete, do not reuse**.
- Repo hygiene gaps: `docs/` entirely untracked; both `framer-motion@^13` and `motion@^14` installed (normalize to `motion`); no eslint/prettier config exists (`next lint` unconfigured).

## Section verdicts

| # | v5 block | Verdict | Changes | Corrected copy (verbatim, uplift §0) | Justification | Effort | Brief |
|---|---|---|---|---|---|---|---|
| 1 | Nav | CHANGE | Keep labels; rewire "Check serviceability" (done — Brief 02) and "Start a Pilot" → pilot flow; add sticky self-serve utility bar (TRACK / CHECK / BOOK per Safexpress) | n/a (no claims) | uplift §2.3; research 01:Per-site Safexpress | Med | 03, 04, 09 |
| 2 | Hero (dispatch board + lanes table) | CHANGE | Port frozen white/orange hero + dispatch board exactly (9 payloads, 0.8s cadence, 7.2s clock sweep, stamp slam at 12 — AGENTS.md spec); rebuild lanes table; add instant-estimate widget (phase 3) | Headline: "India's first express layer for heavy shipments" → **"India's rail-first express network for 200kg+ B2B"** (§0 #1). Lanes column header: "Traditional Logistics" → **"LTL / Part-Load"**; add credible showcase lane DEL→BOM (2 days vs 4–5 days road) (§0 #5). Pillar: "80% less carbon" → **"up to 89% less CO₂ per tonne-km" + footnote** (§0 #2) | uplift §0 #1/#2/#5, §1.7, §2.1; research 05:§1/§2/§5, 06:Train-times, 03:§2 | High | 04 |
| 3 | Customer marquee | CHANGE | Replace Ather/Wakefit/Ola Electric/Duroflex with generic/"logos with receipts" chips until founder verifies a real relationship (two-tier Retool pattern) | n/a (names removed, nothing invented) | AGENTS.md guardrails; uplift §0 real-brand risk; research 02:§9 | Low | 09 |
| 4 | Metrics | KEEP | Already shipped as Brief 01; verify-only | Brief 01 copy is already §0-correct (§0 #2/#3/#4/#6) | uplift §2.2; research 05:§2–§6 | Low | — |
| 5 | Why Now | CHANGE | Keep timeline structure; soften item 01, reword item 02 | Item 01: "Quick-commerce killed consumer patience" → **"Quick commerce reset delivery expectations across Indian commerce"** (§0 #8). Item 02: "Cut transit to 2 days, and they rotate cash 3x faster" → **"Up to 3x faster rotation of in-transit working capital on our longest lanes" + footnote** (§0 #6) | uplift §0 #6/#8; research 05:§6/§8 | Low | 05 |
| 6 | The Gap | KEEP | Narrative only, no quantified claims; verify no banned wording survives the port | none | research 05:§7 (expectation framing); 01:Anti-patterns | Low | 05 |
| 7 | How It Works | CHANGE | Keep NTO/Hubless/Visibility pipeline; correct carbon line; rail language per §5 (leased scheduled capacity, "scheduled express trains", never DFC); optional phase-3 pinned GSAP set-piece | "…slashing carbon emissions by 80%" → **"up to 89% less CO₂ per tonne-km vs road (footnote)"** (§0 #2) | uplift §5.1–§5.6; research 06:What-this-means #1–#4; 02:§6 | Low (Med w/ set-piece) | 06 |
| 8 | Ecosystem | CHANGE | Upgrade B2B/D2C bands to dual-audience routing (per-audience proof + CTAs, sennder/LoadShare pattern); integrations marquee ships only after each integration is verified to exist (SAP/Oracle/Clickpost/Pando/eShipz are real trademarks) | n/a | uplift §2.4, §0 real-brand risk; research 01:Exec brief + §9 | Med | 07 |
| 9 | Challenge CTA | CHANGE | Keep the challenge promise (it IS the money-back remedy §0 #3 demands) but wire "Start Pilot" → real pilot flow and "Check Active Routes" → lanes section; fineprint cross-references SLA page | Keep: "If we miss the guaranteed TAT, the shipment is free." (publishable only together with SLA-page definition + methodology + remedy — §0 #3) | uplift §0 #3, §4.2; research 05:§3 + Fineprint precedents | Low | 08 |
| 10 | Footer | CHANGE | Replace dead anchors with real ToS/Privacy/SLA pages (SLA page = claim-risk mitigation); fix tagline | "India's first express layer for heavy commerce." → **"India's rail-first express network for 200kg+ B2B"** (§0 #1) | uplift §6 phase 1 #3; AGENTS.md conventions | Med | 08 |
| 11 | Quirk modal | KILL | Fake typed success = silent lead destruction; keep only terminal chrome for the notify-me waitlist state (NOT-SERVED capture + footer email) | n/a | AGENTS.md conversion machinery; uplift §4.4; research 04:Anti-patterns #1 | Low | 10 |
| 12 | Pilot flow (`#pilot`) | NEW | 3-step: (name, email, phone, company) → (lanes, volume, payload class) → success + ref ID + 2-hour callback promise; posts `/api/pilot` (exists); WhatsApp alternative at every step | Trust row: "We'll call within 2 business hours — no spam, ever" (research 04 §Pilot) | uplift §4.2; research 04:§Pilot/B2B + API-route pattern | Med | 03 |
| 13 | Floating WhatsApp capture | NEW | Mobile-first floating wa.me launcher + pre-filled structured freight-query template (Company/Mode/Origin/Destination/Commodity/Weight/Readiness) | V-Trans template, research 04:§WhatsApp (verbatim) | uplift §2.6, §4.3; research 04:§WhatsApp | Low | 03 |
| 14 | Sticky utility bar | NEW | Pinned TRACK / BOOK NOW strip above hero (Safexpress) — signals real product | n/a | uplift §2.3; research 01:Per-site Safexpress | Low | 09 |
| 15 | Legal pages | NEW | ToS / Privacy / SLA (SLA page carries §0 #3 definition + methodology + money-back remedy; referenced from metrics + CTA fineprint) | SLA remedy wording per §0 #3 | uplift §6 phase 1 #3; research 05:§3 | Med | 08 |
| 16 | SEO/meta | NEW | Real title (drop "· V5"), meta description, OG tags, favicon, robots.txt, sitemap | n/a | uplift §6 phase 2 #8 | Low | 11 |
| 17 | Instant estimate widget | NEW | Hero 3-field (origin pin / dest pin / weight) → TAT + ₹ band via existing `/api/estimate` mock + ClickPost-style disclaimer; ungated | Disclaimers per research 04:§Checker patterns (ClickPost verbatim pattern) | uplift §2.1; research 01:§2, 04:§Quote flows | Med | 12 |
| 18 | Embedded live demo | NEW | Phase 4 only: clickable fake-account tracking view upgrade of dispatch board | n/a | uplift §2.5, §6 #12; research 01:§Flexport | High | 13 |

Verdict counts: KEEP 2 · CHANGE 8 · NEW 7 · KILL 1.

## Priority order

- **Phase 0 — repo hygiene (PM/first swarm, no user-visible change):** commit uncommitted Brief 02 + `docs/` as a base; delete orphan `components/sections/hero.tsx`; normalize to `motion` imports (drop `framer-motion` dep); stand up eslint config (fixes `npm run lint`); decide the deploy-redirect question (see Risks) before any more section work.
- **Phase 1 — launch blockers (uplift §6.1):** Brief 04 (hero/nav claims + lanes table), Brief 05 (why-now/gap), Brief 08 (CTA/footer/legal), Brief 03 (pilot + WhatsApp + floating capture), Brief 10 (quirk kill → notify-me only). Gate: claim-compliance sweep across React **and** `public/` HTML, then deploy decision.
- **Phase 2 — cheap uplift (uplift §6.2):** Brief 09 (marquee + utility bar + grain/hairline-border tokens), Brief 11 (SEO/meta). Metrics band already covers §1.3/§2.2.
- **Phase 3 — differentiation bets (uplift §6.3):** Brief 12 (instant estimate widget + progressive dashboard reveal), Brief 06 set-piece (GSAP pinned pipeline), Brief 07 (dual-audience routing).
- **Phase 4 — product-grade (uplift §6.4):** Brief 13 (embedded live demo, map layer), real pincode/rate data (git-committed JSON), provider switch MOCK → SHEET/FORMSPREE.

## Swarm fan-out plan

| Swarm | Owns (briefs) | Reads | Delivers | Verification |
|---|---|---|---|---|
| S1 Hero & Nav | 04 | AGENTS.md; uplift §0 #1/#2/#5, §1.7; research 03:§1–§2, 05:§1/§2/§5, 06:Train-times | `components/sections/hero.tsx` (frozen port incl. dispatch board + lanes table), `components/sections/nav.tsx` | `npm run build`; freeze-frame vs `frozen design/` (`?v=N#t=SS.S`); grep for banned strings (AGENTS.md table) |
| S2 Narrative | 05, 06 | uplift §0 #6/#7/#8, §5; research 05:§6–§8, 06:Exec/What-this-means, 02:§6 | `why-now.tsx`, `gap.tsx`, `how-it-works.tsx` | copy diff vs uplift §0 verbatim; reduced-motion + a11y checks |
| S3 Conversion | 03, 10 | uplift §4; research 04 (all); `lib/validation.ts`, `/api/pilot` | `pilot-flow.tsx`, floating WhatsApp launcher, notify-me modal (quirk chrome only), nav wiring | 3-step flow posts and renders ref ID; every CTA resolves (no dead ends); a11y dialog semantics |
| S4 Proof & polish | 09, 11 | uplift §1.1/§1.6, §2.3; research 01:§6/§10, 02:§1/§5, 03:§4 | `marquee.tsx` (generic until verified), utility bar, grain/hairline tokens, SEO/meta/favicon/robots/sitemap | lint + build; reduced-motion static fallback; OG tags present in served HTML |
| S5 Bottom of page | 08 | uplift §0 #1/#3, §6.1; research 05:§3, 01:§Fineprint | `cta.tsx`, `footer.tsx`, `app/(legal)/tos|privacy|sla` pages | zero dead anchors; money-back wording matches SLA page; ToS/Privacy/SLA route 200s |
| S6 Ecosystem | 07 | uplift §2.4, §0 real-brand risk; research 01:§9, 02 | `ecosystem.tsx` dual-audience bands + integrations list (each with verify-status comment) | no unverified trademark ships; per-audience CTA resolves to pilot flow |
| S7 Phase-3 widgets | 12 (+ 06 set-piece, 13) | uplift §2.1, §2.5; research 04:§Quote flows, 01:§Flexport, 02:§4/§6 | hero estimate widget (uses `/api/estimate`), dashboard reveal choreography, (13: demo board) | rate band + disclaimers render from API; ungated; GSAP only in pipeline set-piece |
| S8 Release gate | all | AGENTS.md guardrails; uplift §0; this plan | claim-compliance sweep (React + `public/`), build/lint results, deploy-redirect recommendation | every acceptance criterion below checked true |

Each swarm delivers `components/sections/<name>.tsx` (+ `'use client'` islands), PR summary listing every copy change vs frozen v5 (AGENTS.md workflow), and never edits `frozen design/` or `public/` unless the PM briefs it explicitly.

## Acceptance criteria for v6

1. Zero banned claims render anywhere (React app or `public/jolt-landing-v5.html`): grep for "first express layer", bare "99.2%", "1.4T", "3x faster" (unhedged), "Traditional Logistics" column label, DFC/Vande-Bharat-parcel-as-live references.
2. Hero headline reads exactly "India's rail-first express network for 200kg+ B2B" (or founder-approved scoped variant) with corrected lanes table ("LTL / Part-Load" baseline, DEL→BOM showcase lane).
3. Dispatch board matches AGENTS.md spec: 9 payloads, 0.8s cadence, 7.2s clock sweep completing exactly as the DELIVERED IN 24 HRS stamp slams (clean orange badge — no distressed variant).
4. Metrics band renders Brief 01 final copy verbatim with †/‡ footnotes; reliability card stays in DEFAULT variant until founder supplies audited data.
5. Every CTA terminates in a real flow: checker → `/api/serviceability` (6 states), pilot → `/api/pilot` (3 steps + ref ID + 2-hour promise), WhatsApp → `wa.me/<production number>` — **no placeholder `91XXXXXXXXXX` ships**.
6. Quirk terminal appears only as notify-me waitlist state; no fake success chatter anywhere.
7. Footer has no dead anchors; ToS, Privacy, and SLA pages exist and the SLA page carries definition + methodology + money-back remedy (mirrors CTA fineprint).
8. `npm run build` passes with zero TS errors; `npm run lint` passes with eslint configured in Phase 0.
9. A11y: `prefers-reduced-motion` guards on every animation, contrast ≥ 4.5:1 body text, visible focus states, Radix dialog semantics, aria-live announcers.
10. Real-brand marquees (customers or integrations) render only with a verified relationship recorded in the PR/code comment; otherwise generic.
11. `/` serves the claim-correct version: either React v6 (redirect stays disabled) or restored static redirect to a claim-corrected `public/` copy — decision recorded in the repo.
12. SEO: real `<title>` (no "· V5"), meta description, OG tags, favicon, robots.txt, sitemap present in served HTML.
13. Phase-3 estimate widget shows rate band + ClickPost-style disclaimer and is ungated (no login, no signup).
14. Only `components/`, `app/`, `lib/`, `public/` (PM-approved only), and `docs/` change in v6; `frozen design/` untouched except PM-directed syncs.

## Risks

1. **Deploy redirect decision (highest):** `/` currently serves the partially-ported React app while `public/jolt-landing-v5.html` (deployed via GitHub → Cloudflare) still carries six invalid claims incl. the banned headline. Until Phase 1 lands, the safest state is either the restored `'/' → /jolt-landing-v5.html` redirect or a claim-corrected `public/` copy — decide in Phase 0, before any new section work piles onto a divergent route.
2. **WhatsApp placeholder:** `WHATSAPP_NUMBER = "91XXXXXXXXXX"` makes every checker/pilot WhatsApp escape hatch dead. Release blocker — needs the production number (and per research 04:Trust rules, a named human + reply-time promise).
3. **Real-brand marquees:** customer logos (Ather/Wakefit/Ola Electric/Duroflex) and integrations (SAP/Oracle/Clickpost/Pando/eShipz) in v5 are unverified relationships; interop claims are lower-risk than customer logos but still need per-integration existence checks. Ship generic until verified — never invent (AGENTS.md guardrail).
4. **Lint gap:** no eslint/prettier config in repo; `npm run lint` (`next lint`) will run guided setup / fail until configured — and `next lint` is deprecated upstream. Briefs 01/02 cite lint as an acceptance criterion; Phase 0 must either configure ESLint or amend that criterion.
5. **Claim-compliance drift:** two divergent surfaces (React app, static `public/` HTML) + an orphaned `hero.tsx` with stale claims make regressions easy. Every swarm must grep the AGENTS.md banned-claims table; the S8 release gate re-runs it across both surfaces; founder-gated metrics (Option A) must never render without the audited fields.
6. **Duplicate motion libs:** `framer-motion` and `motion` both installed (AGENTS.md mandates `motion/react`); orphan `hero.tsx` still imports `framer-motion`. Normalize in Phase 0 to avoid bundle bloat and divergent animation behavior.
