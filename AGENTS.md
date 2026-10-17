# AGENTS.md — JOLT Website

Auto-loaded agent instructions. Read this before any work in this repo. The decision layer for all content and design choices lives in `docs/uplift-spec.md` — when it conflicts with anything else in this repo, the uplift spec wins.

## What this is

JOLT — India's rail-first express network for heavy shipments (20–500 kg: furniture, appliances, auto parts). Next Train Out (NTO) linehaul on scheduled Indian express trains, first/last mile by road, 24–48 hr B2B distributor arrivals. Founded by Dinesh Reddy (ONDL Network Private Limited). The landing page is the startup's face; every section sells speed, reliability, and the SLA guarantee.

## Stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · framer-motion (import from `motion/react` — the package renamed to `motion`) · react-hook-form + zod. Deploy: Railway (Nixpacks auto-detect). Animated/interactive components must be `'use client'` islands; keep everything else server components.

Static prototype deploy: `public/*.html` is served at joltdeliveries.com (GitHub repo behind Cloudflare) — `git push origin main` deploys after ~5 min. `assets/` payload images are tracked in git and must be committed when referenced.

## Sources of truth

1. `docs/uplift-spec.md` — decision layer. READ FIRST. Includes claim corrections (§0) that override the frozen copy.
2. `docs/research/01–06` — full research with citations. Read the relevant report before touching its section:
   - `01-competitor-teardown.md` — competitor patterns, anti-patterns
   - `02-design-motion-trends.md` — visual/motion language, what to skip
   - `03-component-harvest.md` — component catalog per section (licenses + compat)
   - `04-conversion-lead-capture.md` — serviceability checker, pilot flow, WhatsApp, form backend
   - `05-claims-validation.md` — claim verdicts with sources
   - `06-rail-reality-check.md` — rail story ground truth (copy implications)
3. `frozen design/jolt-landing-v5.html` — the approved design prototype (deployed live at joltdeliveries.com). `design-reference/` — working mocks.
4. `public/jolt-landing-v5.html` — deployed copy; Cloudflare obfuscates the support email in the served HTML. Sync from `frozen design/` with the `../assets/` → `assets/` path rewrite before committing.

## Claim guardrails (violating these is a release blocker)

The frozen v5 page contains claims that failed validation. Never reintroduce:

| Banned / risky wording | Why | Allowed replacement |
|---|---|---|
| "India's first express layer…" | Amazon has run rail express since 2019; SCR's Rail Parcel pilot (Feb 2026) covers HYD/BLR/CHE | Scope the claim: "rail-first express network for 200 kg+ B2B" or similar |
| "99.2% SLA adherence" (bare) | Not externally verifiable; no methodology | Publish only with definition + methodology + money-back remedy |
| "1.4T CO₂ saved per lane" | Unit/period ambiguous | Per-shipment stat (~8.2 kg saved per 200 kg shipment HYD→BLR) or dated figure with N basis |
| "Cut transit to 2 days, rotate cash 3x faster" | Math only holds on 3x-transit lanes, in-transit capital only | "Up to 3x faster rotation of in-transit working capital on our longest lanes" |
| Lane TAT baseline "Traditional Logistics = 3 days" for HYD→BLR etc. | Road FTL is ~24 h door-to-door on short lanes; 3-day baseline is an LTL/part-load number | Label the comparison column "LTL / Part-Load", or use lanes where the gap is real (DEL→BOM 4–5 days vs 2) |
| "80% less carbon" | Actually conservative — safe | May strengthen to "up to 85–90% less" with footnote (NITI Aayog, SFC India 2025) |
| DFC references | WDFC/EDFC don't serve the south; south corridors are DPR-stage | Say "scheduled express trains" |
| Vande Bharat parcel train as live infra | Announced, not in service | Don't reference as live |

Never invent client names, logos, metrics, or integration partnerships. Real-brand marquees (Ather, Wakefit, Ola Electric, Duroflex; SAP, Oracle, Clickpost, Pando, eShipz) ship only with a verified relationship.

## Design system (current, per uplift spec §1)

- **Colors:** white hero (`#FFFFFF`, tint `#F5F7F2`), ink `#0C0E09`, dark sections `#08080A` with hairline borders `rgba(255,255,255,.08)`, accent orange `#C2410C` / `#E85A2C` (acid, used sparingly — 3x/screen max). Body `#4A4E44`, muted `#878B80` / `#8B8B90`. Hero eyebrow uses deeper `#9A3412` semibold (7.3:1 contrast).
- **Dispatch board (frozen v5):** 9 payload products at 0.8s cadence; clock sweeps one full revolution in 7.2s (12 → 12 o'clock) and completes at the exact instant the "DELIVERED IN 24 HRS" stamp (clean orange badge, top-right of the dial) slams; total loop 9.0s. A distressed rubber-stamp restyle was tried and revoked — keep the clean badge.
- **Fonts:** Space Grotesk (display), Inter (body), JetBrains Mono (labels/eyebrows/terminal), Archivo (sparingly).
- **Patterns:** grain/noise overlay on hero + dark sections (SVG feTurbulence, low opacity); background-tint elevation on dark, no heavy shadows; 24px base rhythm; uppercase mono labels with wide tracking; `prefers-reduced-motion` guard on every animation.
- **Skip:** purple AI gradients, scroll-jacking, stock truck/crane photos, default glassmorphism, emoji in UI.
- The stale acid-green (`#D4FF3F` / ink-paper) palette that appears in older docs and `jolt-designer.agent.md` pre-dates this decision — orange is current.

## Component stack (per uplift spec §3)

shadcn/ui (backbone; React 19 + Tailwind v4 official) · Magic UI (MIT) · Motion-Primitives (MIT) · react-fast-marquee (MIT) · react-map-gl + maplibre-gl for maps. Avoid: Mapbox (pricing), react-leaflet (Hippocratic license), Tailwind UI/Plus (sign-ups closing), Cult UI (migrating to paid). GSAP only for the pinned pipeline set-piece.

## Conversion machinery (per uplift spec §4)

Every CTA must terminate in a real flow — no fake forms, no dead success states:
- Serviceability checker: 2 pincodes → SERVED (rate + EDD + disclaimer) / NOT-SERVED (lead capture) / INVALID / ERROR. Ungated.
- Pilot flow: 3 steps — (name, email, phone, company) → (lanes, volume, payload class) → (success + reference ID + 2-hour callback promise).
- WhatsApp click-to-chat with pre-filled structured freight query as parallel path.
- Backend: Next.js API route with env-gated provider `MOCK | SHEET | FORMSPREE` (`JOLT_API_MOCK=true` default). The terminal/quirk modal may only be used for the notify-me waitlist state.

## Workflow

The PM (Dinesh, via his Hermes session) issues one design/implementation brief per section. Each brief names: the section, goal, constraints, acceptance criteria, and which research files to read. Implement exactly the briefed section — do not redesign other sections, do not change copy without flagging it in your summary. Deliver React components under `components/sections/` following the existing pattern, or design HTML under `design-reference/` when the brief asks for a mock. On explicit PM request, the static prototype may be iterated directly in `frozen design/jolt-landing-v5.html`: verify in the browser (freeze frames via `?v=N#t=SS.S`), sync to `public/` with the asset path rewrite, commit, and push only when the PM says.

## Conventions

- Copy claims must match `docs/uplift-spec.md` §0 wording. When improving copy, list every change in your summary.
- Accessibility: aria labels on interactive elements, visible focus states, reduced-motion guards, contrast ≥ 4.5:1 for body text.
- Footer links are dead anchors today; ToS/Privacy/SLA/Refund pages are pending — don't invent routes.
