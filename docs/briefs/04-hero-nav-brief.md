# Brief 04 — Hero & Nav: exact frozen-v5 port (claim-corrected)

## Goal
Replace the React app's old dark inline hero and the orphan `components/sections/hero.tsx` with a faithful port of the frozen v5 hero from `frozen design/jolt-landing-v5.html` — white/orange design, dispatch board, lanes table — with claim-corrected copy. Localhost must look like the live reference at joltdeliveries.com/jolt-landing-v5.html, not like the old dark design.

## Read first
1. `AGENTS.md` — design system + dispatch board spec (9 payloads, 0.8s cadence, 7.2s clock sweep, stamp slam at 12, clean orange badge)
2. `frozen design/jolt-landing-v5.html` — nav (lines 610–638), hero (641–733), and its main `<style>` block for hero/nav/lane CSS tokens
3. `app/page.tsx` — current inline hero (to be replaced) + what must stay (MetricsBand, ServiceabilityChecker, proof strip)
4. `components/sections/metrics-band.tsx` — follow its conventions: `'use client'`, `import { motion } from 'motion/react'`, Tailwind classes, how it composes with page.tsx
5. `docs/next-version-plan.md` — hero + nav rows and acceptance criteria 1–3

## Spec

### Nav (port from frozen, keep wiring)
- Frozen structure: brand logo (inline SVG + "JOLT Deliveries" wordmark), primary "Start pilot →" (orange), ghost "Check serviceability".
- **Wire:** "Check serviceability" keeps the Brief 02 trigger (existing `ServiceabilityChecker` wiring must keep working). "Start pilot" = anchor `#pilot` only (pilot flow is Brief 03 — do not build it).
- Scroll state: add the frozen `scrolled` class behavior (solid/border on scroll).

### Hero left column (port + corrected copy, verbatim)
- Eyebrow: "Express speed is no longer just for small parcels."
- H1: **"India's rail-first express network for <em>200kg+ B2B</em>."** — keep the frozen blaze/flame accent treatment on the em span.
- Pillars: `Just-in-time execution` · `Direct dispatch` · `up to 89% less CO₂ per tonne-km` (orange-accent the number, add footnote marker † — footnote text: "Rail 10.6 vs road 55–82 gCO₂e/tonne-km (NITI Aayog 2021; Smart Freight Centre India 2025)").
- Live Lanes table: header row `Route | LTL / Part-Load | JOLT Deliveries` (NOT "Traditional Logistics"). Same 10 frozen routes with the same numbers, duplicated ×2 for the seamless scroll loop. **Add one showcase row: `Delhi → Mumbai | 4–5 days | 2 days`** at the top of the second cycle.
- `[ Live Lanes ]` label and styling: port as-is from frozen.

### Hero right column (dispatch board — faithful port)
- The 9 payload images from `/assets/payload-*.png` (public/assets) in the frozen order: sideboard, shock absorbers, armchair, wingback, sofa, furniture set, blower motor, crib, appliance set.
- Spec chip (`pdName`/`pdSpec`) with the frozen ITEMS data (name + weight/CBM).
- Clock face: SVG ring, 12 generated ticks, hand. One full revolution in **7.2s** (9 × 0.8s), completing at 12 o'clock exactly as the "DELIVERED IN 24 HRS" stamp slams (clean orange badge — no distressed variant).
- Camera flash on swaps, image pop on entry, shadow breathing, board micro-shake on stamp impact.
- Pause/play control; pause on hover; `prefers-reduced-motion` → static frame (no loop).
- Port the frozen file's own rAF timeline logic into a React `'use client'` component using refs — keep the math identical (PER=0.8, CLOCK_TURN=7.2, STAMP_OUT=8.6, T=9.0). No new animation libraries.

## Constraints
- `'use client'` island; `import { motion } from 'motion/react'` if needed — **never `framer-motion`**.
- White/orange tokens per AGENTS.md (white `#FFFFFF`, tint `#F5F7F2`, ink `#0C0E09`, orange `#C2410C`/`#E85A2C`, hairline borders).
- Replace `components/sections/hero.tsx` in place (the old orphan content is dead — overwrite it).
- Do NOT touch: `components/sections/metrics-band.tsx`, `components/serviceability/*`, `components/ui/dialog.tsx`, `frozen design/`, `public/`, `docs/`.
- `app/page.tsx`: remove the old inline dark hero, mount the new hero at top; keep MetricsBand, proof strip, and ServiceabilityChecker wiring.
- No invented numbers, no brand names, no new routes. Footer/other sections out of scope.

## Acceptance criteria
1. `npx tsc --noEmit` clean, `npm run build` green (report real output).
2. Page at `/` renders the white/orange frozen hero: nav, eyebrow, H1 with em accent, pillars, lanes table with "LTL / Part-Load" header and DEL→BOM row.
3. Dispatch board loops the 9 payloads with the 7.2s sweep + stamp slam; pause/play works; reduced-motion static frame.
4. "Check serviceability" still opens the Brief 02 checker; its states still work.
5. grep across `app/` + `components/` returns ZERO hits for banned strings: "first express layer", "Traditional Logistics", "99.2%", "1.4T", "3x faster" (unhedged), "80% less carbon".
6. Changes left UNCOMMITTED; list every copy change vs frozen in your summary.
