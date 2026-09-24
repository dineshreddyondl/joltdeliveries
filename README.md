# JOLT Website

Official website for **JOLT** — India's Express Layer for Heavy Commerce. Direct, rail-led, next-day delivery for shipments over 50 kg.

## Tech Stack

- **Next.js 15** (App Router) · React 19 · TypeScript
- **Tailwind CSS v4** with JOLT design tokens (ink / paper / acid)
- **react-hook-form + zod** for form validation
- **Route Handlers** as a thin proxy to the JOLT backend (mock mode built in)

## Structure

```
app/
  layout.tsx                # self-hosted fonts, metadata, root shell
  page.tsx                  # landing page (sections composed here)
  globals.css               # design tokens + base + utilities
  api/
    serviceability/route.ts # POST — PIN→PIN serviceability check
    pilot/route.ts          # POST — pilot request lead capture
    estimate/route.ts       # POST — price estimate
components/
  sections/                 # Hero, Problem, Engine, Cases, Works, CTA, Footer
  animations/               # NetworkStory (hub&spoke → rail-led), Reveal…
  ui/                       # Button, Badge, Card — design system primitives
lib/
  api-proxy.ts              # env config + proxy helper
  validation.ts             # zod schemas shared by client & API
design-reference/           # frozen design mocks (not production code)
```

## Design Reference

`design-reference/` holds the design iteration mocks. The currently active direction:

| File | What it is |
|---|---|
| `jolt-working.html` | **Current**: consolidated monochrome canvas — B&W, brand color applied later |
| `jolt-hero-sequence.html` | Sequential hub & spoke → rail-led story with advantage strip |
| `jolt-hero-comparison.html` | Earlier: side-by-side hubless vs hub & spoke |
| `jolt-hero-animation-reference.html` | Reference: single animated corridor |
| `jolt-redesign-v2.html` | Original single-file mock |

## Getting Started

```bash
npm install
npm run dev        # http://localhost:3000
```

## Environment

```bash
cp .env.example .env.local
```

- `JOLT_API_MOCK=true` (default) — APIs return deterministic stubs, no external calls
- `JOLT_API_BASE_URL` + `JOLT_API_KEY` — point to the real JOLT backend
- Secrets go in `.env.local` only — never committed

## API Routes

| Route | Body | Returns |
|---|---|---|
| `POST /api/serviceability` | `{ originPin, destPin, weightKg }` | `{ serviceable, eta, tatHours }` |
| `POST /api/pilot` | `{ name, company, email, phone, origin, destination, notes? }` | `{ reference }` |
| `POST /api/estimate` | `{ originPin, destPin, weightKg, volumeCft? }` | `{ estimateInr, eta }` |
