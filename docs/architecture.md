# JOLT Website — Architecture Blueprint (v1)

> **DRAFT — for PM review.** Decision record for the production-ready build. This doc wins over ad-hoc decisions; update it when the PM approves a change. Benchmark: frozen v5 concept from `github.com/dineshreddyondl/joltdeliveries`. Superseded by `AGENTS.md` + `docs/uplift-spec.md` for content/claim rules.

## 1. Purpose & principles

The site is the **face of the company and a lead-generation machine** — not an order-taking product. People don't book shipments here; they are convinced by the narrative and captured by the conversion machinery. Principles:

1. **Narrative-first, claim-correct** — copy follows uplift-spec §0 wording; zero banned claims anywhere (release blocker).
2. **Low-lift functionality** — every CTA terminates in a real flow, but the backend stays mock-gated until a provider exists. No login, no dashboards, no integrations until briefed.
3. **Scalable structure** — features are isolated islands (`components/sections/*`, `components/serviceability/*`), contracts are typed (zod), providers are env-gated, and verification is automated.
4. **Single source of edits** — all changes flow through the harness lead agent; commits on PM approval; pushes only on PM's explicit word.

## 2. Locked stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 15 (App Router), React 19, TypeScript (strict) | Server components by default; animations in `'use client'` islands |
| Styling | Tailwind CSS v4 + CSS Modules for frozen 1:1 ports | Design tokens per AGENTS.md (white hero, ink, orange accent) |
| Motion | `motion` (`motion/react`) only | `framer-motion` removed (2026-10-18) |
| Forms | react-hook-form + zod (`@hookform/resolvers`) | Schemas shared client/server in `lib/validation.ts` |
| Dialog | Radix (`components/ui/dialog.tsx`) | shadcn-style, restyled to JOLT chrome |
| Fonts | `next/font/google`: Inter, JetBrains Mono, Space Grotesk, Archivo | Self-hosted, zero layout shift |
| QA | ESLint 9 (flat, `eslint-config-next`) + `tsc` + Playwright (chromium, workspace-bundled) | `npm run lint`, `npm run build`, audit scripts in `/Users/dinesh/.jolt-verify/` |

## 3. Repo structure (normalized target)

```
app/
  layout.tsx              # fonts, metadata (claim-correct title), root shell
  page.tsx                # section composition ONLY — no inline section code
  globals.css             # tokens + base + utilities
  api/
    serviceability/route.ts   # POST pin→pin check (6 states)
    pilot/route.ts            # POST lead capture → reference ID
    estimate/route.ts         # POST rough estimate (freight calculator)
  (legal)/                # FUTURE: /tos /privacy /sla (Brief 08)
components/
  sections/               # Hero, Nav, MetricsBand, WhyNow, Gap, HowItWorks,
                          # Ecosystem, CTA, Footer — one component + module CSS each
  serviceability/         # feature island: checker dialog + state machine
  ui/                     # primitives: dialog, number-ticker, …
lib/
  api-proxy.ts            # env-gated provider switch (MOCK | SHEET | FORMSPREE | real)
  validation.ts           # zod schemas shared client/server
  metrics-data.ts         # founder-gated metric data (never render invented numbers)
  utils.ts
  coverage-data.ts        # FUTURE (data layer): git-committed pincode/rate JSON
docs/                     # specs, briefs, research, audits — the decision layer
public/                   # static prototype + payload assets (deploy path)
design-reference/         # working mocks (gitignored)
frozen design/            # frozen benchmark v5 only (gitignored)
eslint.config.mjs, next.config.ts, package.json
```

Rules: `page.tsx` composes, never contains section markup. Shared contracts in `lib/`. Feature code never reaches into another feature's internals.

## 4. Data & providers (deferred — Goal 2 wiring only)

