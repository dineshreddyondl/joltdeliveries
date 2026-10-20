# JOLT — Mobile Compatibility Audit (v01)

**Scope:** full landing page `http://localhost:3000` (Next.js 15 dev server, confirmed UP — HTTP 200).
**Date:** 2026-10-20 · **Method:** Playwright 1.64 device emulation + raw viewports, measurement-only (no code edits, no git ops).
**Viewports tested:** 320 · 344 · 360 · 375 (iPhone SE) · 390 (iPhone 13) · 393 (Pixel 5) · 414 · 480 · 640 · 768 (iPad Mini) — all with touch; plus `prefers-reduced-motion` profile at 390, `#t=7.3` freeze frames, and a JS-disabled `curl` of the SSR HTML.
**Screenshots:** `/Users/dinesh/.jolt-verify/mobile-*.png` (full-page per width + targeted: hero hold frame, gap table, how-it-works, eco, CTA modal, nav menu, checker dialog, pilot dialog, reduced-motion hero).

> **Limitation (stated for the record):** only Chromium build 1243 is installed locally — no Playwright WebKit — so *real iOS Safari rendering* could not be executed. All iOS/Safari findings are based on (a) static CSS inspection, (b) computed styles in iOS-UA device emulation, and (c) geometry math. Findings below are measurement-based; where an estimate is used (keyboard height) it is flagged.

---

## 1. PASS/FAIL matrix (per viewport × check)

| Check | 320 | 360 | 375 SE | 390 iP13 | 393 P5 | 414 | 480 | 640 | 768 iPad | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| Doc `scrollWidth` vs `clientWidth` on load | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | **PASS** |
| Doc overflow after full scroll-through (max during scroll) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | **PASS** |
| Per-section overflow (non-decorative) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | **PASS**¹ |
| Hero stage 1:1 sizing | 256² | 296² | 256² | 326² | 329² | 350² | 416² | 560² | 560² | **PASS** |
| Hero lanes table fits | 254=254 | 294=294 | 254=254 | 324=324 | 327=327 | 348=348 | 414=414 | 574=574 | 702=702 | **PASS** |
| Hero stamp/chip overlap (hold frame) | ✗ 2746px² | ✗ 1032px² | ✗ 389px² | ✓ 0 | ✓ 0 | ✓ | ✓ | ✓ | ✓ | **FAIL ≤375** |
| Metrics band wraps without overflow | ✓ 1×4 | ✓ 1×4 | ✓ 1×4 | ✓ 1×4 | ✓ 1×4 | ✓ 1×4 | ✓ 1×4 | ✓ 2×2 | ✓ 2×2 | **PASS** |
| Why-now timeline stacks | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | **PASS** |
| Gap 3-col table fits + marks visible | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | **PASS** |
| Gap travelling glow animates | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | **PASS** |
| How-it-works journey fits (glyphs inside route) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | **PASS**² |
| How stage labels row | ⚠ 69px cols | ⚠ | ⚠ | ⚠ | ⚠ | ⚠ | ⚠ | ✓ | ✓ | **WARN ≤640** |
| USP cards stack | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | **PASS** |
| Eco SCM scroll + mask | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | **PASS** |
| Eco case cards | stack | stack | stack | stack | stack | stack | stack | stack | 2-up | **PASS** |
| CTA centered + buttons fit | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | **PASS** |
| CTA modal close ✕ reachable | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | **FAIL (P0)**³ |
| CTA modal footer buttons reachable | ✗⁴ | ✗⁴ | ✗⁴ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | **FAIL ≤375 (P0)** |
| Tap targets ≥44×44 (violations) | 12 | 12 | 12 | 12 | 12 | 12 | 12 | 12 | 11 | **FAIL (P2)** |
| Input font ≥16px (no iOS zoom) | 14px | 14px | 14px | 14px | 14px | 14px | 14px | 14px | 14px | **FAIL (P1)** |
| Smallest body text ≥14px (non-mono) | 13px | 13px | 13px | 13px | 13px | 13px | 13px | 13px | 13px | **FAIL (P2)** |
| Text overlap/truncation (bounding boxes) | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | **PASS** |
| Console errors / warnings | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | **PASS** |

