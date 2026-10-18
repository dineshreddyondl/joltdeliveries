# Brief 05 — Why Now + The Unfilled Gap (narrative sections)

## Goal
Port the frozen v5 "Why Now" (dark) and "The Unfilled Gap" (light `#F4F2ED`) sections into React with **claim-corrected copy** per uplift-spec §0 and the committed narrative audit (`docs/audits/narrative-claim-audit.md`). Faithful frozen styling (timeline + workaround cards + verdict), zero new claims.

## Read first
1. `AGENTS.md` claim guardrails · `docs/uplift-spec.md` §0 (#6, #7, #8)
2. `docs/audits/narrative-claim-audit.md` — verbatim replacements (authoritative for this brief)
3. `docs/next-version-plan.md` rows 5 + 6
4. `frozen design/jolt-landing-v5.html` lines 772–823 (markup) and CSS: `.sec`, `.sec-tag`, `.timeline`, `.tl-*`, `.term-line`, `.problem`, `.trap*`, `.verdict`, `.rv` (lines 370–413, 535–551)
5. `components/sections/metrics-band.tsx` — follow the ready-gated reveal + in-view pattern

## Copy (final — verbatim; corrections vs frozen marked)

**Why Now** (`components/sections/why-now.tsx`, dark `#08080A`):
- tag `Why Now`
- H2: `Your customers won't wait for anything anymore.` — **[FOUNDER CHOICE]** audit dropped the invented "10 days"; alternate "Your customers stopped waiting. Logistics didn't notice." if PM prefers punchier.
- lede (unchanged): `Heavy commerce moved online, but logistics didn't. To scale today, you need a network built for modern speed—not legacy hub-and-spoke delays.`
- 01 The Expectation Gap: `Quick commerce reset delivery expectations across Indian commerce. Buyers now expect parcel-speed for 200kg payloads. Traditional freight was built around consolidation, not speed.` (§0 #8, #7)
- 02 The Working Capital Trap: `Long transit times are a cash trap for your distributors. Every day in transit is dead capital. Up to 3x faster rotation of in-transit working capital on our longest lanes.` + ‡ footnote (`lib/metrics-data.ts` FOOTNOTES.capital) (§0 #6)
- 03 The Tech Unlock: `The capacity always existed on the Indian rail network — the cleanest way to move weight across India. But it was a black box. We built the orchestration tech to stitch it end-to-end and back it with a guaranteed SLA.` (SLA promise publishes only with the SLA page — row 9/15)
- term-line: `▸ Until JOLT.`

**The Unfilled Gap** (`components/sections/gap.tsx`, `#F4F2ED`):
- tag `The Unfilled Gap`
- H2 (unchanged): `You never had a choice. You were forced to use networks that were never built for you.`
- lede: `Heavy B2B never got a network built for it. You've just been surviving on workarounds—hacking logistics models designed for entirely different categories.` ("didn't exist" → de-firsted per audit)
- Workaround 01 (courier): `You force heavy payloads into parcel networks for speed. The infrastructure breaks: goods get damaged, delays hide behind optimistic tracking, and punitive dimensional pricing destroys your unit economics.` · tagline `A model built for small parcels`
- Workaround 02 (freight): frozen copy unchanged · tagline `A model built for bulk consolidation`
- verdict (unchanged): `"The system isn't broken. It just wasn't built for you."`

## Constraints
- `'use client'` islands with the ready-gated reveal pattern (SSR visible, no hydration mismatch, reduced-motion static) — same as `metrics-band.tsx`.
- Port frozen CSS 1:1 into module files (`why-now.module.css`, `gap.module.css`); dark hairline + grain per design system.
- Compose in `app/page.tsx` after `<MetricsBand />`: `<WhyNow />` then `<Gap />`.
- No new claims, numbers, or names. Contrast ≥4.5:1 for body text; orange accent used sparingly.
- Do not touch hero/nav/checker/pilot or `frozen design/` / `public/`.

## Acceptance criteria
1. Both sections render in frozen order after metrics band with frozen styling (timeline nodes, cards, verdict, hover lift on cards — pointer devices only).
2. Every string matches this brief verbatim; the ‡ footnote renders under the timeline.
3. `npm run build` + `npm run lint` + `tsc` green; banned-claims sweep across `app/` `components/` zero hits.
4. Reveal animates once on in-view; reduced-motion renders static; 320px no horizontal overflow.
5. Copy-change list vs frozen in the delivery summary (at minimum the 8 corrections listed above).

## Out of scope
How It Works (Brief 06) · Ecosystem (07) · CTA/footer/legal (08) · hero/nav changes · `frozen design/` and `public/` edits.