- All three API routes exist and are **mock-gated** (`JOLT_API_MOCK=true` default; deterministic responses, zero external calls).
- Provider switch is server-side only: `MOCK | SHEET | FORMSPREE` for lead capture, or a real backend via `JOLT_API_BASE_URL` + `JOLT_API_KEY`. The client never sees provider config; UI never changes when the backend becomes real.
- **Data layer deferred**: real pincode/rate data lands later as git-committed JSON (`lib/coverage-data.ts`) or a founder-supplied provider. No DB in v6.
- Secrets live in `.env.local` only. WhatsApp number lives in one exported constant (placeholder `91XXXXXXXXXX` — release blocker until founder supplies it).

## 5. Conversion flow contracts (Goal 2)

1. **Serviceability checker** — 2 pincodes + weight → LOADING → SERVED (rate band + EDD + disclaimers) / PARTIAL / NOT-SERVED (lead capture) / INVALID / ERROR. Ungated. (Built, Brief 02.)
2. **Pilot flow** — 3 steps: contact → lanes/volume/payload → success + reference ID + 2-hour callback. Posts `/api/pilot`. (Brief 03.)
3. **WhatsApp** — click-to-chat with pre-filled structured freight queries as the parallel path at every step.
4. **Quirk terminal** — allowed only as the notify-me waitlist state; never a fake success. (Brief 10.)
5. **Estimate widget** — hero 3-field calculator via `/api/estimate` with ClickPost-style disclaimers, ungated. (Brief 12, phase 3.)

## 6. Content governance (Goal 1)

- Copy must match uplift-spec §0 wording; every change vs frozen v5 is listed in the delivery summary.
- Banned strings (AGENTS.md table) are swept by grep in the release gate.
- Marquee/integration names ship only with verified relationships — generic until then.
- The dual-audience story (B2B distributors / D2C brands) lives in the Ecosystem section per frozen v5; the hero stays frozen-exact (PM decision 2026-10-18).

## 7. Quality gates (Goal 3 — run on EVERY delivery)

1. `npx tsc --noEmit` clean · 2. `npm run build` green · 3. `npm run lint` 0 errors
4. Banned-claims grep across `app/` + `components/`
5. Playwright browser pass: desktop + 320px overflow, console errors, reduced-motion static frame, dialog states, keyboard flow
6. Contrast audit (`a11y-check.mjs`) — 0 real failures
7. Copy-change list in the delivery summary

Delivery stays **uncommitted** for PM review → commit on approval → push only on explicit word.

## 8. Deploy paths

- **Next app**: Railway (Nixpacks auto-detect). Env vars: `JOLT_API_MOCK`, `JOLT_API_BASE_URL`, `JOLT_API_KEY`, provider keys when enabled.
- **Static prototype**: `public/jolt-landing-v5.html` via GitHub → Cloudflare at joltdeliveries.com. Frozen v5 == deployed copy (verified 2026-10-18).
- **Open decision**: the root redirect (`/` → static v5 vs React app) — resolved at go-live, recorded here when decided.

## 9. Roadmap (goals ↔ briefs)

| Phase | Content | Goal |
|---|---|---|
| 0 | Reconcile + hygiene (done: title, deps, eslint, contrast, hydration) | 3 |
| 1 | This blueprint + baseline commit (awaiting PM approval) | 3 |
| 2 | Scaffold hardening to §3 structure | 3 |
| 3 | Section loop: Brief 03 (pilot/WhatsApp), 05 (Why Now+Gap), 06 (How It Works), 07 (Ecosystem), 08 (CTA/Footer/Legal), 09 (marquee/utility), 10 (quirk kill) | 1 + 2 |
| 4 | Productionization: SEO/meta (11), estimate widget (12), env/secrets, legal copy final | 1 + 2 |
| 5 | Release gate: full criteria sweep → deploy → verify live | all |

## 10. Open decisions (founder inputs)

- [ ] WhatsApp production number (release blocker)
- [ ] Baseline commit approval (Phase 1 exit)
- [ ] ToS/Privacy/SLA legal copy
- [ ] Founder-gated metrics data (only for the audited SLA card)
- [ ] Root redirect decision at go-live
- [ ] Real pincode/rate data source (deferred)
