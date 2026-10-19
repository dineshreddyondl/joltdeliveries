# JOLT WEBSITE — PROJECT HANDOFF (DeepSeek Harness Context)

**CRITICAL RECALIBRATION (founder, 2026-10-19):** the frozen v5 design is a **SKELETON — visual direction only** (layout, vibe, motion language). It is NOT the final content/functionality/structure spec. Every section must be developed to **V0.1 production depth** — detailed copy, real states, sourced claims, reviewed by the founder per section. "Not vibe-coded": every section gets a spec, a founder review gate, and visual QA before it is considered done. Frozen = skeleton reference; AGENTS.md claim guardrails remain binding for claims unless the founder records an override.

**You are the coding agent for the JOLT website.** Read `AGENTS.md` in the repo first — it is the binding instruction layer. This handoff is the bootstrap context; when anything here conflicts with `AGENTS.md` or `docs/uplift-spec.md`, those win.

## Locations

| What | Where |
|---|---|
| **Local path** | `/Users/dinesh/JOLT Website` |
| **Repo** | https://github.com/dineshreddyondl/joltdeliveries (branch `main`, remote `origin`) |
| **Live site** | https://joltdeliveries.com — static prototype served at `https://joltdeliveries.com/jolt-landing-v5.html` (GitHub repo behind Cloudflare; `git push origin main` deploys after ~5 min) |
| **Next.js app deploy** | Railway (Nixpacks auto-detect). Go-live serves the **React app** (founder decision 2026-10-19). Railway project URL: ask Dinesh if needed. |
| **Static deploy flow** | `frozen design/` is gitignored (local design source), single-file folder: only `jolt-landing-v5.html`. What ships is the tracked `public/jolt-landing-v5.html`. Flow: edit `frozen design/…` → verify in browser → sync to `public/` with the `../assets/` → `assets/` path rewrite → commit → push only when Dinesh says. |

## What this is

JOLT — India's rail-first express network for heavy shipments (20–500 kg: furniture, appliances, auto parts). Next Train Out (NTO) linehaul on scheduled Indian express trains, road first/last mile, 24–48 hr B2B distributor arrivals. Founded by Dinesh Reddy (ONDL Network Private Limited). **The PM is Dinesh; he drives section-by-section specs — one section at a time, wait for his brief.**

## Stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · motion (`motion/react` — the package is `motion`, never import from `framer-motion`; `framer-motion` is REMOVED from package.json) · react-hook-form + zod. Animated/interactive code lives ONLY in `'use client'` islands; `app/page.tsx` stays a server component. Fonts: Space Grotesk (load via `next/font/google` inside the island), Inter + JetBrains Mono (already in `layout.tsx`).

## Sources of truth (read before touching a section)

1. `docs/uplift-spec.md` — decision layer. READ FIRST (§0 claim corrections override the frozen copy).
2. `docs/research/01–06` — cited research (01 competitor teardown, 02 design/motion, 03 component harvest, 04 conversion, 05 claims validation, 06 rail reality).
3. `docs/v01/` — V0.1 pipeline: `README.md`, `section-inventory.md`, `section-spec-template.md`, `freeze-log.md`, `briefs/` (per-section frozen specs).
4. `frozen design/jolt-landing-v5.html` — approved design prototype (the benchmark). `design-reference/` — working mocks (gitignored).
5. `public/jolt-landing-v5.html` — deployed copy of the frozen prototype.

## Claim guardrails (release blockers — never reintroduce)

- ❌ "India's first express layer…" → ✅ "rail-first express network for 200 kg+ B2B" — **FOUNDER OVERRIDE 2026-10-19: the hero H1 keeps "India's first express layer for heavy shipments." (recorded; sweep exempts hero.tsx)**
- ❌ bare "99.2% SLA adherence" → ✅ only with definition + methodology + money-back remedy — **FOUNDER OVERRIDE: metrics band shows exact benchmark copy 80% / 99.2% / 1.4T / 24–48h (sweep exempts metrics-band.tsx)**
- ❌ "Traditional Logistics" column label → ✅ "LTL / Part-Load" — **FOUNDER OVERRIDE 2026-10-19: hero lane table uses "Traditional Logistics" verbatim (sweep must exempt it on implementation)**
- ❌ "1.4T CO₂ saved per lane" → ✅ per-shipment stat or dated figure with N basis
- ❌ "Cut transit to 2 days, rotate cash 3x faster" → ✅ "Up to 3x faster rotation…"
- ❌ DFC / Vande Bharat parcel-train references as live → ✅ "scheduled express trains"
- Never invent clients, logos, metrics, or partnerships. Marquees (Ather, Wakefit, Ola Electric, Duroflex) are founder-authorized.

## Design system (current)

