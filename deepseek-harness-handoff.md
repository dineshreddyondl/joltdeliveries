# JOLT WEBSITE — PROJECT HANDOFF (DeepSeek Harness Context)

**You are the coding agent for the JOLT website.** Read `AGENTS.md` in the repo first — it is the binding instruction layer. This handoff is the bootstrap context; when anything here conflicts with `AGENTS.md` or `docs/uplift-spec.md`, those win.

## Locations

| What | Where |
|---|---|
| **Local path** | `/Users/dinesh/JOLT Website` |
| **Repo** | https://github.com/dineshreddyondl/joltdeliveries (branch `main`, remote `origin`) |
| **Live site** | https://joltdeliveries.com — static prototype served at `https://joltdeliveries.com/jolt-landing-v5.html` (GitHub repo behind Cloudflare; `git push origin main` deploys after ~5 min) |
| **Next.js app deploy** | Railway (Nixpacks auto-detect). *(Railway project URL is not stored in the repo — ask Dinesh if needed.)* |
| **Static deploy flow** | `frozen design/` is gitignored (local design source) and is a single-file folder: **only `jolt-landing-v5.html`** (older versions moved to `design-reference/references/` on 2026-10-18). What ships is the tracked `public/jolt-landing-v5.html`. Flow: edit `frozen design/jolt-landing-v5.html` → verify in browser → sync to `public/jolt-landing-v5.html` with `../assets/` → `assets/` path rewrite → commit → push only when Dinesh says. **The frozen folder IS what's deployed for review** — verified byte-identical to the live page (see Current state). |

## What this is

JOLT — India's rail-first express network for heavy shipments (20–500 kg: furniture, appliances, auto parts). Next Train Out (NTO) linehaul on scheduled Indian express trains, road first/last mile, 24–48 hr B2B distributor arrivals. Founded by Dinesh Reddy (ONDL Network Private Limited). The PM is Dinesh; he issues one brief per section via this harness.

## Stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · motion (`motion/react` — the package is `motion`, never import from `framer-motion`) · react-hook-form + zod. Animated/interactive code lives ONLY in `'use client'` islands; `app/page.tsx` stays a server component. Fonts: Space Grotesk (load via `next/font/google` inside the island), Inter + JetBrains Mono (already in `layout.tsx`).

## Sources of truth (read before touching a section)

1. `docs/uplift-spec.md` — decision layer. READ FIRST (§0 claim corrections override the frozen copy).
2. `docs/research/01–06` — cited research: 01 competitor teardown, 02 design/motion trends, 03 component harvest, 04 conversion/lead capture, 05 claims validation, 06 rail reality check.
3. `docs/briefs/` — PM briefs. Implement exactly the briefed section; list every deviation and every copy change in your summary.
4. `frozen design/jolt-landing-v5.html` — approved design prototype (the live flagship). This folder intentionally contains ONLY v5; older iterations (v1–v4, v6, `_discarded/`) live in `design-reference/references/` along with the other working mocks.
5. `public/jolt-landing-v5.html` — deployed copy of the frozen prototype.

## Claim guardrails (release blockers — never reintroduce)

- ❌ "India's first express layer…" → ✅ "rail-first express network for 200 kg+ B2B"
- ❌ bare "99.2% SLA adherence" → ✅ only with definition + methodology + money-back remedy
- ❌ "1.4T CO₂ saved per lane" → ✅ per-shipment stat (~8.2 kg per 200 kg HYD→BLR) or dated figure with N basis
- ❌ "Cut transit to 2 days, rotate cash 3x faster" → ✅ "Up to 3x faster rotation of in-transit working capital on our longest lanes"
- ❌ "Traditional Logistics = 3 days" on short lanes → ✅ label column "LTL / Part-Load"
- ❌ DFC / Vande Bharat parcel-train references as live → ✅ "scheduled express trains"
- Never invent clients, logos, metrics, or partnerships. Brand marquees (Ather, Wakefit, Ola Electric, Duroflex; SAP, Oracle, Clickpost, Pando, eShipz) only with verified relationships.

