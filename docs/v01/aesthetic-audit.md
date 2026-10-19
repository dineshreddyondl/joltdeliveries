# JOLT V0.1 — Aesthetic Audit

> **Date:** 2026-10-19 · **Scope:** whole landing page (Nav → Footer) · **Mode:** read-only
> **Method:** source inspection + Playwright measurements against the live dev server at `http://localhost:3000` (1440×900, 768×900, 320×700; freeze frame `#t=7.5`; reduced-motion). No source files modified. No screenshots were visually inspected — everything below is computed geometry/color/typography; anything needing the founder's eye is marked **NEEDS-EYES**.

## Baseline verification (existing scripts, run from /tmp copies with system Chrome)

| Gate | Result |
|---|---|
| `hero-geometry.mjs` | **10/10 green** — 1440 stage 560×560 ✓, lanes bottom meets card bottom (delta 0px) ✓, 2-col grid ✓, chip+stamp inside stage ✓, no overflow ✓; 768 grid collapses ✓; 320 chip+stamp inside, times hidden, no overflow ✓; `#t=7.5` hold frame stamp painted ✓ |
| `verify-browser.mjs` | **All green** — no page errors, no overflow at 1440/320, reduced-motion static frame correct (1 img visible, 3/3 fills full, 4/4 labels lit, stamp opacity 1), checker SERVED/INVALID states render |
| `a11y-check.mjs` | **0 contrast failures page-wide** (worst: `FURNITURE` chip label 4.57:1 @ 8px; lane table 4.88:1 @ 8.5–11px). Keyboard flow green. |

The page's *minimums* are healthy. The findings below are about design-system fidelity, rhythm, and coherence — not breakage.

---

## 0. Cross-cutting findings (read first)

### 0.1 🔴 Body text renders in the system font — Inter is never applied
Measured: **every** paragraph, lede, button label and footer link computes to `-apple-system, "system-ui", "Segoe UI", Roboto, …` instead of Inter. Display (Space Grotesk), mono (JetBrains Mono) and Archivo all apply correctly; **Inter is loaded (woff2 downloaded) but never used.**

Root cause: `globals.css:16-18` defines `--font-sans: var(--font-inter), "Inter", sans-serif` inside `@theme`, which Tailwind emits on `:root`. But next/font defines `--font-inter` on the **body** element (`layout.tsx:46` puts `${inter.variable}` on `<body>`), and the var is **undefined at `:root`**. Per CSS custom-property substitution rules the whole `--font-sans` token computes to *guaranteed-invalid* (measured: empty string), so `font-family: var(--font-sans)` is invalid at computed-value time and `font-family` (inherited) falls back to the preflight system stack. Fix options: (a) move the `inter.variable` class to `<html>` in `layout.tsx`, (b) hardcode `"Inter", sans-serif` in the token, or (c) both. On macOS this is subtle (SF ≈ Inter); on Windows/Android it ships Segoe UI/Roboto — a different voice for all body copy.

### 0.2 🟠 24px rhythm is only half-applied
The freeze-log records Why Now and Gap being normalized to the 24px rhythm. How It Works, Ecosystem, CTA, Metrics and the hero→marquee seam were **not**, and every divergence is measured:

| Location | Value | Should be |
|---|---|---|
| How/Eco/CTA tag → H2 margin (`how-it-works.module.css:27`, `ecosystem.module.css:27`, `cta.module.css:39`) | **22px** | 24 (Why/Gap use 24) |
| How/Eco lede margin-top (`:44`, `:44`) | **20px** | 24 |
| CTA lede margin-top (`cta.module.css:78`) | **22px** | 24 |
| CTA H2 margin-bottom (`cta.module.css:55`) | **26px** | 24 |
| CTA fineprint margin-top (`:133`) | **26px** | 24 |
| How cols margin-top (`how-it-works.module.css:208`) | **40px** | 48 |
| Eco band margin-top (`ecosystem.module.css:57`) | **44px** | 48 |
| Eco marquee margin-top (`:101`) | **44px** | 48 |
| Metrics card grid gap (`metrics-band.tsx:126`) | **22px** | 24 |
| Hero → marquee gap (`customer-marquee.module.css:8`) | **30px** | 24 or 48 |
| Hero section padding (`hero.module.css:13`) | **118px / 26px** | intentional nav clearance, but bottom 26 is off |
| Footer bar margin (`footer.module.css:87`) | **56px** | 48 |

