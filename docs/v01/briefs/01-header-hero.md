# V0.1 Brief — 01 · Header + Hero

## 1. Job to be done & target user
- **Who:** B2B distributors / logistics & supply-chain managers (primary), D2C brand ops (secondary). Skeptical buyers who have been burned by courier/LTL workarounds.
- **Must believe in 5 seconds:** JOLT moves *heavy* commerce — many categories, not just furniture — with express speed and a real SLA.
- **Conversion job:** action — open the serviceability checker, start a pilot, or estimate a lane. Primary CTA: pilot.

## 2. Full copy spec (current strings, verbatim)
- Utility bar: `NETWORK LIVE` · `CHECK LANE` · `START PILOT` · `WHATSAPP`
- Nav: `JOLT Deliveries` wordmark · `Start pilot` · `Check serviceability`
- Eyebrow: `Express speed is no longer just for small parcels.`
- H1: `India's rail-first express network for 200kg+ B2B.` (em: `200kg+ B2B`)
- Pillars: `Just-in-time execution` · `Direct dispatch` · `up to 89% less CO₂ per tonne-km`
- Lanes: `[ Live Lanes ]` · header `Route / LTL / Part-Load / JOLT Deliveries` · 11 rows + DEL→BOM showcase
- Board: `LIVE` · `9 PAYLOADS` · stamp `DELIVERED IN 24 HRS` · chip `CATEGORY / NAME / SPEC` (9 payloads, category-alternating parade)
- Estimate widget: `INSTANT FREIGHT ESTIMATE` · `FREE · NO SIGNUP` · result `Indicative estimate: ₹X · <eta>` · disclaimers · `Get a contract rate on WhatsApp →`
- Marquee: `Ather · Wakefit · Ola Electric · Duroflex` (founder-authorized)

## 3. Claims & data register
| Claim | Status | Notes |
|---|---|---|
| "rail-first express network for 200kg+ B2B" | ✅ | uplift §0 #1 scoped replacement |
| "up to 89% less CO₂ per tonne-km" | ⚠️ | **conflicts with metrics band "80% Lower emissions"** (benchmark override) — see Founder inputs #1 |
| Lanes TATs vs "LTL / Part-Load" | ✅ | §0 #5 baseline |
| DEL→BOM 4–5 days → 2 days | ✅ | showcase lane, §0 #5 |
| "NETWORK LIVE" | ⚠️ | live-status claim, not wired to ops — see Founder inputs #2 |
| Board parade specs (5 KG alternator, 9 KG gear, 30 KG mattress…) | ⚠️ | illustrative placeholders — founder to confirm |
| "DELIVERED IN 24 HRS" stamp | ⚠️ | lane-dependent; illustrative board, keep as product promise |
| Customer brand names | ✅ | founder-authorized override recorded |

## 4. Layout & visual deltas vs skeleton
- Kept 1:1: nav, eyebrow, H1 blaze, pillars, lanes table, board + clock spec (9 payloads · 0.8s · 7.2s sweep · stamp slam), marquee.
- Deltas (all founder-approved or pending):
  - Parade re-ordered category-alternating + category tag in chip ✅ (approved)
  - Estimate widget added under the hero grid ⚠️ — **placement decision open**
  - NITI footnotes removed ✅
  - Board image opacity bug fixed ✅
  - Utility bar added above nav ✅

## 5. Motion & states matrix
- Board: 0.8s cadence, 7.2s sweep, stamp slam 8.6s, hover-pause, pause/play button, reduced-motion static frame.
- Blaze: 580ms entrance; pillars/lanes/board fade-up (ready-gated, hydration-safe).
- Estimate widget: idle/loading (≥400ms)/result/error/invalid; per-field errors; reduced-motion static.
- Marquee: 26s CSS loop, hover-pause, edge mask.
- All states verified at 320/768/1440 in the QA suite.

## 6. A11y & responsive
- Contrast ≥4.5:1 (audited 0 failures), board aria-label, pause button labeled, focus-visible orange, reduced-motion everywhere, no 320px overflow.

## 7. Performance notes
- **Concern:** 9 payload PNGs are 160–380 KB each (~2.5 MB board). Proposal: compress/convert to WebP (same files, served as-is; board keeps raw `<img>` for the rAF classList loop — compressed files still work). Add as acceptance criterion.

## 8. Founder inputs needed (before build)
1. **Unify the carbon figure:** hero "up to 89%" vs metrics "80% Lower emissions" — pick one (recommend: keep 89% hero, set metrics to "up to 89% Less CO₂ per tonne-km" — or full benchmark 80% both).
2. **"NETWORK LIVE"** in the utility bar — keep, reword, or wire to real ops later?
3. **Estimate widget placement** — keep under the hero grid, move elsewhere, or remove?
4. **Payload specs** — confirm or correct the 9 chip specs.
5. Any pillar-row wording changes (e.g., add "Guaranteed SLA" pillar).

## 9. Acceptance criteria (checkable)
1. All copy strings match this brief verbatim after founder edits.
2. Parade cycles the approved 9-item sequence; board images render (computed opacity 1); clock spec intact.
3. Estimate widget passes E2E (result + disclaimers) at 3 widths.
4. `tsc`/`eslint`/`next build`/banned-sweep/Playwright/a11y all green.
5. Visual QA: screenshots at 320/768/1440 + board freeze-frames reviewed by founder.
6. Performance: board asset total < 1.2 MB after compression.
7. Founder review passed → freeze recorded.

## 10. Freeze
- [ ] Founder review · date · notes → freeze-log.md

## Out of scope
Metrics band content · narrative sections · ecosystem · CTA/footer · legal · new routes (intake process applies).