¹ `#top` (hero) and `#cta` report `scrollWidth > clientWidth` (e.g. 562 vs 320), but both have `overflow:hidden` and zero non-decorative offenders — caused by `aria-hidden` aurora/glow layers, clipped by design. The widest live elements are the two marquee tracks (eco SCM 1392px, customer 1297px) — intentional, masked.
² Glyph rects at 320: truck 78–108, train 110–168, truck 182–212, all inside the 208px route. Fit ✓, props are small (30×17px truck, 58×17px train) but on-scale.
³ Root cause is a z-index war, not the icon size: nav `z-[1000]` vs modal `z-50` — measured `elementFromPoint` at the ✕ center returns the nav container at 390 (✕ at y=59, nav bottom 64). See P0-1.
⁴ On 320×568 the modal panel is 511px (max-h 90%) but the footer runs to y=603 — clipped by the panel's `overflow:hidden`; only ~26px of the footer shows. ✕ is also under the nav, so the modal has **no reachable close control** on 568-tall phones (outside-tap band is ~28px top / 28px bottom). See P0-2.

**Reduced motion (390 profile):** hero stage static fallback ✓ (stamp visible, product 1 held, `INSTANT PICKUP`, bars full); lane auto-roll stops ✓ (`hero.module.css` guard); gap glow static ✓. **FAIL:** customer marquee, the entire How-it-works journey (7 keyframes) and the Eco beam/sparks + SCM scroll keep animating — no CSS guard.

**SSR / no-JS (curl):** all sections' text present in server HTML — FlipWords heading ("purpose-built express layer"), Gap rows ("Express Courier Network" / "LTL Network"), metrics, lanes, CTA modal trigger labels ("Check Active Routes", "Start Pilot"), nav triggers ("Start pilot", "Check serviceability"), footer legal. Dialog contents render client-side only (expected; triggers are server-rendered). **PASS.**

---

## 2. Top issues (P0 / P1 / P2)

### P0 — release blockers

1. **CTA modal close ✕ is covered by the fixed nav on mobile (z-index war).**
   Nav wrapper is `fixed … z-[1000]` (`components/ui/resizable-navbar.tsx:137`); the animated-modal overlay + panel are `z-50` (`components/ui/animated-modal.tsx:105,174`). Measured at 390: ✕ center (357,59) → `elementFromPoint` = nav container; same for the checker dialog header (dialog top 33 < nav bottom 64) and pilot dialog (✕ y=11).
   **Fix (one line):** `z-50` → `z-[1100]` on both the overlay and panel containers in `animated-modal.tsx` (and raise Radix dialog overlay/content z in `components/ui/dialog.tsx:37,57`), or temporarily lower the nav's z while a dialog is open.

2. **On 568px-tall phones the CTA modal has no reachable close control.**
   Panel is `max-h-[90%]` + `overflow-hidden` (`animated-modal.tsx:114`) with non-scrolling content: at 320×568 the footer (y 514–603) is clipped at the panel bottom (540) — Close / "Begin the 3-step pilot" are ~10px slivers; the ✕ is under the nav (P0-1). Only escape hatches are the 28px outside-tap bands.
   **Fix:** make `ModalContent` scrollable (`overflow-y:auto` on the flex-1 content, keep footer in normal flow), and apply P0-1's z fix.

### P1 — high

3. **Hero "DELIVERED IN 24–48 HRS" stamp overlaps the product chip at widths ≤375px.**
   Freeze-frame (`#t=7.3`) overlap areas: 320→2746px², 344→1718px², 360→1032px², 375→389px², 390→0. Same geometry every live loop when the stamp slams.
   Fix: in the `≤480px` block of `components/sections/hero.module.css` (chip :491, stamp :527, media :788-797) stack the stamp *below* the chip (`top: 10px → top: 86px` or shrink stamp padding/font), or shorten stamp copy.

4. **Dialog inputs are 14px → iOS Safari zooms on focus.**
   `components/serviceability/serviceability-checker.tsx:364` and `components/pilot/pilot-flow.tsx:138` (`text-[14px]`). Measured computed font-size 14px on all 7 inputs at 390.
   Fix: `text-[16px]` on the shared field class.