Boundary gaps between sections are all **0px** (sections butt; padding carries the rhythm), so adjacent paddings stack: why→gap = 128px, gap→how = 128px, how→eco = 128px, eco→cta = 184px (88+96). No section boundary has a hairline, so the three consecutive dark blocks (why → how → eco) read as one undifferentiated dark mass.

### 0.3 🟠 Container widths and gutters drift
Measured left edge of text content at 1440: hero **142px** (1220 max + 32 pad) vs all narrative sections **182px** (1140 + 32) vs footer **150px** vs CTA centered. At 320 the mobile gutter is **32px** for hero/metrics, **56px** for why/gap/how/eco/cta (24 section pad + 32 wrap pad), **24px** for footer. Nothing overflows, but the page's left spine zig-zags ~40px desktop / ~24px mobile between sections.

### 0.4 🟠 Accent-orange discipline (rubric B2: ≤3 beats/screen)
Measured orange text/bg elements per section at 1440: **hero (incl. nav) 55 · metrics 4 · why 9 · gap 6 · how 6 · eco 4 · cta 2 · footer 1.** The hero exceeds the rubric by an order of magnitude — it is benchmark-frozen by founder order, but the B2 gate will flag it unless "benchmark-exact hero" is formally exempted in the gate. Why Now's 9 (tag + 3 nodes + sup + prompt) and Gap's 6 are the next-heaviest; the others are disciplined.

### 0.5 🟠 Dark-section pattern drift
Design system (AGENTS.md / uplift §1): grain on hero **and dark sections**, hairline borders + background-tint elevation on dark. Measured reality: grain exists **only** on the hero stage (`hero.module.css:438-444`); the only hairlines on dark are eco bands (`ecosystem.module.css:55`), eco marquee (`:104-105`) and footer bar (`footer.module.css:90`). Why Now, How It Works, CTA and the footer body are flat `#08080A` with no tint, no hairline, no grain. Eco partially implements the spec; nothing else does — the pattern is inconsistent across adjacent dark sections.

### 0.6 Dead code (minor)
`globals.css:60-69` `.reveal`/`.d1–.d6` and `:72-75` `text-outline` are unused; `NavItems`/`NavbarButton` in `resizable-navbar.tsx` are unused exports. No visual impact, but they drift as the codebase grows.

---

## 1. Nav

