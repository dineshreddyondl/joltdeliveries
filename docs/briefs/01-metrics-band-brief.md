# Brief 01 — Metrics Band (Outcome Strip)

## Goal
Rebuild the frozen v5 `#metrics` section as a React outcome-metric strip: four defensible stats mapped to JOLT's value math (faster / reliable / cleaner / cash-velocity), with claims corrected per uplift-spec §0. Add the Stripe-style live treatment (mono timestamp + LIVE label + count-up on view) to the reliability card, with reduced-motion and mobile-stack fallbacks.

## Read first (ordered file list)
1. `/Users/dinesh/JOLT Website/AGENTS.md` — stack rules, claim-guardrails table, conventions
2. `/Users/dinesh/JOLT Website/docs/uplift-spec.md` — §0 (claim corrections; wins over frozen copy), §1.3 (live ticking counter + mono timestamp), §2.2 (outcome-metric strip)
3. `/Users/dinesh/JOLT Website/docs/research/05-claims-validation.md` — verdicts #2, #3, #4, #6 (footnote sources come from here)
4. `/Users/dinesh/JOLT Website/docs/research/01-competitor-teardown.md` — Flock Freight 4-stat strip entry (~lines 119–123)
5. `/Users/dinesh/JOLT Website/docs/research/02-design-motion-trends.md` — "Live counter / count-up as proof" (~lines 38–42)
6. `/Users/dinesh/JOLT Website/docs/research/03-component-harvest.md` — "Animated count-up metrics" (§5)
7. `/Users/dinesh/JOLT Website/frozen design/jolt-landing-v5.html` — frozen `#metrics` markup (lines 750–770), CSS (lines 359–367), design tokens (lines 20–27)
8. `/Users/dinesh/JOLT Website/app/page.tsx` — current React state (nav + hero + proof strip; NO metrics band exists yet — you will add it)

## Spec (layout, animation, states, responsive behavior)

**Location & shell.** New light section `id="metrics"` rendered in `app/page.tsx` immediately AFTER the proof-strip section. Frozen tokens: section background `#FFFFFF`, wrap max-width 1140px with 32px side padding, section padding `24px 0`. Include sr-only `<h2 id="metrics-heading">JOLT by the numbers</h2>` and `<section aria-labelledby="metrics-heading">`.

**Layout.** 4 cards, grid `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[22px]`. Card: white background, `1px solid rgba(12,14,9,.06)` border, radius 18px, padding `30px 26px`. Number: Space Grotesk 700, `clamp(32px,3.4vw,42px)`, letter-spacing `-0.03em`, line-height 1. Unit suffix: `0.62em`, color `#C2410C`, margin-left 2px, vertical-align `0.08em`. Label: 13px Inter, `#4A4E44`, line-height 1.5, margin-top 12px; the lead-in phrase is bold (600) `#0C0E09`, not italic. Hover (pointer devices only): shadow `0 24px 60px -24px rgba(12,14,9,.18)` + `translateY(-3px)`, 300ms — frozen behavior, keep.

**Live treatment (reliability card only).** Below the label: an 8px orange dot `#E85A2C` (pulse: scale 1→1.4 with opacity fade, 2s infinite) followed by `LIVE · UPDATED HH:MM:SS IST` in JetBrains Mono 11px, uppercase, letter-spacing 0.18em, color `#4A4E44`. The timestamp ticks every second (`Intl.DateTimeFormat`, `timeZone: 'Asia/Kolkata'`, 24h `HH:MM:SS`); start the interval on first in-view, pause on `document.visibilitychange` → hidden, clear on unmount.

