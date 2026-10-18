# JOLT Website — Go-Live Readiness Report

> Generated 2026-10-19 by the lead agent. Evidence: full gate run (tsc · eslint · `next build` · banned-claims sweep · Playwright browser suite · contrast/keyboard audit · pilot E2E) on commit `59cf97e` and the local HEAD at generation time. All 13 v6 briefs are implemented and committed on local `main`; **nothing is pushed** (two-confirmations rule).

## Acceptance sweep (next-version-plan criteria 1–14)

| # | Criterion | Status | Evidence |
|---|---|---|---|
| 1 | Zero banned claims | 🟡 PARTIAL | React app clean (grep, 4 surfaces). `public/jolt-landing-v5.html` still carries pre-correction claims — it is the Cloudflare surface and untouched by design until the deploy decision. |
| 2 | Hero H1 + lanes table | ✅ PASS | "India's rail-first express network for 200kg+ B2B." · "LTL / Part-Load" · DEL→BOM showcase row (SSR-verified) |
| 3 | Dispatch board spec | ✅ PASS | 9 payloads, 0.8s cadence, 7.2s sweep, stamp slam at 12, pause/play, reduced-motion static |
| 4 | Metrics band copy + gating | ✅ PASS | Brief 01 verbatim; founder-gated Option A ships DEFAULT (no invented %) |
| 5 | Every CTA real | 🟡 PARTIAL | Checker ✅ · pilot ✅ · estimate ✅ · legal ✅. WhatsApp links functional but use placeholder `91XXXXXXXXXX` — **needs production number** |
| 6 | Quirk terminal only for notify-me | ✅ PASS | No quirk modal exists in the React app |
| 7 | Footer + legal pages | ✅ PASS | Zero dead anchors; /tos /privacy /sla 200; SLA page carries definition + methodology + money-back remedy (DRAFT copy) |
| 8 | Build + lint | ✅ PASS | `tsc` clean · `eslint` 0/0 · `next build` 14 static pages |
| 9 | A11y | ✅ PASS | Contrast audit 0 failures (109 elements + dialog); keyboard flow verified; reduced-motion zero hydration errors; 320px no overflow |
| 10 | Real-brand marquees | ✅ PASS | None in React (generic capability tokens only) |
| 11 | `/` serves claim-correct version | 🟡 PARTIAL | Local `/` = React v6 (verified). **Deploy decision pending** — live joltdeliveries.com still serves the static v5. |
| 12 | SEO surface | ✅ PASS | Claim-correct title, meta, OG + Twitter, favicon, robots.txt, sitemap.xml, OG image — all 200 |
| 13 | Estimate widget | ✅ PASS | Ungated, rate band + disclaimers, verified E2E (₹2,600 example) |
| 14 | Only allowed dirs changed | ✅ PASS | `app/ components/ lib/ docs/` + configs; `frozen design/` and `public/` untouched |

**Score: 11 PASS · 3 founder-gated partials.**

## What the founder must decide (nothing here is code)

1. **WhatsApp production number** — replace `WHATSAPP_NUMBER` in `components/serviceability/serviceability-checker.tsx`. Last hard release blocker.
2. **Legal copy** — ToS/Privacy/SLA pages are DRAFT; finalize wording (or get counsel review) before go-live.
3. **Deploy decision** — `/` on joltdeliveries.com: (a) switch Cloudflare/redirect to the React app on Railway, or (b) ship a claim-corrected static copy of the v5 page. Option (a) is the v6 end-state.
4. **Railway env** — `JOLT_API_MOCK=true` for go-live; `JOLT_API_BASE_URL`/`JOLT_API_KEY` when the real backend exists.
5. **Push** — local `main` is 12 commits ahead of origin; push requires two separate confirmations.

## Post-go-live maintenance loop (Goal 3)

Per brief: PM brief → lead/sp specialist implements → gate (tsc/lint/build/sweep/Playwright/a11y) → commit. Verification scripts live in `/Users/dinesh/.jolt-verify/` (run with `PLAYWRIGHT_BROWSERS_PATH=0` against the dev server; never run `next build` while dev is up).
