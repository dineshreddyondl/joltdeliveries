# Freeze Log — V0.1

> A unit is frozen ONLY after the founder reviews and signs it off. Freezing one unit opens the next brief.

| # | Unit | Brief | Status | Freeze date | Founder notes |
|---|---|---|---|---|---|
| 1 | Header + Hero | `briefs/01-header-hero.md` | brief drafted, awaiting founder review | — | — |
| 2 | Metrics + Marquee | — | queued | — | — |
| 3 | Narrative arc | — | queued | — | — |
| 4 | Ecosystem | — | queued | — | — |
| 5 | CTA + Footer | — | queued | — | — |
| 6 | Conversion surfaces | — | queued | — | — |
| 7 | Legal pages | — | queued | — | — |
| 8 | Whole-page passes | — | queued | — | — |
| 2026-10-19 | Header+Hero **layout** | Founder: 'let's freeze the layout first' (images wired later). B single-stage spec locked: outcome-first copy, check-card + dispatch line, 6x1.2s parade, in-stage journey bar (4 stages), single master clock, slam-and-stay stamp, chip top-left, SAMPLE tag removed from times row. Open: H1 wording, stamp wording, final images, schedule values. |
| 2026-10-19 | Lane-table header | Founder: 'just keep like the benchmark' — column header = `Traditional Logistics` (guardrail override; sweep exemption to be applied on implementation). |
| 2026-10-19 | Utility bar | Removed (founder 'x' on the black strip; benchmark starts at nav). Supersedes LIVE-LANES utility decision. |
| 2026-10-19 | Hero dot-to-dot | Founder: whole hero identical to benchmark EXCEPT the right-side stage animation. Ported: real logo nav, aurora, blaze+embers, benchmark marquee; utility bar already removed. |
| 2026-10-19 | Loop rhythm | Start-stop: 7.2s journey + 2.4s delivered hold + clean reset. Clock-journey (12/3/6/9) variant rejected by founder — images must stay dominant. |
| 2026-10-19 | Dispatch line | Removed from hero (founder: PLACEHOLDER DATA tag + unverified times look unfinished on the live hero). Left column = pure benchmark. `lib/dispatch-data.ts` retained for confirmed schedule values. |
| 2026-10-19 | Estimate section + marquee | Instant freight estimate section removed totally (founder); `EstimateWidget` component deleted (unreferenced). Brands marquee tagged onto the hero section — it now renders inside the hero header, per the frozen mock. `/api/estimate` route retained, unreferenced. |
| 2026-10-19 | Why Now | **Frozen** (first section of the section-by-section freeze). Four checkpoints closed: 1) copy locked — lede tightened to "Heavy commerce moved online. Logistics didn't." (removes overlap with Gap's lede); claims all pass guardrails ("Up to 3x faster rotation…" exact allowed wording + footnote). 2) Spacing normalized to the 24px rhythm (22→24, 20→24, 44→48, 56→72); 64px padding symmetric with neighbors, measured at 320/768/1440. 3) Narrative continuity confirmed: proof → urgency → "▸ Until JOLT." hands off to Gap. 4) No new graphics needed; added timeline micro-motion (node spring-in + spine segments ignite on reveal, reduced-motion static). Left-aligned heads per founder decision. |