5. **Fixed, vertically-centered dialogs hide their submit under the iOS keyboard.**
   `dialog.tsx:57` centers `top-[50%]` with no max-height/scroll. Measured at 390×664 (iPhone 13): checker submit spans y≈498–540; pilot "Get my pilot quote" ends y≈514; with a ≈300px keyboard the visible bottom is ≈364 → both CTAs unreachable while the keyboard is open. (Keyboard height is an estimate; geometry measured.)
   Fix: cap dialog at `max-h-[calc(100dvh-32px)]` with internal `overflow-y:auto`, or align to top on short viewports.

6. **`prefers-reduced-motion` not honored by CSS keyframes (AGENTS.md convention).**
   Still animating under `reduce` at 390: customer marquee (`customer-marquee.module.css:16`), How-it-works journey — 7 animations (`how-it-works.module.css:143,147,206,227,247,335` + keyframes 208/251/272/302/340/357/374), Eco SCM scroll + beam + sparks (`ecosystem.module.css:147,195,213`).
   Fix: wrap each `animation:` in `@media (prefers-reduced-motion: reduce) { animation: none; }` (hero already does this — `hero.module.css:800`).

7. **Pilot dialog is taller than the viewport at 390 (669px vs 664; top = −2px).**
   No `max-height`/scroll on `dialog.tsx` content; on 568-tall phones it would clip ≈100px.
   Fix: same as P1-5.

8. **Modal close buttons are far below 44×44:** animated-modal ✕ 16×16 (`animated-modal.tsx:188`), pilot ✕ 24×24 (`pilot-flow.tsx:649`), checker ✕ 24×24 (`serviceability-checker.tsx:692`).
   Fix: `size-11` buttons with padding (44px hit area) + keep P0-1.

### P2 — polish

9. **Tap targets <44px in chrome:** hamburger 38×38 (`resizable-navbar.tsx:308`, `p-2` + 22px icon); mobile-menu CTAs 42px tall (`nav.module.css:29-42`); footer links 33px tall (`footer.module.css:95-101`); support email 18px (`footer.module.css:74`); CTA fineprint "SLA policy" 14–31px tall (`cta.tsx:201-203`, `cta.module.css:145`).
   Fix: add padding / min-height 44px, or wrap fineprint link with generous padding.

10. **Mobile menu stays open after its CTAs are tapped** (verified: after opening the checker from the menu, and after closing the dialog, the menu is still open behind/above content). `MobileNavMenu` only closes on Escape (`nav.tsx:129-145`).
    Fix: call `onClose()` in the CTA click handlers inside the menu.

11. **Sub-14px body text (22 nodes at 390):** metrics lead-ins 13px (`metrics-band.tsx:169`), CTA fineprint 11.5px (`cta.module.css:140-144`), footer `.by`/`.bar` 12px (`footer.module.css:53,110`), plus 13–13.5px button labels. Smallest overall text 8px (lanes header, decorative mono — acceptable).
    Fix: bump the 4 non-decorative cases to ≥14px.

12. **How-it-works stage labels stay on one row at 320** (three 69px columns; "Just-in-Time Linehaul" wraps to 4 lines). No overflow, but cramped.
    Fix: stack stages (grid 1fr) below 480px in `how-it-works.module.css` stageRow media block.

13. **Two "Close" accessible names in the CTA modal** (icon ✕ `aria-label="Close"` and footer button text "Close") — ambiguous for assistive tech and for automation. Rename one ("Close dialog").

14. **Checker result announcement empty:** `[aria-live="polite"]` never receives the SERVED text (measured after a successful SERVED response).
    Fix: set the announcer in the success branch of `serviceability-checker.tsx`.

---

## 3. Section-by-section verdicts