## Design system (current)

- **Colors:** white hero (`#FFFFFF`, tint `#F5F7F2`), ink `#0C0E09`, dark sections `#08080A` with hairlines `rgba(255,255,255,.08)`, accent orange `#C2410C` / `#E85A2C` (sparingly — 3x/screen max), hero eyebrow `#9A3412` semibold. Body `#4A4E44`, muted `#878B80`/`#8B8B90`. The old acid-green (`#D4FF3F`) palette is stale — orange is current.
- **Dispatch board (frozen v5):** 9 payload products, 0.8s cadence, clock sweeps one full revolution in 7.2s (12 → 12 o'clock) and completes at the exact instant the "DELIVERED IN 24 HRS" stamp (clean orange badge, top-right of the dial) slams; total loop 9.0s. A distressed rubber-stamp restyle was tried and revoked — keep the clean badge.
- **Fonts:** Space Grotesk (display), Inter (body), JetBrains Mono (labels/eyebrows/terminal).
- **Patterns:** grain/noise overlay on hero + dark sections; hairline elevation on dark, no heavy shadows; 24px base rhythm; uppercase mono labels with wide tracking; `prefers-reduced-motion` guard on every animation.
- **Skip:** purple AI gradients, scroll-jacking, stock truck photos, glassmorphism, emoji in UI.
- **Component stack:** shadcn/ui · Magic UI (MIT) · Motion-Primitives (MIT) · react-fast-marquee · react-map-gl + maplibre. Avoid Mapbox, react-leaflet, Tailwind UI/Plus, Cult UI. GSAP only for the pinned pipeline set-piece.

## Conversion machinery (uplift §4)

Every CTA terminates in a real flow: serviceability checker (2 pincodes → SERVED/NOT-SERVED/INVALID/ERROR, ungated) · 3-step pilot flow (contact → lanes/volume/payload → success + reference ID + 2-hour callback) · WhatsApp click-to-chat parallel path · Next.js API routes env-gated `MOCK | SHEET | FORMSPREE` (`JOLT_API_MOCK=true` default). The quirk/terminal modal is only for the notify-me waitlist state. Existing routes: `POST /api/serviceability`, `/api/pilot`, `/api/estimate` (see README for bodies).

## Workflow & git rules

- One PM brief = one section. Don't redesign other sections, don't change copy without flagging it.
- React components → `components/sections/`; mocks → `design-reference/`. Frozen-prototype edits only on explicit PM request, then browser-verify, sync to `public/`, commit.
- **Commits are allowed freely** (logical, gated commits) without per-commit approval — per Dinesh, 2026-10-18. **Push requires TWO separate explicit confirmations from Dinesh** — a single yes never suffices; the answer to an unprompted push is always no. Push goes to `origin/main`.
- `assets/` payload images are tracked in git — commit them when referenced.
- Copy claims must match `docs/uplift-spec.md` §0 wording; list every copy change in your summary.
- A11y: aria labels, visible focus states, reduced-motion guards, contrast ≥ 4.5:1. Footer links are dead anchors; ToS/Privacy/SLA/Refund pages are pending — don't invent routes.

## Verification workflow (used and proven in this repo)

- **Frozen prototype:** browser freeze frames via `file:///…/jolt-landing-v5.html?v=N#t=SS.S` (renders the dispatch-board timeline frozen at t seconds — use a fresh `v` value to force reload). Screenshot + computed-style checks per change.
- **React app:** `npm run build` must pass with zero TS errors; inspect prerendered HTML (`.next/server/app/index.html`) to confirm final values SSR with no flash; then browser-verify behavior (in-view reveal, count-ups, live timestamp) — note that a backgrounded Playwright tab reports `document.hidden=true` and blocks IntersectionObserver, so bring the page to front / open a fresh page before behavioral checks.
- Reduced-motion verification via `page.emulateMedia({ reducedMotion: 'reduce' })`; 320px overflow checks per responsive acceptance criterion.
- **Browser verification (Playwright, installed 2026-10-18):** dev dep `playwright` + chromium installed with browsers inside the repo (`PLAYWRIGHT_BROWSERS_PATH=0 npx playwright install chromium`). Verification script lives OUTSIDE the repo at `/Users/dinesh/.jolt-verify/verify-browser.mjs` (desktop/320 overflow + console errors, reduced-motion static board, serviceability dialog SERVED + INVALID, dual-audience strip DOM assertions). Run with `cd "/Users/dinesh/JOLT Website" && PLAYWRIGHT_BROWSERS_PATH=0 node /Users/dinesh/.jolt-verify/verify-browser.mjs` against the running dev server; results + screenshots land in `/Users/dinesh/.jolt-verify/`. NEVER run `next build` while it runs (see dev/build conflict below).
- **Hydration-safe animation pattern (used in Hero + MetricsBand):** `useReducedMotion()` alone causes hydration mismatch for reduced-motion users. Correct gate: `const [ready, setReady] = useState(false); useIsomorphicLayoutEffect(() => setReady(true), []); const animateIn = ready && !reduceMotion;` then `initial={animateIn ? "hidden" : false}` / `animate={animateIn ? "show" : false}` (MetricsBand: `animate={animateIn ? (inView ? "show" : "hidden") : false}`). SSR ships visible content, animation starts pre-paint only for non-reduced users.

## Current state (as of 2026-10-18)

- **Local HEAD** `366189c` (metrics band, Brief 01) is **2 commits ahead of origin/main** (`fb2a350`): `63d6d2f` (AGENTS.md update) + `366189c` (Brief 01 metrics band). **Do not push without Dinesh's go-ahead.**
- **Shipped:** frozen v5 static page (dispatch-board hero, V1-ported dark sections, orange accent pass, 7.2s clock sync) · React metrics band (Brief 01: 4 defensible stats, LIVE ticking IST timestamp, count-up on view, founder-gated Option A in `lib/metrics-data.ts`).
- **Deployed-for-review check (verified 2026-10-18):** `frozen design/jolt-landing-v5.html` is the deployed review artifact. Diff vs the live page at `https://joltdeliveries.com/jolt-landing-v5.html` shows ONLY the two known transforms — `../assets/` → `assets/` path rewrite and Cloudflare's email obfuscation (`support@ondl.in` → `__cf_email__` span + injected `email-decode.min.js`). `frozen design/` == `public/jolt-landing-v5.html` == live site. Anything we change in frozen v5 and sync to `public/` is exactly what reviewers see after deploy.
- **Brief 02 + Brief 04 implemented but UNCOMMITTED** in the working tree (agent work, to be reviewed before committing): `components/serviceability/serviceability-checker.tsx` + `components/ui/dialog.tsx` + `app/api/serviceability/route.ts` (Brief 02, 6-state ungated checker) and `components/sections/hero.tsx` (rewritten: frozen white/orange port, claim-corrected) + `components/sections/nav.tsx` + `hero.module.css`/`nav.module.css` + `app/page.tsx` (Brief 04). `next.config.ts` root redirect is TEMP-DISABLED so the React app serves at `/` locally.
- **PM's uncommitted files** (not yours — leave alone unless briefed): `.github/agents/jolt-designer.agent.md` (modified), `CLAUDE.md` (untracked), `docs/` incl. briefs (untracked).
- **Pending briefs (not yet implemented):** `docs/briefs/03` (pilot flow + floating WhatsApp), 05–13 in `docs/next-version-plan.md` (why-now/gap, how-it-works, ecosystem, CTA/footer/legal, marquee/utility bar, quirk kill, SEO/meta, estimate widget, embedded demo).
- **▶ NEXT TASK:** implement the feedback on the deployed v5 prototype to make the **real working website** — the v6 section-by-section React port per `docs/next-version-plan.md` (claim-corrected copy + real conversion flows; acceptance criteria 1–14). PM issues one brief at a time. Commit freely; never push without Dinesh.
- **STATUS (2026-10-19): FEATURE-COMPLETE.** All 13 v6 briefs implemented + committed locally (main is 13 commits ahead of origin, NOT pushed). Full go-live readiness report: `docs/go-live-readiness.md` (11/14 acceptance criteria PASS; 3 founder-gated: WhatsApp number, legal copy, deploy decision). Nothing else to build until the founder acts.
- **FOUNDER DECISIONS (2026-10-19):** deploy target DECIDED — go-live serves the **React app** (Railway). WhatsApp production number: TBD. Legal copy (ToS/Privacy/SLA): TBD. Dinesh will return with **section-by-section fine-tuning briefs** to run through the lead + specialist structure (Narrative / Conversion+APIs / Trust+Legal / Proof+SEO). When he returns: resume the goal, then one brief at a time through the same gate loop.
- **Benchmark corrections (founder, 2026-10-19, commit `83c3e47`):** customer marquee restored (Ather/Wakefit/Ola Electric/Duroflex — founder-authorized); dark proof strip removed; NITI Aayog citations removed (hero/metrics/how-it-works); **metrics band restored to exact benchmark copy (80% / 99.2% / 1.4T / 24–48h)** — founder override of the guardrail table, recorded in `metrics-band.tsx` header; the banned-claims sweep now excludes `metrics-band.tsx`. Future fine-tuning must respect these founder choices.
- **Phase 0 progress (2026-10-18):** banned `<title>` in `app/layout.tsx` is now claim-corrected ("JOLT — India's Rail-First Express Network for 200kg+ B2B") and verified in SSR output; `framer-motion` removed (build green, 104 kB route). **ESLint configured:** `eslint.config.mjs` (flat config via FlatCompat over `eslint-config-next` 15.5), lint script is now `eslint .` (was deprecated `next lint`); `npm run lint` passes 0 errors / 0 warnings. The one `no-img-element` exception in the dispatch board is documented inline (frozen rAF loop needs plain `<img>`). **Browser-verified (Playwright):** desktop + 320px zero overflow/console errors; reduced-motion renders static board with ZERO hydration errors (fixed ready-gated animation in Hero + MetricsBand); checker SERVED + INVALID states render full correct copy. Remaining Phase 0: OG tags/favicon/robots/sitemap (Brief 11).
- **Contrast pass (2026-10-18, hero.module.css):** fixed the invisible white-on-white H1 (`.h1` now `#0C0E09`; was inheriting `text-white` from body) plus 5 sub-4.5:1 colors — `.plAcid`/`.laneRow .new`/`.pdCount` → `#C2410C` (5.18:1), `.laneHead`/`.pdHead` → `#5B5F54` (6.54:1), `.laneCols`/`.laneRow s` → `#6E7366` (4.88:1). Automated contrast audit `/Users/dinesh/.jolt-verify/a11y-check.mjs` now reports **0 real failures** (109 page elements + dialog); it treats `position:fixed` transparent layers and `.sr-only` as not-auditable. Keyboard flow verified: Escape closes dialog, focus returns to trigger, Enter opens, first input focused.
- **Full release gate PASSED (2026-10-18) on the pre-baseline state** — gates 1–6 all green: tsc, eslint, build, banned-sweep, Playwright (desktop/320/reduced/dialog states), a11y contrast + keyboard. Report: `/Users/dinesh/.jolt-verify/gate-report-2026-10-18.json`. The working tree is ready for the baseline commit on PM approval.
- **Scaffold hardening (2026-10-18, round 9):** legacy Kimi dark theme removed from `app/globals.css` — `@theme` now carries the current JOLT tokens (ink `#0C0E09`, paper `#FBFCF8`, dark `#08080A`, accent `#E85A2C`/`#C2410C`, muted `#878B80`/`#6E7366`). Body is now neutral light (`bg-[#FBFCF8] text-[#0C0E09]` in `layout.tsx`) — this kills the white-on-white class of bugs for all future sections. Dark sections must declare their own background: the proof strip in `page.tsx` now has explicit `bg-[#08080A] text-white`. `:focus-visible` outline changed white → `#E85A2C` (visible on light and dark). Full gate re-passed after the change (tsc/lint/build/banned-sweep/Playwright/a11y all green).
- **Brief 03 pilot flow — IMPLEMENTED (2026-10-18, round 10, uncommitted):** `components/pilot/pilot-flow.tsx` — 3-step dialog (name/email/phone/company → lane + monthly volume + payload class + optional call time → success with reference ID from `/api/pilot` + "Expect a call within 2 business hours" + trust row + WhatsApp confirm). Nav "Start pilot" now opens the dialog (was a dead `#pilot` anchor). `lib/validation.ts` `pilotSchema` extended with optional `monthlyVolume`/`payloadClass`/`callTime` enums (backward compatible). Verified end-to-end via `/Users/dinesh/.jolt-verify/pilot-check.mjs` (validation errors → step 2 → success `JLT-XXXX` → Esc closes → focus returns). NOTE for tests: `innerText` applies CSS `text-transform: uppercase` — assert on `textContent` when matching labels. Checker's secondary "request pilot pricing" still points at `#pilot` (resolves with Brief 08 CTA section).
- **Architecture blueprint drafted:** `docs/architecture.md` (DRAFT for PM review — 10 sections: principles, stack, repo structure, data/providers, conversion contracts, content governance, quality gates, deploy, roadmap, open decisions).
- **Narrative audit (Specialist A, read-only, complete):** Why Now / The Unfilled Gap / The Orchestration Layer audited line-by-line → 24 PASS · 9 REWORD · 0 REMOVE. Full table delivered in-session; **not yet persisted to disk** (PM to green-light `docs/audits/narrative-claim-audit.md`). Feeds Brief 05 (Why Now + Gap) and Brief 06 (How It Works).
- **Dual-audience hero strip — REVERTED (PM decision, 2026-10-18):** the B2B/D2C micro-strip was removed from `components/sections/hero.tsx` + `hero.module.css`; the hero is back to frozen-exact. Dual-audience positioning lives only in the Ecosystem section (frozen v5). Do not re-add without a brief.

## Known quirks

- `frozen design/` is a single-file folder (v5 only, 2026-10-18 reorg) — everything else moved to `design-reference/references/`. Both folders are gitignored; only `public/` ships.
- Cloudflare obfuscates the support email in the served HTML — keep the sync script's asset-path rewrite intact.
- **Dev/build cache conflict:** `npm run build` while `next dev` is running clobbers the shared `.next` dir → the dev page 500s (`TypeError: a[d] is not a function`). Kill the dev job, `rm -rf .next`, restart `npm run dev` after every production build. Always restart dev after a build.
- `next.config.ts` root redirect `'/'` → `/jolt-landing-v5.html` is **TEMP-DISABLED** (commented out) so the React app serves at `/` locally. The live site redirect comes from Cloudflare/static hosting, not this file. Restore or drop it as part of the deploy decision.
- The React `app/page.tsx` nav + hero are now the **frozen white/orange port** (Brief 04). Only the **proof strip** between hero and metrics band is still the older dark monochrome proto — briefs will migrate the remaining sections one by one.
- `components/sections/hero.tsx` imports from `motion/react` (Brief 04 rewrite). **`framer-motion` has been removed from `package.json`** (2026-10-18, Phase 0) — `motion` is the only animation library now.
