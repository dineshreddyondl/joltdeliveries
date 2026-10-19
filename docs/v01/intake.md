# Intake Process — New Sections & New Pages (V0.1)

## New landing-page section

1. **Proposal** (founder, one line) — what the section should do.
2. **Impact note** (lead) — position in the narrative arc (insert before/after X, or replace Y — the skeleton is a guide, not a law), overlap with existing copy, data/claims needed, effort.
3. **Founder approves** → full brief via the spec template → build → QA → founder review → freeze.

Rule: skeleton sections can be cut, merged, or outranked. Every change is recorded as a delta in the brief.

## New page / route (e.g. `/track`)

1. **Page proposal gate** (lead answers three questions):
   - **Job to be done** — what does this page do for which visitor?
   - **Honest feasibility** — does it need data/APIs we don't have? No fake flows, ever.
   - **IA impact** — nav/footer links, metadata, sitemap, which CTAs point at it.
2. **Decision recorded** — one of: (a) defer, (b) build gated/mock-honest, (c) notify-only page. Tracking example: recommended **defer** until the logistics API has a waybill/status endpoint (lead-gen doesn't need it; a fake tracker violates the no-fake-flows rule).
3. **If approved** — full brief → build → QA → review → freeze, plus SEO wiring (title/meta/sitemap) and nav/footer entries.

## Universal rules

- Nothing appears on the site without a brief + founder review.
- New units must state their conversion job; we measure against the page's single story arc.
- Every addition/deferral is recorded in `docs/v01/` with the decision trail.