- **Hero / dispatch board — PASS with 1 defect.** Stage is a perfect 1:1 square at every width (256–560px); lanes table fits (254–702px, sw=cw everywhere); pillar row wraps cleanly; `#t=SS.S` freeze frames work on mobile (stamp opacity 1, status DELIVERED, 6th product held). Live loop verified end-to-end at 320 (status advances INSTANT PICKUP → … → DELIVERED). Defect: stamp/chip overlap ≤375px (P1-3).
- **Metrics band — PASS.** 1×4 below 640, 2×2 at 640–768, no overflow, cards equal-width.
- **Why Now — PASS.** Timeline stacks at all mobile widths with 27px node rail; text 15px.
- **Gap — PASS.** 3-column matrix fits at 320 (sw=cw); ✓ green / ✕ red marks visible; travelling cell glow animates on mobile; tiny-screen CSS (≤400px) drops index/notes as designed.
- **How It Works — PASS (minor warn).** Journey graphic scales to 208px at 320 with all three props inside the route; USP cards stack; FlipWords h2 fits (208=208). Stage label row is cramped at ≤640 (P2-12). Reduced-motion FAIL applies here (P1-6).
- **Ecosystem — PASS.** Feature card 256px at 320 → 704px at 768; SCM scroll masked (`-webkit-mask-image` computed ✓) and running; case cards stack ≤640, 2-up at 768; beam spans the card. Reduced-motion FAIL applies here (P1-6).
- **CTA — FAIL.** Copy/buttons centered and ≥44px (49–51px tall). The two animated modals open on tap, lane table scrolls, footer Close works at 390, outside-tap/Escape paths exist, body scroll-lock restored after close. But: ✕ unreachable under nav (P0-1), footer clipped on 568-tall phones (P0-2), pilot dialog taller than viewport (P1-7).
- **Footer — PASS (minor tap sizes).** Contact wraps without overflow; columns 2-up ≤640, 3-up at 768; logo row intact. P2-9 tap sizes.

---

## 4. Measurement appendix (selected numbers)

- **Document overflow:** sw = cw at all 9 widths, on load and after full scroll-through; `maxSWDuringScroll` never exceeded the viewport.
- **Offender census:** non-decorative offenders = **0**; top overflowing elements are the two marquee tracks (eco 1392px, customer 1297px) inside `overflow:hidden` masked parents.
- **Tap audit:** 12 violations on every phone width (see P0-8, P2-9); CTA section buttons pass (192×49, 120×51).
- **Checker flow at 390 (touch):** menu → dialog (342×528, top 68) → 500001/500003/100 kg → **SERVED** result rendered in-dialog: "LANE LIVE · 24–48 hours · rate ₹540–₹690". Inputs 14px (FAIL), submit hidden under keyboard (FAIL), ✕ partially under nav (FAIL), menu remains open behind (FAIL).
- **Pilot dialog at 390:** 342×669 (top −2); inputs 14px; ✕ 24×24 covered by nav; CTA bottom 514 (keyboard risk).
- **Routes modal at 390:** 390×580, top 42, `max-height:90%`, lane table scrolls (46vh), footer buttons at bottom 605 (reachable). ✕ 16×16 covered by nav.
- **Routes modal at 320×568:** panel 511px, footer clipped to y=540 (buttons unreachable).
- **Reduced motion:** hero ✓ static; gap glow static ✓; lane roll stops ✓; **marquee + how journey + eco beam/scroll still run** ✗.
- **Console:** zero errors/warnings/pageerrors across all 10 profiles and all interaction tests.
- **SSR:** 75 KB HTML; all section copy + CTA trigger labels + aria-labels present.

## 5. Screenshots produced

`/Users/dinesh/.jolt-verify/` — `mobile-{320,360,375,390,393,414,480,640,768}-full.png`, `mobile-320-hero-hold.png`, `mobile-320-hold-frame.png`, `mobile-390-hold-frame.png`, `mobile-320-gap.png`, `mobile-320-how.png`, `mobile-320-how-stages.png`, `mobile-320-eco.png`, `mobile-320-cta.png`, `mobile-320-routes-modal.png`, `mobile-320-live-hero.png`, `mobile-390-top.png`, `mobile-390-nav-menu.png`, `mobile-390-checker-dialog.png`, `mobile-390-checker-result2.png`, `mobile-390-cta-modal-open.png`, `mobile-390-pilot-dialog.png`, `mobile-390-reduced-motion-hero.png`.

Raw measurement data: `/Users/dinesh/.jolt-verify/results.json` (sweep), `results2-7.json` (probes), `audit.mjs`, `audit2.mjs`, `probe3-7.mjs` (harnesses, re-runnable).
