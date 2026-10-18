# JOLT Website

Official website for **JOLT** — India's rail-first express network for 200kg+ B2B (and D2C heavy delivery). Next Train Out (NTO) linehaul on scheduled express trains, road first/last mile, 24–48h arrivals. The site is the company's face and lead-generation machine — orders are not placed here.

Benchmark: the frozen v5 concept (`frozen design/jolt-landing-v5.html`, deployed at joltdeliveries.com). Decision layer: `AGENTS.md` + `docs/uplift-spec.md` + `docs/architecture.md`. Agent handoff: `deepseek-harness-handoff.md`.

## Tech Stack

- **Next.js 15** (App Router) · React 19 · TypeScript (strict)
- **Tailwind CSS v4** + CSS Modules for frozen 1:1 ports — design tokens per AGENTS.md (white hero, ink, orange accent)
- **motion** (`motion/react`) for animation — never `framer-motion`
- **react-hook-form + zod** for form validation (schemas in `lib/validation.ts`)
- **Radix Dialog** (shadcn-style, JOLT chrome) for overlays
- **Route Handlers** as env-gated providers (`MOCK | SHEET | FORMSPREE | real backend`); mock is default
- **ESLint 9** (flat config) + Playwright browser verification

## Structure

```
app/
  layout.tsx                # fonts, claim-correct metadata, root shell
  page.tsx                  # section composition ONLY
  globals.css               # tokens + base + utilities
  api/
    serviceability/route.ts # POST pin→pin check (6 states)
    pilot/route.ts          # POST lead capture → reference ID
    estimate/route.ts       # POST rough estimate (freight calculator)
components/
  sections/                 # Nav, Hero, MetricsBand (+ future sections), module CSS each
  serviceability/           # checker dialog island + state machine
  ui/                       # dialog, number-ticker primitives
lib/
  api-proxy.ts              # env config + provider switch
  validation.ts             # zod schemas shared client/server
  metrics-data.ts           # founder-gated metric data
  utils.ts
docs/                       # specs, briefs, research, audits (decision layer)
public/                     # static prototype + payload assets (deploy path)
design-reference/           # working mocks (gitignored)
frozen design/              # frozen benchmark, v5 only (gitignored)
```

## Getting Started

```bash
npm install
npm run dev        # http://localhost:3000
```

## Environment

```bash
cp .env.example .env.local
```

- `JOLT_API_MOCK=true` (default) — deterministic stubs, no external calls
- `JOLT_API_BASE_URL` + `JOLT_API_KEY` — real JOLT backend (deferred)
- Secrets go in `.env.local` only — never committed

## API Routes

| Route | Body | Returns |
|---|---|---|
| `POST /api/serviceability` | `{ originPin, destPin, weightKg }` | `{ ok, status: served\|partial\|not-served, originServed, destServed, eta, tatHours, ratePerKgInr, rateBandInr }` |
| `POST /api/pilot` | `{ name, company, email, phone, origin, destination, notes? }` | `{ ok, reference }` |
| `POST /api/estimate` | `{ originPin, destPin, weightKg, volumeCft? }` | `{ ok, estimateInr, eta, validForHours }` |

## Quality gates (run on every delivery)

```bash
npx tsc --noEmit
npm run lint          # eslint . — 0 errors / 0 warnings
npm run build         # stop `next dev` first — shared .next cache
# Banned-claims sweep (AGENTS.md table — banned/unhedged forms only;
# the guardrail's allowed "Up to 3x faster rotation…" wording is NOT flagged):
grep -rn -E "first express layer|Express Layer for Heavy|Traditional Logistics|99\.2|1\.4T|80% less carbon|Quick-commerce killed|cash 3x faster|cut transit to 2 days" app components
# Browser pass + contrast/keyboard audit (dev server running):
PLAYWRIGHT_BROWSERS_PATH=0 node /Users/dinesh/.jolt-verify/verify-browser.mjs
PLAYWRIGHT_BROWSERS_PATH=0 node /Users/dinesh/.jolt-verify/a11y-check.mjs
```

Changes stay uncommitted for PM review; commits on approval; push only on explicit instruction.
