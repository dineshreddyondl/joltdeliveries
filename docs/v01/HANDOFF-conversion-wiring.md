# HANDOFF — Conversion Functionalities Wiring (new agent)

Repo: `/Users/dinesh/JOLT Website` · Next.js 15 App Router · React 19 · TS · Tailwind v4 · `motion/react`. Port 3000 only.

## Current state (2026-10-20, all gates green)
- `main` is 157 commits ahead of origin. NEVER push without TWO founder confirmations.
- Dev server: `npm run dev` on :3000. Full gate per delivery: `npx tsc --noEmit` · `npm run lint` · `npm run build` (retry on next/font network flake) · banned-claims sweep · `PLAYWRIGHT_BROWSERS_PATH=0 node /Users/dinesh/.jolt-verify/{verify-browser,a11y-check,pilot-check,hero-timing}.mjs`.
- Banned sweep exempts `components/sections/hero.tsx` + `metrics-band.tsx` (founder keeps). Never reintroduce banned claims — see `docs/uplift-spec.md` §0 and `AGENTS.md`.

## The two functionalities to wire (founder directive)
1. **Serviceability checker** — 2 pincodes → SERVED (rate + EDD + disclaimer) / NOT-SERVED (lead capture) / INVALID / ERROR. Ungated.
2. **Pilot flow** — 3 steps: (name, email, phone, company) → (lanes, volume, payload class) → (success + reference ID + 2-hour callback promise). Plus WhatsApp click-to-chat with a pre-filled structured freight query.
- Backend: Next.js API route, env-gated provider `MOCK | SHEET | FORMSPREE` (`JOLT_API_MOCK=true` default). No fake forms / dead success states.
- **P0 (do last):** WhatsApp number is still placeholder `91XXXXXXXXXX`.
- Existing pieces: `components/sections/cta.tsx` (+ RoutesModal/PilotModal), `components/ui/dialog.tsx`, `components/ui/animated-modal.tsx`, `lib/lanes.ts`. Verify before reusing.

## Recently settled design state (do not re-open unless the founder says)
- Hero entrance: CSS-keyframe sequence (eyebrow → H1+pointer draw → pillar → stage → Live Lanes last). Stage loop starts ~3s, lane roll ~4.4s.
- Stage parade: camera cut (instant swap), flash+spot scoped to the image area only; `LOOP 07.2s` label removed.
- Stamp: current white round seal, orange double ring, slam at 73.1% — founder said KEEP. A black-ink mock exists in `design-reference/jolt-stamp-options.html` (parked).
- Moving orange line streak on the scrolled nav pill; nav pill forced white in dark mode.
- Live Lanes table: badge outside the table, table bottom inline with stage card; hover pauses the roll.
- Parked/revoked: hero pointer experiments (ended at Gap-style treatment, orange #C2410C, pull-stop period inside the box), ripple floor, cubes-grid CTA mock, stage slide transitions (design-reference mocks).
- Mocks live in `design-reference/` (gitignored, open via file://). Docs: `docs/v01/freeze-log.md`, `full-page-audit.md`, `mobile-compat-audit.md`, `docs/uplift-spec.md`.
