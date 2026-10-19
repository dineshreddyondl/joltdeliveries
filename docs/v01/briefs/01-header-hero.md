# V0.1 Brief — 01 · Header + Hero

> **LAYOUT FROZEN 2026-10-19** (founder: "let's freeze the layout first").
> Everything under §1 is frozen; §2 lists the only remaining open decisions.

## 1. Frozen layout — "B · single stage" (design-reference mock v5.1+)

Reference mock: `design-reference/jolt-hero-v01-proofrail-v5-learnings.html`
(images still being finalised — layout is what's frozen).

### Structure (top → bottom)
1. ~~Utility bar~~ — **removed 2026-10-19** (founder: benchmark has no black top strip; page starts at the nav). Supersedes the earlier LIVE-LANES-utility decision.
2. **Nav:** `JOLT Deliveries` wordmark · ghost `Check serviceability` · orange `Start pilot`.
3. **Hero grid** (2 cols → 1 col ≤768): copy left, stage right.
4. **Marquee:** Ather · Wakefit · Ola Electric · Duroflex (founder-authorized).
5. Sections below unchanged (metrics, narrative, etc.).

### Left column — **benchmark, retained as-is** (founder 2026-10-19)
- Eyebrow: `Express speed is no longer just for small parcels.`
- H1: `India's first express layer for heavy shipments.` with orange blaze on `heavy shipments` (founder override; A/B outcome variants available in the mock toggle but not default).
- Pillars: `JUST-IN-TIME EXECUTION` · `DIRECT DISPATCH` · `80% LESS CARBON` (founder-approved benchmark wording).
- **Dispatch line** (founder-kept element) sits above the table: schedule-derived from `lib/dispatch-data.ts`.
- **LIVE LANES table** (benchmark): header `ROUTE | TRADITIONAL LOGISTICS | JOLT DELIVERIES` — **founder override 2026-10-19** ("just keep like the benchmark"); the AGENTS.md guardrail against "Traditional Logistics" is overridden for the hero table and the sweep must exempt it. 11 rows incl. Delhi→Mumbai showcase (4–5 → 2 days); fast lanes marked ⚡; auto-scroll 16s, pause-on-hover.

### Right column — the stage
- **Card:** 1:1 rounded-22 stage, white, spotlight radial tint, grain overlay, hairline border, deep soft shadow.
- **Products:** 6-image parade, **1.2s per product = exactly one 7.2s loop** (one per category, no repeats). Conveyor entry: slide-in from right + springy settle (cubic-bezier .18,1.35,.4,1), camera flash per swap, spotlight pulse, contact shadow pulse.
- **Chip:** top-left, 3 lines — `CATEGORY / NAME / SPEC`. (No arrival line — redundant with the stamp.)
- **Stamp:** top-right — `DELIVERED IN 24–48 HRS` (wording pending §2.2). **Slams at the loop's DELIVERED flare and stays.**
- **Journey bar (inside the stage, bottom band, soft white gradient floor):**
  - Status row: blinking dot + live stage text (`INSTANT PICKUP → NEXT TRAIN OUT → OUT FOR DELIVERY → DELIVERED`) + `LOOP 07.2s` right.
  - Nodes + segments: 4 nodes (20px; DELIVERED 26px), 3 segments (3px). Segments fill with shimmer gradient; arrowhead rides each fill tip; nodes flash orange with expanding ripple when reached; labels below light up (ink + ●) as passed.
  - Times row: `09:10 · 09:40 · 10:30 · 11:02` (SAMPLE tag removed by founder instruction 2026-10-19).
- **Category ticker:** below the stage — 6 dots + `CURRENT CATEGORY → NEXT CATEGORY`.

### Timing — ONE master clock (non-negotiable)
- All motion derives from a single 7.2s CSS animation clock (mirror: production uses one `requestAnimationFrame` loop).
- Segment windows: 0–26% · 26–52% · 52–78% of loop; nodes flash at 4.5% / 30.5% / 56%; DELIVERED flare + stamp slam at 97.5–100% (frame-exact, verified delta 0ms).
- Parade index = floor(loopT / 1200) % 6 — the 6th product holds the stage through the slam.
- No `Date.now()` or independent intervals for the board.

### Reduced motion
- Static first product; journey bar fully lit; stamp visible static; no loops, no pulses; status shows `INSTANT PICKUP`.

### Responsive
- ≤768: single column, copy above stage. ≤480: times row hidden, labels 7px, nodes 14px, stagebar inset 12px, no overflow (verified 320/768/1440).

## 2. Open decisions (not layout — to close before implementation)

1. **H1 wording** — A `Parcel speed, finally, for the heavy stuff.` · B `Heavy shipments that arrive on time.` · C founder sentence `India's first express layer for heavy shipments.` (C = guardrail-override, recorded).
2. **Stamp wording** — `DELIVERED IN 24–48 HRS` vs `DELIVERED IN 24 HRS`.
2b. **Estimate widget placement** — keep under the hero grid (founder earlier) as its own section; not part of the frozen hero columns.
3. **Final images** (deferred by founder — "worry about wiring later"): 6 slots = sofa · alternator · [bench/armchair] · [bed candidate A/B/C/D or window scene] · crib · appliances. Cutout pipeline documented below.
4. **Dispatch schedule values** — real rows for `lib/dispatch-data.ts` (currently placeholders).

## 3. Image pipeline (when founder picks)
- Uniform background required (no visible boxes). Pure-white JPEGs → flood-fill cutout (feathered alpha). LIGHT-SCENE → ring-forced flood-fill. Full-res Freepik downloads preferred over 740px previews (pixelation fix); 2× Lanczos + unsharp interim.
- Candidates already converted in `public/assets/hero-final/`: alternator/crib/appliances/bench cutouts + 4 bed options (A mattress-1707 · B luxury-76586 · C luxury-79322 · D isolated-263672).

## 4. Acceptance criteria (for implementation)
1. Copy matches §1 verbatim once §2 picks land.
2. Single-clock timing spec verified in browser (delta 0ms flare↔stamp; 6×1.2s lock).
3. All states at 320/768/1440, reduced-motion pass, no overflow.
4. Gates: tsc · lint · build · sweep · Playwright · a11y green.
5. Founder review → freeze recorded.
