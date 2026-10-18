# Brief 11 — SEO & Meta Basics

## Goal
Production-ready SEO surface: OG/Twitter meta, favicon, robots.txt, sitemap.xml, and a branded OG share card. No third-party SEO tooling.

## Read first
1. `docs/next-version-plan.md` row 16 · uplift-spec §6 phase-2 #8
2. `app/layout.tsx` (current metadata) · Next.js App Router metadata files docs

## Deliverables
- `app/layout.tsx` — `metadataBase` (https://joltdeliveries.com), OpenGraph + Twitter cards, robots index/follow. Title stays claim-corrected (no "· V5").
- `app/icon.svg` — JOLT bolt favicon (dark rounded square + orange bolt).
- `app/robots.ts` — allow all + sitemap URL.
- `app/sitemap.ts` — `/`, `/tos`, `/privacy`, `/sla` (priorities per legal weight).
- `app/opengraph-image.tsx` — 1200×630 branded share card via `next/og` ImageResponse (text-only, no bundled fonts).

## Acceptance criteria
1. Served HTML contains: correct `<title>`, meta description, og:title/og:description/og:type/og:url, twitter:card summary_large_image.
2. `/robots.txt`, `/sitemap.xml`, `/opengraph-image`, `/icon.svg` all return 200 with correct content types.
3. Legal pages keep their own titles/descriptions.
4. Build + lint + tsc green; zero banned strings in metadata.
5. Copy-change list: OG share-card tagline "Next Train Out. Next-day heavy commerce. Guaranteed SLAs." is new copy (flagged for PM review).

## Out of scope
Analytics / search console · utility bar (09) · estimate widget (12) · `frozen design/` / `public/` edits.
