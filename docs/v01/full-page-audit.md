# JOLT V0.1 — Full-Page Audit

> **Date:** 2026-10-20 · **Mode:** read-only (no code edits, no git operations)
> **Method:** source inspection + Playwright measurements (system Chrome) against the live dev server at `http://localhost:3000` (up, 200 in ~0.14s). Viewports 1440×900 / 1060 / 1024 / 768×900 / 320×700; `prefers-reduced-motion` emulation; hero freeze-frames via `?f=N#t=SS.S`; JS-disabled pass; `curl` SSR fetch. Every finding below is computed geometry / computed style / DOM / source based — no screenshots were visually inspected. Screenshots saved for the founder: `/Users/dinesh/.jolt-verify/audit-*.png` (1440/768/320 full page, 320 hero + hold frame, 320 menu, scrolled nav, reduced-motion, Gap table).
> **Scope:** whole landing page (Nav → Footer), checked against AGENTS.md design system, docs/v01/freeze-log.md, the old `aesthetic-audit.md` fix ledger, and the uplift-spec §0 claim guardrails.

---

## 0. Baseline gates — all green

| Gate | Result |
|---|---|
| Console errors / warnings on load | **0** (only React DevTools notice, filtered) |
| Page errors during full scroll-through | **0** |
| Failed network requests / 4xx–5xx | **0** |
| Hydration warnings | **0** |
| Horizontal overflow | **none** at 1440 / 768 / 320 (`scrollWidth == clientWidth`; only clipped marquee internals protrude, masked by `overflow:hidden`) |
| SSR (curl, JS-disabled) | Full text of every section present: H1, Why H2/lede/timeline, Gap H2 + full comparison table + verdict, How H2 (FlipWords SSR fallback renders all 14 words), USPs, Eco, CTA, Footer. No-JS Gap table rows compute `opacity:1` (no hidden-style flash) |
| Reduced motion | Global kill-switch `1e-05s` applied; hero = 1 static image, journey bar 100% filled, stamp visible, status INSTANT PICKUP; How journey lands delivered-static (only truck B at route end); Gap table + glow static; FlipWords plain spans; marquee static |
| Legal routes | `/tos`, `/privacy`, `/sla` all 200 with content |
| Checker flow | SERVED (500001→500001: rate + 24–48h EDD) ✓ · INVALID validation ✓ · NOT-SERVED lead capture ✓ — real wiring, no console errors |
| Pilot flow | Opens (4 fields), posts to `/api/pilot`, reference ID state — no errors on open/close |
| Hero frozen timing (freeze frames) | Verified: parade 6×1.2s; segments fill per 0–20.2% / 21.7–39.4% / 40.8–58.5%; nodes light 3.4/22.9/42%; status DELIVERED at 7.0s; **stamp slam at 7.0176s (73.1%)** — opacity 0 at t=7.016 → 0.96 at t=7.1 → 1.0 at t=7.2, **stays 1.0 through t=9.5** (2.4s hold), settles at scale 0.993; reset loops. Lane table rolls at **32s** (benchmark-exact; brief 01 says "16s" — doc drift only) |
| Hero geometry | 1440: stage 560×560 ✓, lane box bottom meets stage bottom exactly (delta 0px) ✓, 2-col grid ✓; 768: collapses to 1 col, stage 560 centered ✓; 320: stage 256×256, times row hidden ✓, no overflow ✓ |

---

## 1. Findings table

### P0 — release blockers

| # | Location | Measurement | Fix |
|---|---|---|---|
| P0-1 | `components/serviceability/serviceability-checker.tsx:48` | `WHATSAPP_NUMBER = "91XXXXXXXXXX"` — a **placeholder phone number**. Every WhatsApp deep link ships it: footer Contact (`footer.tsx:23`), checker SERVED/PARTIAL/ERROR WhatsApp buttons, pilot success WhatsApp (`pilot-flow.tsx:42`). All resolve to `wa.me/91XXXXXXXXXX` = dead channel on live conversion paths | Replace with the real business number (one constant) before any launch |

### P1 — should-fix