- **Colors:** white hero (`#FFFFFF`, tint `#F5F7F2`/`#FBFCF8`), ink `#0C0E09`, dark `#08080A` with hairlines `rgba(255,255,255,.08)`, accent orange `#C2410C` / `#E85A2C` (max 3 beats/screen), eyebrow `#9A3412`. Body `#4A4E44`, muted `#878B80`/`#6E7366`. Old acid-green (`#D4FF3F`) is stale.
- **Fonts:** Space Grotesk (display), Inter (body), JetBrains Mono (labels/eyebrows/terminal).
- **Patterns:** grain overlay; hairline elevation; 24px rhythm; uppercase mono labels wide tracking; `prefers-reduced-motion` guard on every animation.
- **Skip:** purple AI gradients, scroll-jacking, stock truck photos, glassmorphism, emoji in UI.
- **Component stack:** shadcn/ui · Magic UI (MIT) · Motion-Primitives (MIT) · react-fast-marquee · react-map-gl + maplibre. Avoid Mapbox, react-leaflet, Tailwind UI/Plus, Cult UI. GSAP only for the pinned pipeline set-piece.

## Conversion machinery (uplift §4)

Every CTA terminates in a real flow: serviceability checker (2 pincodes → SERVED/NOT-SERVED/INVALID/ERROR, ungated) · 3-step pilot flow (contact → lanes/volume/payload → success + reference ID + 2-hour callback) · WhatsApp click-to-chat · Next.js API routes env-gated `MOCK | SHEET | FORMSPREE` (`JOLT_API_MOCK=true` default). Routes: `POST /api/serviceability`, `/api/pilot`, `/api/estimate`. The quirk/terminal modal is only for the notify-me waitlist state.

## Workflow & git rules

- **One PM brief = one section.** The founder now works **section-by-section**: he supplies the spec, you implement exactly it, founder reviews, freeze, next. Do NOT generate new design concepts unprompted — implement what he briefs.
- React components → `components/sections/`; mocks → `design-reference/` (gitignored). Frozen-prototype edits only on explicit PM request.
- **Commits are allowed freely** (logical, gated commits). **Push requires TWO separate explicit confirmations from Dinesh** — a single yes never suffices; the answer to an unprompted push is always no. Push goes to `origin/main`.
- `public/assets/` images are tracked in git — commit them when referenced.
- Copy claims must match `docs/uplift-spec.md` §0 wording; list every copy change in your summary.
- A11y: aria labels, visible focus states, reduced-motion guards, contrast ≥ 4.5:1. Footer links are dead anchors; ToS/Privacy/SLA pages exist as DRAFT under `app/(legal)/` — don't invent routes.
- **PORTS (founder rule 2026-10-19): only port 3000.** Never start other servers (e.g., static mock servers). Mock viewing = open the HTML file directly via `file://` or through the existing dev server.

## Verification workflow (used and proven in this repo)

- **React app gates (run every delivery):** `npx tsc --noEmit` · `npm run lint` (eslint .) · `npm run build` · banned-claims sweep (pipe-form grep with documented exemptions for `hero.tsx` + `metrics-band.tsx`) · Playwright browser suite · a11y contrast/keyboard. Scripts live OUTSIDE the repo at `/Users/dinesh/.jolt-verify/` (`verify-browser.mjs`, `a11y-check.mjs`, `pilot-check.mjs`); run with `cd "/Users/dinesh/JOLT Website" && PLAYWRIGHT_BROWSERS_PATH=0 node <script>.mjs` against the running dev server.
- **Dev/build cache conflict:** `npm run build` while `next dev` runs clobbers `.next` → dev 500s. Kill dev, `rm -rf .next`, rebuild, then restart dev. Always restart dev after a build.
- **Hydration-safe animation pattern (house rule):** `const [ready, setReady] = useState(false); useIsomorphicLayoutEffect(() => setReady(true), []); const animateIn = ready && !reduceMotion;` then `initial={animateIn ? "hidden" : false}` / `animate={animateIn ? (inView ? "show" : "hidden") : false}`. SSR ships visible content.
- **CSS Modules gotcha:** `classList.toggle("on")` from rAF requires `:global(.on)` in the module (`.it.on` gets hashed and never matches).
- **Test gotchas:** `innerText` applies `text-transform: uppercase` (assert on `textContent`); dialog selectors must be scoped `[role="dialog"] form button[type="submit"]`.
- **Mock-editing rule (learned 2026-10-19):** after every region-replace patch on a mock, run a div-balance check — slice edits have twice eaten a closing `</div>` and silently stacked the grid columns.
- Visual verification of videos/images: this harness cannot display images to the model — analyze via OCR/pixel metrics (Swift scripts in `/Users/dinesh/.jolt-verify/`) or ask the founder to describe. Never claim to have "seen" an image.

## Current state (as of 2026-10-19, ~15:35 IST)