**Design-system compliance.** Logo: ONDL mark + Archivo wordmark (`nav.tsx:96-98`, `nav.module.css:12-31`) ✓ correct font role. CTAs: orange capsule `Start pilot` (#E85A2C on #0B0D02) + white-glass ghost `Check serviceability` ✓. Off-palette micro-note: button text `#0B0D02` is neither ink `#0C0E09` nor dark `#08080A` — a third dark tone (stamp shares it, CTA primary uses `#08080A`). Orange beats: 1 (the Start pilot capsule). Radius: `rounded-full` in all states ✓.

**Spacing.** Fixed bar height 64px; hero clears it with 118px top padding. Pill drops 20px when scrolled (`resizable-navbar.tsx:160`) — fine.

**Hierarchy.** Logo left / two CTAs right, no dead links, hamburger <1024. Clean.

**Component coherence.** The ghost checker capsule restyles the trigger via arbitrary-variant selectors from the wrapper (`nav.tsx:48-49`) — a hacky but working pattern; the *same* capsule look is duplicated for mobile (`:141`). If the checker's internal markup changes, this silently breaks.

**Responsive — measured bugs.**
- Scrolled desktop pill is **800px wide at every ≥1024 viewport**, not the documented "40%" (`resizable-navbar.tsx:159` animates `width:"40%"` but `style={{minWidth:"800px"}}` at `:168` wins). At 1440 that's 56% of the screen; at 1024 it's **78%** — a near-full-width "pill".
- Mobile scrolled state animates `borderRadius` from `2rem` → **`4px`** (`resizable-navbar.tsx:224`) — a nearly square 90%-width bar, the opposite of the pill language. Confirmed live at 320: radius 3.99px, width 288px.
- Mobile menu at 320: 288px wide, `rounded-lg` (8px), white, both CTAs full-width — usable ✓.

**Copy risks.** "Start pilot" / "Check serviceability" both terminate in real flows ✓.

**Verdict: OK → WEAK at 1024–1100 widths.** Highest-impact fix: delete the `minWidth: 800px` (or make it responsive, e.g. `minWidth: "min(800px, 92vw)"`) and change the scrolled mobile radius `4px` → `2rem`. (S)

---

## 2. Hero (square stage + lanes + Cover on H1)

**Design-system compliance.**
- Colors: `#FBFCF8` base, eyebrow `#9A3412` ✓, ink H1 ✓, lane box white ✓, stage white with orange spotlight ✓. **Off-palette:** aurora teal blob `rgba(64,190,180,.25)` (`hero.module.css:47`) — frozen benchmark chrome, but it is the only teal/cyan hue on the page and the design system says orange-only accents; chip spec text `#B9B9BF`, stagebar labels `#9AA08E`, times `#B8BCB0` are greys outside the muted tokens (`#878B80`/`#8B8B90`).
- Orange beats: 55 in-section (eyebrow, blaze sweep, 4 Cover corner dots, 3 pillar squares, "80%", lane-head square, lane header col 3, ~12 orange `new` cells + 8 fast dots + row tints, chip CAT, blink/node/stamp). Benchmark-frozen by founder order — but far past the B2 ≤3 rule; exempt explicitly in the gate or treat as a known deviation.
- Fonts: Space Grotesk H1 + stamp ✓, JetBrains Mono eyebrow/chip/lanes/ticker ✓, body text inherits the **system-font bug (§0.1)**.
- Grain ✓ (only place on page), hairline ✓, radius: stage 22px, lane box 12px, chip 12px, stamp 8px — three different card radii in one section (acceptable hierarchy, but lane box 12 vs metrics 18 vs gap 18 vs stage 22 is not a system).
- Shadows: stage `0 30px 70px -40px` + lane box `0 18px 44px -32px` — heavy-on-light, correct per system ("no heavy shadows on dark" respected).

**Spacing.** Measured 1440: eyebrow 12.5px `#9A3412`, H1 68px/1.03, pillars 15px at `margin: 30px 0 14px` (30/14 off-rhythm), lane box flex-fills to meet the stage bottom exactly (delta 0px ✓). Stage 560×560 ✓ (rubric A6). Section padding `118px 0 26px`. Marquee seam 30px (§0.2).

**Hierarchy.** H1 68px > pillars 15px > lane table 12px — strong. Cover hover (ink fill + orange sparkles) is the only interactive flourish on the H1; beams run constantly under "heavy shipments" — subtle, not competing.

**Component coherence.** The Cover corner dots + pointer-pulse are Aceternity defaults tinted orange — they read as "tech library" chrome, more decorative than the rest of the page's dry mono instrumentation.

**Responsive.** 768: grid collapses, stage 560px centered, lane box 704px ✓ no overflow. 320: stage 256px, **chip↔stamp overlap 28.4px at rest, 64.1px during the delivered hold** (stamp is later in DOM, paints over the chip's right side; the founder has seen the mock accept this, but the live copy at hold state covers `FURNITURE / SECTIONAL SOFA` text). Stage text floor: status 8.5px, labels 7px, lanes 10px, lane header 8px — all pass contrast but are at the very bottom of legibility. **NEEDS-EYES:** stamp-over-chip at 320 hold frame.

**Copy risks.** H1 "India's first express layer for heavy shipments." is uplift §0 #1's banned claim — implemented per brief §2.1 option C ("founder sentence… guardrail-override recorded") and benchmark-identical. Lane header "Traditional Logistics" is the recorded founder override (freeze-log 2026-10-19). Both live by founder order; **re-confirm before release** — these are the page's two highest-visibility claim risks. Lane data itself is placeholder-schedule copy (real rows pending, `lib/dispatch-data.ts` unused on page).

**Verdict: STRONG (benchmark-faithful, measurement-clean) with two open founder decisions.** Highest-impact fix: resolve the 320 chip/stamp collision (e.g. shrink stamp type 11→10px at ≤480, or nudge chip left/top to 8px) — it is the only geometry that reads broken, even though it's founder-seen. (S · NEEDS-EYES)

---

## 3. Brands marquee (inside hero)

**Compliance.** Light variant of the marquee pattern: borders `rgba(12,14,9,.08)`, items Space Grotesk 600 15px with 8px orange spark separators ✓. **Off-palette:** item color `#9AA08E` (`customer-marquee.module.css:25`) — not a token, and ≈2.6:1 vs `#FBFCF8` (decorative/aria-hidden, so no a11y failure, but the four real brand names are the faintest text on the page). Orange beats: 8 spark SVGs.

**Spacing.** Padding 12px + margin-top 30px (off-rhythm, §0.2). Height 48.5px measured.

**Responsive.** 15px items + 26px paddings at 320 — fits, masked edges ✓. No overflow.

**Coherence.** Counter-rotating/accelerated accent line from uplift §1 (marquee polish) not present — both marquees are the plain frozen-v5 loop (26s, hover-pause, reduced-motion static via global kill-switch). Ecosystem marquee later uses the identical mechanism with different type — consistent ✓.

**Copy.** Ather · Wakefit · Ola Electric · Duroflex — real trademarks; founder-authorized and recorded (`customer-marquee.tsx:6-8`), but uplift §0's "only ship logos where a relationship is real" still stands as a launch decision.

**Verdict: OK.** Highest-impact fix: swap `#9AA08E` → muted token (`#6E7366` light-bg / `#8B8B90` dark) so the marquee reads as intentional typography rather than disabled text. (S)

---

## 4. MetricsBand

**Compliance.** White `#FFFFFF` section on `#FBFCF8` page (a 1-tone boundary, not a hue shift). Numbers Space Grotesk 42px ink ✓, unit `#C2410C` (4 orange beats), card labels Inter-semibold (→ system font bug). Cards: radius 18px, border `rgba(12,14,9,.06)`, hover lift -3px + shadow — the only hover-elevation cards on the page (Gap cards lift too; ✓ shared).

**Spacing.** `py-6` (24 ✓) but grid gap **22px** and card padding **30px/26px** — off-rhythm. At 768 the band is 2×2; at 320 1×4 with 22px gaps.

**Hierarchy.** Number 42px > label 13px — good. Numbers count up once in view; reduced-motion renders static ✓.

**Coherence.** Card radius 18px matches Gap (18) but not the hero lane box (12) or stage (22) — two "card languages" (boxy-12 vs soft-18) coexist.

**Copy — the biggest risk on the page below the fold.** Founder override restored benchmark copy verbatim (`metrics-band.tsx:6-11`): **"99.2% SLA adherence"** (uplift §0 #3: RISKY — publishable only with definition + methodology + money-back remedy; `lib/metrics-data.ts` documents the gated audited variant that is **not** wired) and **"1.4T CO₂ saved per lane"** (uplift §0 #4: UNSUPPORTED — real math is ~8.2 kg/shipment). "80% Lower emissions" and "24–48h" are safe. The overrides are recorded, but §0 calls these release blockers.

**Verdict: OK visually / RED on copy.** Highest-impact fix: wire card 2 to the founder-gated audited variant and replace 1.4T with the per-shipment stat before any launch — the band is the most quantitative surface and the most audit-exposed. (S–M · founder decision)

---

## 5. WhyNow (timeline)

**Compliance.** Dark `#08080A` ✓, tag orange mono ✓, H2 Space Grotesk white ✓, lede `#8B8B90` ✓, timeline spine orange→white gradient + 31px orange-ring nodes ✓, footnote `#B9B9BF` ✓. No grain, no hairline, no tint (§0.5). Orange beats: 9.

**Spacing (frozen-normalized ✓).** 64px paddings, tag→H2 24, H2→lede 24, lede→timeline 48, item gap 48, footnote +24, term-line **72px** before "▸ Until JOLT." (deliberate, reads as a beat). Matches freeze-log.

**Hierarchy.** Tag 11 > H2 44/30 > h3 22 > body 15 ✓. Left-aligned per founder decision; max-width 760/700 keeps measure tight ✓.

**Responsive.** 320: nodes 27px, spine indent 46px, h2 30px — no cramping ✓.

**Coherence.** Timeline node treatment (mono numeral in orange ring) is unique; Gap's ghost numbers echo it ✓. The spine-ignite micro-motion is parked (freeze-log) — currently static, which is fine.

**Copy.** Item 03 — *"The capacity always existed on the Indian rail network — the cleanest way to move weight across India. But it was a black box."* — is **duplicated nearly verbatim** by the How It Works lede (*"Indian rail was always the cleanest way to move weight. It was just an analog black box."*), one section apart (§7). Claim wording passes guardrails (3× rotation + footnote ✓).

**Verdict: STRONG.** Highest-impact fix: dedupe the black-box/cleanest-weight sentence against How It Works (keep it here, cut it there). (S · founder copy)

---

## 6. Gap (bento cards + pointer highlight + verdict)

**Compliance.** Light band **`#F4F2ED` — off the stated white family** (#FFFFFF/#F5F7F2/#FBFCF8): it is the page's only warm-stone background, sitting between two `#08080A` blocks. Tag `#6B6B66` (grey variant for light bg — consistent only with itself; hero's light-bg eyebrow uses orange-brown instead). Card 2 tint `#FAF8F4`, borders `#E4E0D6`, point markers 7px orange squares (4), verdict 28px italic SG. Orange beats: 6. **The section's `border-radius: 36px 36px 0 0` (`gap.module.css:10`) is invisible:** the page background behind the rounded corners is `#FBFCF8` ≈ the section's own `#F4F2ED`, so the "rounded panel lifting off" gesture never renders. Dead design gesture.

**Spacing (frozen-normalized ✓).** 64px, tag 24, lede 24, grid 48, cards gap 24 (20 ≤767), verdict 48. Card padding 40px (28/22 mobile) ✓.

**Hierarchy.** H2 44/30 with PointerHighlight draw-in on "never built for you." — measured box 381×49 @1440, 208×67 @320 (phrase wraps to 2 lines at 320; box + corner pointer still inside H2 area ✓). Verdict 28px italic vs card h3 23px ✓.

**Coherence.** Side badges "Hack 1/2" are 100px-radius mono pills — a third pill language (nav/CTA pills are full capsules). Ghost numerals 64px at 5% ink — echo Why Now numbering ✓. Hover lift -8px matches metrics' -3px direction but 2.7× the distance — two hover physics.

**Copy.** Lede uses an **unspaced em dash** ("workarounds—hacking", `gap.tsx:103`) while every other em dash on the page is spaced — typographic inconsistency. Verdict quote deepened to ~7:1 ✓.

**Verdict: OK.** Highest-impact fix: remove the invisible 36px top radius (or float the section with a visible dark backdrop so the rounding reads), and space the lede dash. (S)

---

## 7. HowItWorks (pipeline + 3 columns)

**Compliance.** Dark ✓, tag/H2/lede per system. Pipeline: 3px track `rgba(255,255,255,.08)` with orange shimmer fill + glowing dot + 3 stops — the page's second "progress" language after the hero journey bar (hero uses nodes+segments+ripples; here dot+track+stops — visually related ✓). No grain/hairline/tint (§0.5). Orange beats: 6.

**Spacing (not normalized).** tag→H2 **22**, lede **20**, pipeline +48, cols **40** (24 gap desktop / 36 stacked). All the 22/20/40 drift from §0.2 concentrates here.

**Hierarchy.** H2 44/30, col h3 20px, step labels 11px orange mono ✓.

**Responsive.** 320: pipeline full-width, cols stack with 36px gaps, no overflow ✓.

**Copy.** H2: *"…the fastest mid-mile network in India."* — an unaudited superlative; brief 06 calls it "scoped", but there is no footnote or basis on the page. Lede duplicates Why Now's black-box sentence (§5). Column 2 has **two doubled negatives** ("No multi-day consolidation waits. No waiting in truck hubs." — then "Zero mid-journey sorting delays.") — three negations in one column, rhythmically flat.

**Verdict: OK.** Highest-impact fix: normalize 22/20/40 → 24/24/48 and rewrite the lede's duplicated sentences (fold in the superlative basis or drop "fastest"). (S · founder copy)

---

## 8. Ecosystem

**Compliance.** Dark ✓, tag/H2/lede ✓. Two full-bleed bands:
- B2B band bg **`#0D0D10`** — a blue-grey tint off `#08080A` (measurably lighter, different hue axis).
- D2C band bg **`linear-gradient(140deg, #2E130A, #1A0C06)`** — a **warm brown gradient**, the only brown surface on the page; and its H3 "D2C Heavy Delivery" is set in **full `#E85A2C` orange at 42px (26px mobile)** — the single largest orange text on the entire page. This is the biggest off-palette decision outside the hero.
Hairline top borders on both bands ✓ (the only dark-section hairlines outside footer). No grain. Orange beats: 4 (but one is 42px).

**Spacing.** tag→H2 22, lede 20, band mt **44**, band padding 44/40, marquee mt **44** + 20px padding. Same un-normalized drift.

**Responsive.** Bands full-bleed at all widths ✓; bandInner 1fr/1.25fr ≥768, stacked at 320 with 18px gap ✓. Marquee masked edges ✓, 26s loop ✓.

**Coherence.** Marquee items `#8B8B90` 13px mono — matches the system's muted-dark token (unlike the hero marquee's `#9AA08E`). Audience-band pattern (side label + h3 + paragraph) is unique to this section ✓.

**Copy.** H2 *"We're already live where you are."* — pre-launch claim risk (JOLT is not yet live anywhere). B2B band: **"Guaranteed 24-48 hour arrivals"** uses a **hyphen** where the rest of the page uses en dash "24–48" (hero stamp, metrics). Marquee lists "REST APIs" and "Custom REST APIs" — near-duplicate items.

**Verdict: OK.** Highest-impact fix: restyle the D2C band to the dark-tint family (or a brown the founder explicitly blesses) and drop the orange H3 to white with an orange band-tag; swap the hyphen. (S–M · NEEDS-EYES for the brown)

---

## 9. CTA

**Compliance.** Dark ✓, centered tag/H2/lede, orange radial glow `.08`, primary orange pill + ghost pill ✓, fineprint with SLA link ✓ (real route). No grain/hairline/tint (§0.5). Orange beats: 2 — most disciplined section. `.cta .tag` CSS contains a duplicate `justify-content: center` declaration (`cta.module.css:41-42`) — harmless code smell.

**Spacing.** Padding **88px** mobile / **96px** desktop (96 = 4×24 ✓; 88 is off). tag 22, H2 mb 26, lede 22, btns 40, fineprint 26 — un-normalized drift.

**Hierarchy.** H2 **60px at 1440** (`clamp(32,4.6vw,60)`) — only 8px smaller than the hero H1 (68) and 16px bigger than every section H2 (44). It is the intended conversion climax, but it makes the CTA visually compete with the H1 as "loudest text on page". **NEEDS-EYES.**

**Responsive.** 320: H2 32px, buttons wrap, fineprint 11.5px — no overflow ✓.

**Copy.** "If we miss the guaranteed TAT, the shipment is free." + fineprint + SLA page = the §0 #3 money-back remedy pattern done right ✓.

**Verdict: STRONG.** Highest-impact fix: normalize paddings (88→96 or 96→88 symmetric) and the 22/26 margins to the rhythm; leave the H2 size to the founder's eye. (S)

---

## 10. Footer

**Compliance.** Dark ✓, Space Grotesk logo with orange italic "Deliveries" ✓, mono column headers ✓, hairline top border on the copyright bar ✓. Link color `#B9B9BF` ✓. Orange beats: 1. No grain/tint.

**Spacing.** 72/28 padding, 48 grid gap, bar mt 56 (off-rhythm) + 26pt. Mobile gutter 24px vs 32/56 elsewhere (§0.3).

**Hierarchy.** Logo 22 > tagline 14 > links 14 > legal 12 ✓.

**Responsive.** 320: two-column link grid (Product 4 + Company 1 in row 1; Legal 4 below) — the lone "Contact" sits in a column of one, looking abandoned; fine at ≥768 (3 cols).

**Coherence.** Support line renders "+91 80194 61199" (5+5 grouping ✓). No dead anchors (AGENTS convention respected ✓).

**Copy.** Tagline uses the §0 #1 allowed replacement ✓ ("rail-first express network for 200kg+ B2B"). "Pricing" link → `#cta` where no pricing exists — label/landing mismatch.

**Verdict: OK.** Highest-impact fix: at ≤767 make the link grid 1 column (or merge Company under Product) so Contact isn't orphaned, and point "Pricing" at the checker/pilot instead. (S)

---

## 11. Top 10 site-wide improvements

| # | What | Why | Where | Effort | Founder eyes? |
|---|---|---|---|---|---|
| 1 | **Fix the Inter bug** — move `inter.variable` to `<html>` (or hardcode the stack in `@theme`) | All body copy ships in system font; Inter downloads but never applies (§0.1). Biggest visual shift on Windows/Android | `layout.tsx:46`, `globals.css:16-18` | S | No (computed-style verifiable) |
| 2 | **Normalize the 24px rhythm** — 22→24, 20→24, 40→48, 44→48, 30→24/48, 26→24, metrics 22→24 | Freeze-log set the standard; 4 sections + 2 seams drift (§0.2) | how/eco/cta/metrics/marquee CSS + `metrics-band.tsx:126` | S | No |
| 3 | **Fix the scrolled nav pill** — remove `minWidth: 800px`; mobile scrolled radius `4px` → `2rem` | Pill is 78% of viewport at 1024; mobile "pill" is nearly square | `resizable-navbar.tsx:168,224` | S | Light (glass feel) |
| 4 | **Resolve 320 chip/stamp collision** (shrink stamp type or inset chip at ≤480) | 28px overlap at rest, 64px at hold; stamp covers chip copy | `hero.module.css:491-544, 748-797` | S | **Yes** |
| 5 | **Apply the dark-section pattern to why/how/cta/footer** — grain + hairline + tint | Spec says hero + dark get grain; only hero & eco partially comply (§0.5); also separates the 3 consecutive dark blocks | why/how/cta/footer CSS | M | **Yes** (grain subtlety is visual) |
| 6 | **Dedupe the narrative copy** — remove "cleanest way… black box" from How lede; space Gap's unspaced em dash | Near-verbatim duplication one section apart | `how-it-works.tsx:93-95`, `gap.tsx:103` | S | **Yes** (copy) |
| 7 | **Re-confirm the recorded claim overrides** — 99.2%, 1.4T, H1 "first express layer", "Traditional Logistics", "already live where you are", "fastest mid-mile" | All violate uplift §0 as written; founder overrides are recorded but §0 calls them release blockers | `metrics-band.tsx:75-112`, `hero.tsx:625,678`, `ecosystem.tsx:65`, `how-it-works.tsx:82-83` | S–M | **Yes** (founder decision) |
| 8 | **Delete the invisible Gap top radius** (36px) or float the section so it reads | Rounded corners render against a same-tone background — a gesture nobody can see | `gap.module.css:10` | S | No |
| 9 | **Rebalance Ecosystem D2C band** — brown gradient + 42px orange H3 off-palette; unify "24-48" en dash; dedupe marquee items | Only brown surface + largest orange text on page | `ecosystem.module.css:62-63,88-90`, `ecosystem.tsx:95,33` | S–M | **Yes** (the brown) |
| 10 | **Unify containers/gutters** — 1220 vs 1140 vs 900 vs 1240; mobile gutters 24/32/56 | Left spine zig-zags 40px desktop / 24px mobile between sections | `hero.module.css:17-20`, `*.module.css` wraps, `footer.module.css:9` | S–M | No |

## 12. NEEDS-EYES list (founder visual pass)

1. Hero stamp slam + 2.4s hold "feel" (rubric B5) — timing verified 0ms delta, feel is visual.
2. 320 hold frame: stamp covering chip copy (§2).
3. Grain/spotlight subtlety on the stage (rubric B6) and whether dark sections need it (§0.5).
4. CTA H2 at 60px vs hero H1 68px — climax or competition (§9).
5. Ecosystem D2C brown gradient + orange H3 (§8).
6. Hero orange density (55 beats) vs rubric B2 ≤3 — confirm the benchmark exemption (§0.4).
7. Customer marquee legibility in `#9AA08E` (§3).
8. Stage micro-type (7–8.5px labels/status, 8–10px lane table) on a real 320px device.
9. Verdict quote italics + Gap card hover lift -8px vs metrics -3px.
10. Overall color grading: aurora teal, `#F4F2ED` stone band, `#0D0D10` band tint against the white/dark binary.

## 13. Per-section verdicts

| Section | Verdict | Single highest-impact fix |
|---|---|---|
| Nav | OK → **WEAK** 1024–1100 | Pill min-width 800px + mobile scrolled radius 4px |
| Hero | **STRONG** | 320 chip/stamp collision (S · eyes) |
| Brands marquee | OK | Item color `#9AA08E` → muted token |
| MetricsBand | OK (RED on copy) | Wire audited SLA variant; kill 1.4T (S–M · founder) |
| WhyNow | **STRONG** | Dedupe black-box sentence with How |
| Gap | OK | Remove invisible 36px radius; space the dash |
| HowItWorks | OK | 22/20/40 → 24/24/48 + lede rewrite |
| Ecosystem | OK | D2C band off-palette + orange H3 (S–M · eyes) |
| CTA | **STRONG** | 88/96 + 22/26 rhythm normalization |
| Footer | OK | Orphan "Contact" column at 320; "Pricing" label |

**Bottom line:** the page is measurement-clean (all script gates green) and the frozen units are faithful. The aesthetic debt is concentrated in three places: the **Inter font bug** (every word of body copy), the **half-applied 24px rhythm** (4 sections drift), and the **nav pill geometry**. Fixing those three is ~1 small session and would lift the whole page more than any single section redesign.