| # | Location | Measurement | Fix |
|---|---|---|---|
| P1-1 | `app/layout.tsx:46` + `app/globals.css:17` | **Inter still never applies.** Computed font-family of body, all paragraphs, ledes, button labels and footer links = `-apple-system, "system-ui", "Segoe UI", Roboto…`; `document.fonts.check('12px "Inter"')` = false; **0 elements** on the page render Inter. `--font-inter` is declared on `<body>`, but `--font-sans` resolves on `:root` where the var is undefined → guaranteed-invalid token. Space Grotesk / JetBrains Mono / Archivo all apply correctly | Move `inter.variable` to `<html>` in `layout.tsx` and/or hardcode `"Inter"` in the `--font-sans` token |
| P1-2 | `components/ui/resizable-navbar.tsx:168,224` | Scrolled desktop pill = **800px at every ≥1024 viewport** (measured 800px @1440 and 800px @1024 = **78vw**); `minWidth:"800px"` beats the 40% width animation. Mobile scrolled bar: width 90%, **border-radius 4px** (measured 3.99px @320, 4px @768) — a near-square bar, the opposite of the pill language | Delete `minWidth` (or `min(800px, 92vw)`); radius `4px` → `2rem` |
| P1-3 | `components/sections/metrics-band.tsx:86–101` | Benchmark copy still live: **"99.2% SLA adherence across all live lanes"** and **"1.4T CO₂ saved per lane vs road"** (rendered, verified in SSR). Both are uplift §0 release-blockers; file is on the sweep exemption list. `lib/metrics-data.ts` ships a gated audited variant that is **not wired** | Wire card 2 to `RELIABLE_DEFAULT`/audited variant; replace 1.4T with the per-shipment stat (~8.2 kg / 200 kg HYD→BLR) — founder decision recorded, needs final re-sign (see RE-CONFIRM) |
| P1-4 | `components/sections/hero.tsx:625,678` | H1 **"India's first express layer for heavy shipments."** (banned claim #1) and lane header **"Traditional Logistics"** (banned baseline) both live; both in the exempted file `hero.tsx`, per recorded founder overrides | Re-confirm before release — the two highest-visibility claim risks on the page |
| P1-5 | `components/sections/hero.module.css:491–544,788–797` | **320 hold-frame chip/stamp collision**: stamp (settled 174.5px wide, left edge x=103.9) overlaps the chip (right edge x=168) by **64.1px** — stamp paints over the chip's right side, covering the SPEC line of the product chip during the entire 2.4s DELIVERED hold. At rest the overlap is 28.4px | Shrink stamp type at ≤480 or move chip to a corner that stays clear (e.g. top-left 8px inset + smaller chip); founder already saw the rest-state mock — the hold state is worse |
| P1-6 | `components/sections/ecosystem.module.css:29–39` | Eco section tag **`#E85A2C` on `#F5F7F2` = 3.28:1** at 11px uppercase mono — fails WCAG 4.5:1 (the only non-exempt body-text contrast failure). Gap tag uses the grey variant and passes (4.79) | Use `#C2410C` (4.8:1) or the muted-grey tag treatment for light backgrounds |
| P1-7 | `components/sections/why-now.tsx:56–62` + `footer.tsx:27` | **Grain is missing on Why Now and Footer.** Measured: grain present hero (0.05), How (0.04), Eco (0.03), CTA (0.04); Why and Footer have no grain element and no hairline borders (Why 0, CTA 0; only How's USP cards and the footer bar have `rgba(255,255,255,.08)` hairlines). Spec (AGENTS.md): grain on hero + dark sections, hairline + tint elevation on dark — still half-applied | Add the shared `.grain` div to Why/Footer; add hairline/tint treatment so the three consecutive dark blocks (why→how, cta→footer) separate visually |
| P1-8 | `components/sections/ecosystem.tsx:72` | **"We're already live where you are."** — pre-launch claim (JOLT is not live anywhere yet) | Soften to intent ("We plug into the stack you already run") or gate until launch |
| P1-9 | `components/sections/how-it-works.tsx:134–136` | **"5× Faster — Five times faster than LTL aggregation on long lanes"** and **"Up to 89% less CO₂ per tonne-km vs road"** with **no footnote** (freeze-log 2026-10-20 override removed the NITI Aayog/SFC attribution) | Re-confirm basis + add footnote or soften (see RE-CONFIRM) |

### P2 — polish

| # | Location | Measurement | Fix |
|---|---|---|---|
| P2-1 | `components/sections/how-it-works.module.css:402,447–451` · `ecosystem.module.css:69–73,113,128` · `gap.module.css:71,316` · `cta.module.css:15,141` · `footer.module.css:98` · `metrics-band.tsx:126` · `customer-marquee.module.css:8` | **24px rhythm drift** (measured): How stage-row margin 20 · How USP column-gap 20 · Eco cases column-gap 20 · Eco feature-card margin 32 · Eco "same" margin 12 · Gap table margin-top 40 (freeze-log froze 48) · Gap verdict margin 40 (frozen 48) · CTA fineprint margin 26 · CTA section padding 88px mobile (96 desktop) · footer bar margin 56 · metrics grid gap 22 · hero→marquee margin 30 · marquee item padding 0 26px · metrics card padding 30/26 · hero pillars margin 30/14 | Normalize to 24-multiples (22→24, 20→24, 26→24, 30→24/48, 32→48, 40→48, 56→48, 88→96) — one mechanical pass |
| P2-2 | `components/sections/gap.module.css:10` | Section keeps `border-radius: 36px 36px 0 0` against a same-tone `#FBFCF8` body — the rounding is invisible (bg `#F4F2ED` ≈ `#FBFCF8`) | Remove, or float the section over a visible dark backdrop so the gesture reads |
| P2-3 | `components/sections/gap.tsx:168` | Lede keeps the **unspaced em dash** "workarounds—hacking" (every other dash on the page is spaced) | Space it |
| P2-4 | `app/globals.css:41` | `::selection { background:#fff; color:#000 }` — **selection is invisible on every light section** (white on `#FBFCF8`/white) | Orange tint selection, or invert per section |
| P2-5 | `components/sections/footer.module.css:67–74` | At 320 the link grid is 2 cols (`120px 120px`): Company = a **lone "Contact" in a column of one** (3 empty rows) | Stack 1 col at ≤767, or merge Company under Product |
| P2-6 | `components/sections/gap.module.css:294–297` | Mobile gutter zig-zag: at 320 wrap padding is **20px (gap)** vs **32px** everywhere else → text spine at 24/32/44/56 across sections (hero 32, metrics 32, gap 44, footer 24) | One gutter value (e.g. 32) across wraps |
| P2-7 | `components/sections/customer-marquee.module.css:25` · `hero.module.css:665,683` | Off-token greys still in use: marquee items `#9AA08E` (measured **2.62:1** on `#FBFCF8`; aria-hidden decorative), stage labels `#9AA08E`, times `#B8BCB0` (**1.93:1** at 7px, aria-hidden), chip spec `#B9B9BF`, status row `#878B80` (**3.48:1** at 8.5px, aria-hidden) | Swap to muted tokens (`#6E7366`/`#8B8B90`); stage micro-type is at the floor of legibility — NEEDS-EYES on a real device |
| P2-8 | `components/sections/hero.module.css:47` | Teal aurora blob `rgba(64,190,180,.25)` — the only cyan/teal hue on the page (benchmark-frozen) | Exempt as benchmark chrome, or retint orange on the final pass |
| P2-9 | `components/sections/cta.module.css:49–50` | Duplicate `justify-content: center` declaration (code smell) | Delete one |
| P2-10 | `app/globals.css:60–75` · `components/ui/resizable-navbar.tsx:181,340` | Dead code: `.reveal`/`.d1–.d6`, `text-outline` utility, `NavItems`, `NavbarButton` — unused | Delete |
| P2-11 | `components/sections/how-it-works.tsx:134` · radii across sections | Card-radius language: 12 (lane box) / 14 (USP, case) / 16 (eco feature) / 18 (metrics, gap) / 22 (stage) — five radii, no system | Pick two (12 + 22) |
| P2-12 | `docs/v01/briefs/01-header-hero.md:34` · `AGENTS.md:48` | Doc drift: brief says lane auto-scroll "16s" (impl + benchmark = 32s); AGENTS.md dispatch-board spec (9 products @ 0.8s, 9.0s loop) is the **stale v5 spec** — the frozen React hero is 6 products × 1.2s = 9.6s | Update both docs to the frozen 6×1.2s/9.6s spec |
| P2-13 | `components/sections/ecosystem.tsx:39` | Platform marquee item casing "**RoAdo**" (company is "RoaDo"); also the file comment says names come from the benchmark marquee but SAP · Oracle were dropped | Fix casing; align comment |

### NEEDS-EYES (founder visual decisions)

1. **320 hold frame: stamp covers chip copy** (P1-5) — 64px overlap, entire 2.4s hold. `audit-320-hold-frame.png`.
2. **CTA H2 60px** (`cta.module.css:59`) vs hero H1 68px — conversion climax or H1 competitor (unchanged from old audit).
3. **Grain on Why + Footer** — whether the founder wants the full dark-section pattern (P1-7), and grain subtlety on Eco's *light* background.
4. **Eco light rebuild** (2026-10-20) overall feel — new case cards + SCM scroll card; `audit-1440-full.png` bottom third.
5. **Hero orange density**: 56 visible orange elements in hero+nav (metrics 4, why 9, gap 2, how 12, eco 19, cta 2) vs the ≤3-beats/screen rubric — confirm the benchmark exemption formally.
6. **Stage micro-type on a real 320px device**: status 8.5px @ 3.48:1, labels 7px, times 7px @ 1.93:1, lane table 8.5–11px.
7. Customer marquee legibility in `#9AA08E` (2.62:1, decorative).

### RE-CONFIRM (founder-override claims — all violate uplift §0 as written)

| Claim | Where | Override record |
|---|---|---|
| "India's first express layer for heavy shipments" | `hero.tsx:625` (exempt file) | freeze-log + brief 01 §2.1 option C |
| "Traditional Logistics" lane column | `hero.tsx:678` (exempt file) | freeze-log 2026-10-19 |
| "99.2% SLA adherence across all live lanes" | `metrics-band.tsx:87–93` (exempt file) | component header comment (founder override) |
| "1.4T CO₂ saved per lane vs road" | `metrics-band.tsx:96–101` (exempt file) | component header comment (founder override) |
| "5× Faster … Five times faster than LTL aggregation" | `how-it-works.tsx:134–135` | freeze-log audit note |
| "Up to 89% less CO₂ per tonne-km vs road" — **no footnote** | `how-it-works.tsx:136` | freeze-log 2026-10-20 (footnote removed by founder) |
| "We're already live where you are." | `ecosystem.tsx:72` | none yet — needs one |
| Real brand names: Ather · Wakefit · Ola Electric · Duroflex (marquee) and Clickpost · Pando · eShipz · RoAdo (platforms) | `customer-marquee.tsx:32`, `ecosystem.tsx:39` | founder-authorized; verified-relationship check outstanding (flagged in both source headers) |

**Banned-claims sweep (source grep):** "rotate cash" — absent ✓ · DFC — absent ✓ · Vande Bharat — absent ✓ · bare "99.2%" and "1.4T CO₂" — only in exempt `metrics-band.tsx` ✓ · "India's first…" and "Traditional Logistics" — only in exempt `hero.tsx` ✓. Copy duplication: the Why Now ↔ How "cleanest way / black box" duplication is **fixed** (How lede rewritten); no other duplicated sentences found.

---

## 2. Section-by-section rundown

**Nav.** Top state transparent ✓; scrolled pill 800px white/80 + blur(10px), dropped 20px ✓, radius full ✓ — but the 800px floor makes it 78vw at 1024 (P1-2). Logo = ONDL mark (ink + `#E3684D→#F0855E` gradient) + Archivo wordmark ✓ (Archivo used *only* here — not orphaned); wordmark hidden ≤640 ✓. CTAs: orange capsule + white/55 ghost capsule (radius full ✓, 13px). Mobile scrolled bar 288px/radius 4px (P1-2); menu 288px white rounded-lg, 2 full-width CTAs ✓, Escape closes ✓. Focus: global orange `:focus-visible` outline settles to `rgb(232,90,44)` 2px/offset 3 on logo, both CTAs, CTA buttons, footer links ✓ (the checker trigger transitions outline-color from ink to orange over 200ms — cosmetic). Tab order clean, no unnamed controls.

**Hero (frozen).** All frozen geometry/timing verified (gates table). Copy: eyebrow `#9A3412` (7.09:1 ✓), H1 68px ink, pillars 15px with 7px orange squares, "80% less carbon" safe. Lane box: header "ROUTE | TRADITIONAL LOGISTICS | JOLT DELIVERIES" (override), showcase DEL→BOM row leads both loop halves ("4–5 days → 2 days"), 22 rows, 32s scroll, hover-pause, reduced-motion stop ✓. Stage: 22px radius, spotlight, grain, chip/stamp/stagebar/ticker per frozen spec; `role="img"` + full aria-label ✓. **320 hold: 64px stamp-over-chip (P1-5).** Hero orange: 56 visible beats (benchmark-frozen). Marquee: 15px Space Grotesk `#9AA08E` (2.62:1, aria-hidden), 26s, hover-pause, margin-top 30 (P2-1).

**Metrics.** White band, 4 cards radius 18, count-up once in view, reduced-motion static ✓. Grid gap 22 (P2-1); card padding 30/26 (P2-1). Copy = benchmark verbatim (P1-3 / RE-CONFIRM).

**Why Now (frozen).** Spacing frozen-normalized ✓ (tag→H2 24, H2→lede 24, timeline 48, footnote 24, term-line 72 — all measured). Copy per freeze-log ✓, "Up to 3x faster rotation…" exact allowed wording + footnote ✓. **No grain, no hairlines (P1-7).** Orange: 9 beats.

**Gap (frozen).** H2 + pointer draw-in on "never built for you." — draw-in box measured present; phrase turns **#FF5757** only after the pointer completes ✓ (2.78:1, founder exemption recorded). Comparison table: 880px centered ✓, mono strip ✓, row indices ✓, marks ✓ green `#2E7D32` / red `#CC2424` (both pass contrast) ✓, row 2 = double-✕ with no row tint ✓, staged reveal (rows roll in 0.5s stagger) ✓, **travelling glow** cycles in reading order at 0.8s/cell ✓ (measured: cell 2 lit in sample 1, cell 3 in sample 2), reduced-motion fully static ✓. Drift vs freeze-log: table margin 40 (frozen 48), verdict margin 40 (frozen 48) (P2-1); invisible 36px top radius (P2-2); unspaced em dash (P2-3).

**How It Works.** H2 FlipWords on "purpose-built express layer" gated on the heading's own visibility (0.6) ✓ — SSR + reduced-motion render plain spans ✓. Lede duplication vs Why **fixed** ✓. Journey graphic: truck→halt→train sprint→halt→truck, 8s loop, orange drag trails (train trail 150px + speed-lines) ✓, handoff pulses at 25%/75% ✓, hover-pause ✓, reduced-motion lands delivered-static (only truck B visible at route end) ✓. USPs: 3 cards (radius 14), spec footer hairline ✓. **"5× Faster" + "89% less CO₂" unattributed (P1-9).** Rhythm: stage-row 20, USP gap 20 (P2-1). Grain ✓.

**Ecosystem (rebuilt light, 2026-10-20).** `#F5F7F2` ✓ matches system tint; sequence hero→metrics white → why dark → gap light → how dark → **eco light** → cta dark → footer dark ✓ exactly as intended. Grain ✓ (0.03, on light). Beam: horizontal line travelling top→bottom 7s + 3 sparkles ✓ (per freeze-log restoration). SCM scroll: 26s marquee, `#6B6B66` (4.97:1 ✓), masked edges ✓. Case cards B2B/B2C ✓. **Tag contrast 3.28:1 (P1-6)**; "already live where you are" (P1-8); feature-card margin 32 / cases gap 20 / same-margin 12 (P2-1); "RoAdo" casing (P2-13).

**CTA.** Dark, centered ✓, grain ✓, orange radial glow ✓. H2 60px (NEEDS-EYES #2). Buttons: primary → `#live-lanes` anchor ✓ (contrast 5.65:1), ghost → real pilot dialog ✓ (opened in test). Fineprint → `/sla` ✓. Padding 88 mobile / 96 desktop (P2-1); fineprint margin 26 (P2-1); duplicate `justify-content` (P2-9). Orange: 2 beats — most disciplined section.

**Footer.** Dark, Space Grotesk logo + orange italic "Deliveries" ✓, mono headers ✓, hairline top on bar ✓, `#B9B9BF` links (10.25:1 ✓). Product links → real on-page anchors ✓; Legal → real routes ✓; **Contact → WhatsApp with the placeholder number (P0-1)**. No grain (P1-7). Bar margin 56 (P2-1); orphan Contact at 320 (P2-5).

---

## 3. Frozen-section verdicts

| Unit | Verdict | Note |
|---|---|---|
| Header + Hero | **STABLE** | Every frozen geometry/timing re-verified (0px lane/stage delta, 73.1% slam, 2.4s hold, 6×1.2s). Open items are the recorded overrides (P1-4) + the 320 hold chip/stamp overlap (P1-5) |
| Metrics band | **STABLE** (copy = RED) | Benchmark-exact; 99.2% / 1.4T live under recorded override — resolve before launch (P1-3) |
| Why Now | **STABLE** | Spacing + copy match freeze-log exactly; only the cross-cutting grain/hairline pattern is missing (P1-7) |
| Gap | **STABLE (2 spacing drifts)** | Table/verdict margins 40 vs frozen 48 (P2-1); everything else (marks, glow, phrase timing, exemption) verified |
| How It Works | **STABLE** | Rhythm normalized (tag/H2/lede = 24 ✓); 20px seams + unattributed claims remain (P1-9, P2-1) |
| Ecosystem | **REBUILT (light)** | Founder condensation of 2026-10-20 supersedes the old audit entirely (D2C brown band / orange H3 findings obsolete); new P1-6/P1-8 apply |
| CTA | **STABLE** | Grain added since old audit; 88px mobile padding + 26px fineprint still off-rhythm |
| Footer | **STABLE** | Frozen v5 port intact; P0-1 placeholder number is the release blocker here |

---

## 4. Old-audit fix ledger (aesthetic-audit.md → now)

| Old finding | Status |
|---|---|
| Inter never applied (§0.1) | ✗ **STILL BROKEN** — verified 0 elements render Inter (P1-1) |
| 24px rhythm drift in How/Eco/CTA (§0.2) | ◐ Tag→H2 and H2→lede fixed to 24 in How/Eco/CTA ✓; 12 residual drifts remain (P2-1) |
| Nav pill minWidth 800 + mobile radius 4px | ✗ **STILL BROKEN** (P1-2) |
| 320 chip/stamp collision | ✗ **STILL PRESENT** — 28.4px at rest, **64.1px at hold** (P1-5) |
| Dark-section pattern (grain/hairlines) | ◐ Grain added to How + CTA (+ Eco, now light); **Why + Footer still flat** (P1-7) |
| Why↔How black-box duplication | ✓ **FIXED** (How lede rewritten) |
| Invisible Gap 36px top radius | ✗ **STILL PRESENT** (P2-2) |
| Ecosystem D2C brown gradient + orange H3 | ✓ **OBSOLETE** (section rebuilt light on 2026-10-20) |
| Unspaced em dash in Gap lede | ✗ **STILL PRESENT** (P2-3) |
| Footer orphan "Contact" at 320 | ✗ **STILL PRESENT** (P2-5) |
| Container/gutter zig-zag (§0.3) | ✗ Unchanged (hero 142px vs sections 182px left edge @1440; mobile gutters 24/32/44/56) |
| CTA 60px H2 vs H1 | ◐ Unchanged — still NEEDS-EYES |
| Metrics grid gap 22 / hero→marquee 30 / footer bar 56 | ✗ Unchanged (P2-1) |
| Dead code (reveal utilities, NavItems/NavbarButton) | ✗ Unchanged (P2-10) |
| Brand-marquee #9AA08E | ✗ Unchanged (P2-7) |

---

## 5. Top 10 for the founder

1. **P0-1: WhatsApp number is a placeholder** (`91XXXXXXXXXX`) on every WhatsApp CTA — one-line fix, blocks launch.
2. **P1-1: Inter still never renders** — all body copy ships in system font (biggest cross-platform visual shift).
3. **P1-2: nav pill 800px floor** (78vw at 1024) + mobile scrolled radius 4px.
4. **P1-5: 320 hold frame — stamp covers the product chip by 64px** for the whole 2.4s hold.
5. **P1-3: "99.2% SLA" + "1.4T CO₂" still on the metrics band** (exempted file, founder override — re-sign or swap to the gated audited variant).
6. **P1-4: H1 "India's first express layer" + "Traditional Logistics" column** — both recorded overrides, both high-visibility claim risks.
7. **P1-9: "5× Faster" and "89% less CO₂" unattributed** (footnote removed 2026-10-20).
8. **P1-7: Why Now + Footer still have no grain/hairline** — the dark-section pattern is half-applied.
9. **P1-6: Eco tag 3.28:1 contrast** — only non-exempt body-text failure.
10. **P1-8: "We're already live where you are."** — pre-launch claim on a not-yet-live network.