**Animation.**
1. Reveal: cards fade/rise on first in-view — opacity 0→1, y 20→0, 300ms ease-out, 80ms stagger per card (matches the page's existing reveal pattern).
2. Count-up: the three single-number stats (100, 89, 3) animate 0→target over ~800ms ease-out, triggered ONCE by in-view on the band (`once: true`), after the reveal begins. The `24–48` range is static text (no ticker). Prefixes ("up to") and units are static text around the ticker, never part of the animated span.
3. Count-ups run once; they never re-trigger on re-scroll.

**Reduced motion (`prefers-reduced-motion: reduce`).** Render final numbers immediately (no count-up); disable reveal transform/stagger (elements visible, opacity 1); disable dot pulse and hover lift/shadow transition. The timestamp may keep ticking — it is a text content update, not motion.

**States.**
- SSR / JS not yet hydrated: final values visible, no animation — tickers must render their target value server-side (no "0" flash, no empty band without JS).
- Default (no ops data yet): reliability card renders the DEFAULT copy below.
- PLACEHOLDER Option A: reliability card renders the audited-adherence copy ONLY when the founder has supplied the flagged fields in the data config. Never render an invented percentage.
- Tab hidden: timestamp interval paused; resumes when visible.

**Responsive.** <640px: single-column stack, full-width cards. 640–1023px: 2×2. ≥1024px: 4 across. No horizontal overflow at 320px.

## Final copy (verbatim; bold = bold lead-in phrase; PLACEHOLDERs marked)

**Card 1 — Faster**
- Number: `24–48` (static text) + unit `h`
- Label: **B2B distributor arrivals** — `vs 3–7 days by LTL / Part-Load`

**Card 2 — Reliable (live)**
- DEFAULT (ship this until founder supplies data): Number `100` (count-up) + unit `%`; Label: **SLA-backed lanes** — `every booking ships with a printed arrival-window commitment`
- PLACEHOLDER Option A — use ONLY if the founder supplies ALL of: the audited adherence % (e.g. 99.2), the methodology ("% of shipments arriving within the committed window"), the window ("last 90 days, all live lanes"), and a money-back/credit remedy. Then: Number `[XX.X]` (count-up) + unit `%`; Label: **SLA adherence** — `across all live lanes — within committed window, last 90 days`; plus its footnote: `Definition: % of shipments arriving within the committed window, last 90 days, all live lanes. Money-back remedy on missed windows.` Do NOT publish Option A with only the % — AGENTS.md lists the bare 99.2% claim as a release blocker.
- Live line (both variants): `LIVE · UPDATED 14:42:08 IST` (dot rendered as an element, not a text character; timestamp = current Asia/Kolkata time)

**Card 3 — Cleaner**
- Number: `up to` (static prefix) + `89` (count-up) + unit `%`†
- Label: **Less CO₂ per tonne-km** — `vs road freight — rail-first linehaul`

**Card 4 — Cash-velocity**
- Number: `up to` (static prefix) + `3` (count-up) + unit `×`‡
- Label: **Faster rotation of in-transit working capital** — `on our longest lanes`

**Footnote block** (below the grid, 11–12px Inter, `#4A4E44`, superscript markers on cards 3 and 4):
- † `NITI Aayog, “Fast Tracking Freight in India” (2021): rail 11.5 vs road 101 g CO₂/tonne-km (~89% less). Smart Freight Centre India Default GHG Values (2025): 81–87% lower vs road HDT classes, WTW basis. ≈ 8 kg CO₂e avoided per 200 kg shipment HYD–BLR.`
- ‡ `Where rail transit cuts road transit 3× or more (e.g. HYD–BLR); applies to in-transit working capital, not total inventory.`

**Founder-supplied data — exact PLACEHOLDER fields to declare in `lib/metrics-data.ts` with TODO comments:**
1. `slaAdherencePercent` — audited % (rolling 90-day, all live lanes) + methodology + money-back remedy terms → unlocks Option A
2. `liveMetricBase` — real ops figure and refresh rate if the LIVE number itself should reflect ops data (today only the timestamp ticks; the % stays static until wired)
3. `perShipmentCO2Kg` — founder confirmation of ≈8.2 kg CO₂e per 200 kg shipment HYD–BLR before any per-shipment claim goes beyond the footnote

## Components (name, library, URL)
- `components/sections/metrics-band.tsx` — `'use client'` island; band, cards, live line, footnotes, reveal + count-up orchestration (this repo's own code)
- `components/ui/number-ticker.tsx` — Magic UI **Number Ticker** (MIT; copy-paste source, no npm package) — https://magicui.design/docs/components/number-ticker — install: `npx shadcn@latest add https://magicui.design/r/number-ticker` (if that CLI URL 404s, copy the source from the docs page)
- `lib/metrics-data.ts` — typed `METRICS` const + the PLACEHOLDER comments above (this repo's own code)
- motion (framer-motion rebranded): `import { motion, useInView } from "motion/react"` — https://motion.dev/docs

## Constraints (stack rules, a11y, reduced-motion, 'use client' island)
- Next.js 15 App Router, React 19, TypeScript, Tailwind v4. Do NOT import from `"framer-motion"` — use `motion/react` (package.json currently has framer-motion ^13.4.2; install `motion` if it is not present).
- Animated code lives ONLY inside the `'use client'` island; `app/page.tsx` stays a server component (add the import + `<MetricsBand />` after the proof strip; change nothing else there).
- Claim guardrails (AGENTS.md table + uplift §0): never render bare "99.2%", never "1.4T CO₂ per lane", keep the "up to" hedge on the carbon stat, label the LTL/Part-Load baseline, footnote the capital-rotation math. No invented metrics — use the PLACEHOLDER fields above.
- Do not edit `frozen design/` or `public/` HTML. Do not touch other sections.
- a11y: sr-only section heading; animated ticker span `aria-hidden` with an adjacent sr-only final-value text (e.g. "Up to 89 percent less CO₂ per tonne-kilometre versus road freight"); pulse dot `aria-hidden`; all label, footnote, and timestamp text `#4A4E44` on white (≥4.5:1 contrast; muted `#878B80` only for decorative separators); this band has no interactive elements — do not add links/buttons, so no focus-state work is needed.
- `prefers-reduced-motion` guard on every animation (see Spec).
- Copy claims must match uplift §0 wording; list every copy change in your PR summary (AGENTS.md convention).

## Acceptance criteria (numbered, checkable)
1. `#metrics` renders on the light background after the proof strip with exactly 4 cards + footnote block, using frozen tokens (1140px wrap, 22px gap, 18px radius, line-soft border).
2. Every visible string matches Final copy verbatim — no other numbers or wording appear.
3. Count-up: 100, 89, and 3 animate 0→target on first in-view (~800ms ease-out, once); `24–48` renders static.
4. Reliability card shows the pulsing LIVE dot + `UPDATED HH:MM:SS IST` in JetBrains Mono, ticking every second in Asia/Kolkata; interval pauses on hidden tab and clears on unmount.
5. With `prefers-reduced-motion: reduce`: no count-up, no pulse, no hover lift, no reveal transform; final values visible immediately.
6. Responsive: 1-col stack <640px, 2×2 at 640–1023px, 4-across ≥1024px; no horizontal scroll at 320px.
7. Server-rendered HTML contains the final numbers (no flash of zeros, no empty band without JS).
8. Only files under `components/sections/`, `components/ui/`, `lib/`, plus the single `<MetricsBand />` insertion in `app/page.tsx`, are changed.
9. `npm run build` passes with zero TypeScript errors.
10. No `framer-motion` import appears anywhere in the new code; motion APIs come from `motion/react`.
11. Reliability card ships in the DEFAULT variant; Option A strings exist in code only behind the data-config flag, clearly commented as founder-gated.
12. Footnotes † and ‡ render verbatim with correct superscript markers on cards 3 and 4.
13. All label, footnote, and timestamp text uses `#4A4E44` on white.
14. PR summary lists every copy change vs the frozen file (see next section).

## Out of scope
Real-time SLA/ops API wiring (data contract only) · any other section (nav, hero, proof strip, lanes, footer) · editing `frozen design/` or `public/` HTML · new npm packages beyond `motion` · GSAP · fake logos or client names · adding links/CTAs to this band · SEO/meta work.

## Copy changes vs frozen file (list each)
1. Card 1: `80% Lower emissions vs road freight — rail-first linehaul` → `up to 89% less CO₂ per tonne-km vs road freight — rail-first linehaul` + † footnote (strengthened per uplift §0 #2; 89% = NITI Aayog figure, SFC range in footnote).
2. Card 2: bare `99.2% SLA adherence across all live lanes` → default `100% SLA-backed lanes — every booking ships with a printed arrival-window commitment`; audited-% version gated as Option A PLACEHOLDER (definition + methodology + money-back required before it may ship).
3. Card 3: `1.4T CO₂ saved per lane vs road` → REMOVED (unsupported per §0 #4); the defensible per-shipment figure (≈8 kg CO₂e per 200 kg shipment HYD–BLR) moves into the † footnote.
4. Card 4 (new, replaces the 1.4T slot): `Up to 3× faster rotation of in-transit working capital on our longest lanes` + ‡ footnote (reworded §0 #6).
5. Card 1 label: `Distributor arrivals — B2B replenishment, guaranteed` → `B2B distributor arrivals — vs 3–7 days by LTL / Part-Load` (comparison baseline labeled per guardrail; the "guaranteed" story now lives on card 2).
6. Added: LIVE dot + ticking mono timestamp line on card 2 (per §1.3).
7. Added: footnote block with cited sources under the grid.
8. Added: sr-only heading `JOLT by the numbers`.