- **Git:** `main` is **33 commits ahead of origin/main**; tree clean; **NOT pushed** (two-confirmations rule).
- **Site status:** FEATURE-COMPLETE for all 13 v6 briefs (committed). Go-live = React app on Railway (decided). Open release blockers: WhatsApp production number (`91XXXXXXXXXX` placeholder in serviceability-checker) · legal copy final (ToS/Privacy/SLA are DRAFT) · dispatch schedule real values.
- **Frozen spec:** `docs/v01/briefs/01-header-hero.md` — the authoritative Header+Hero V0.1 spec. Left column = benchmark dot-to-dot. Right = the frozen square stage. Loop = 9.6s start-stop.
- **Metrics band:** benchmark copy restored (founder override), count-ups kept, LIVE ticker removed.
- **Nav:** ONDL SVG logo + Start pilot + Check serviceability (frozen). **Utility bar REMOVED** (founder: benchmark starts at nav).
- **Marquee:** Ather · Wakefit · Ola Electric · Duroflex (founder-authorized).

## HERO deep-dive outcome (2026-10-19 — what was decided, read `docs/v01/briefs/01-header-hero.md` for the full frozen spec)

1. **Left column = benchmark dot-to-dot** (founder: "hero stays same as benchmark except the right-side animation"). Includes: eyebrow, H1 "India's first express layer for heavy shipments." with blaze+embers, pillars (Just-in-time execution · Direct dispatch · 80% less carbon), [ Live Lanes ] table with header "Traditional Logistics" (override), DEL→BOM showcase.
2. **Right column = THE SQUARE (frozen).** Single 1:1 white stage, spotlight + grain, 6-product parade ×1.2s (sofa · alternator · bench · bed · crib · appliances — final images still being finalised, cutout pipeline documented in the brief), chip top-left (CATEGORY/NAME/SPEC), stamp top-right "DELIVERED IN 24–48 HRS" that SLAMS AND STAYS.
3. **In-stage journey bar (bottom band):** INSTANT PICKUP → NEXT TRAIN OUT → OUT FOR DELIVERY → DELIVERED with status line, flashing nodes + ripples, gradient segment fills with arrowheads, lit labels, times row (09:10 · 09:40 · 10:30 · 11:02 — SAMPLE tag removed per founder).
4. **START-STOP LOOP (founder, final):** 9.6s total — journey fills 0–7.2s → DELIVERED flare + stamp slam → **2.4s HOLD (everything stopped)** → clean reset (stamp disappears) → restart. One master clock (production: single rAF loop; no Date.now() or separate intervals). Parade holds the 6th product through the pause.
5. **REJECTED (recorded, do not resurrect):** clock-journey variant (stages at 12/3/6/9 on the dial) — founder: images buried under the clock, continuous rotation wrong; coin-flight/trail; boarding progress strip; countdown chip; receipt line; 4-lane "Mixing Dock"; mock control bars.
6. **Mock files** (`design-reference/`, gitignored): `jolt-hero-v01-proofrail-v5-learnings.html` = the frozen hero mock (start-stop rhythm); `jolt-hero-clock-journey.html` = rejected experiment; `jolt-hero-compare-circle-vs-rect.html` = A/B comparison.
7. **Image status:** `public/assets/hero-final/` holds the working set (sofa/alternator/bench/crib/appliances cutouts + bed candidates A–D `bed-*-cutout-hi.png`). Founder deferred final image wiring ("worry about wiring later"). Pixelation fix pipeline: flood-fill cutouts + 2× Lanczos + sharpen; full-res Freepik downloads preferred (filenames carry Freepik IDs).
8. **Dispatch schedule:** `lib/dispatch-data.ts` — schedule-derived "next dispatch" module, all rows PLACEHOLDER (`verified:false`). Founder approved the concept; real values TBD. Nothing renders from it in the hero right now (benchmark dot-to-dot).

## NEXT STEPS (founder-driven, in order)

1. Founder opens a NEW lead chat to reset context (this chat is being retired due to context bloat).
2. Founder supplies specs **section by section** (he said: "i will go section by section spec").
3. Per section: implement exactly the brief → full gate → founder review → freeze in `docs/v01/freeze-log.md` → next.
4. Hero open items when the founder picks them up: H1/stamp wording (defaults in use: founder sentence + 24–48 HRS), final 6 images, dispatch schedule values.
5. Push remains blocked on TWO founder confirmations (none given yet).

## Known quirks

- `frozen design/` and `design-reference/` are gitignored; only `public/` ships.
- Cloudflare obfuscates the support email in the served HTML.
- `next.config.ts` root redirect is TEMP-DISABLED so the React app serves at `/` locally.
- `components/sections/hero.tsx` still ships the OLD dial dispatch board — **the frozen square stage is NOT yet implemented in production**. That implementation (one rAF master clock, 9.6s start-stop, journey bar, slam-and-stay stamp, `Traditional Logistics` header + sweep exemption, utility bar already removed from nav.tsx? NO — verify: nav utility bar removal is also pending) is the first implementation task for the new chat, per the frozen brief.
