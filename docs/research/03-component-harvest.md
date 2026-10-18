# 03 — Component Harvest

Research date: 2026-10-17. All URLs and license facts verified via live fetch unless marked ⚠️ (unverified).
Stack target: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4, framer-motion (a.k.a. `motion`).

## Executive brief

- **shadcn/ui is the backbone**: full React 19 + Tailwind v4 support in the `latest` release (`@theme inline`, OKLCH, no forwardRefs, `data-slot`). MIT, copy-paste — code becomes yours. Verified: https://ui.shadcn.com/docs/react-19, https://v3.shadcn.com/docs/tailwind-v4
- **Animation layer: Magic UI (MIT) + Motion-Primitives (MIT, beta) + Aceternity (free tier)** all cover ~90% of JOLT's motion needs. Magic UI confirmed Tailwind v4 support (https://v3.magicui.design/docs/tailwind-v4); Motion-Primitives confirmed v4 via official X announcement (Jan 2025) and its CLI (`npx motion-primitives@latest add <x>`).
- **Marquee**: `react-fast-marquee` (MIT, 518k weekly downloads, CSS-animation driven — silky, no JS loops). Peer range `react >=16.8.0` satisfies React 19. Last publish 2024 — stable, effectively done.
- **Count-up**: Magic UI `Number Ticker`, Motion-Primitives `Animated Number`, or `react-countup` (MIT, peer `>=16.3`).
- **Terminal modal**: Magic UI has a `Terminal` component; Cult UI has `Terminal Animation`; shadcn `Dialog` + Magic UI `Typing Animation` for the typewriter. Typewriter alt: `react-simple-typewriter` (MIT).
- **Do NOT buy Tailwind UI now**: Tailwind Labs announced joining Shopify (Sep 9, 2026) and is closing sign-ups for new Tailwind Plus customers (verified via ReUI facts-checked comparison page, Sep 27 2026; verify independently). Tailwind CSS itself stays MIT. Use free shadcn-block ecosystems (shadcnblocks.com, shadcn-ui-blocks.com) instead.
- **GSAP is now 100% free** (incl. SplitText/MorphSVG/ScrollTrigger) under Webflow's Standard "No Charge" license — commercial OK, but it is NOT OSI open source (custom license). Fine to use; we still default to framer-motion/motion for consistency. Verified: https://gsap.com/community/standard-license/
- **Everything animated needs `'use client'`**: RSC strategy = server components render data/layout, pass props into small client islands (marquees, counters, reveal wrappers). shadcn primitives are RSC-safe (no hooks in primitives); framer-motion/motion, Magic UI, Aceternity, motion-primitives components are all client.
- **framer-motion rebranded to `motion`**: install `motion`, import from `motion/react`. Both names resolve to the same MIT package; docs at motion.dev.
- **Map layer**: react-map-gl (MIT) + MapLibre (BSD-3) + free/open styles (Protomaps/demo tiles) = $0. Mapbox GL JS with token = 50k free map loads/month (web). Deck.gl (MIT) for animated lane arcs. react-leaflet is now Hippocratic License 2.1 — NOT MIT/OSI, avoid.
- **Licensing traps found**: Cult UI core repo is MIT but components have been migrating to Pro (paid); Aceternity free tier has no single public repo (org `github.com/aceternity` — code is copy-paste from site, widely treated as MIT/free-for-commercial; Pro uses the restrictive "Aceternity License"); 21st.dev components carry per-item licenses (free + paid mixed).

## Section-by-section catalog

### 1. Nav with scroll state
- **Aceternity `navbar-menu`** — https://ui.aceternity.com/components/navbar-menu — Aceternity UI free tier. framer-motion based, Framer-tagline vibe. License: free/MIT-style (no public monorepo; commercial use allowed per site). Client component. Tailwind v4: yes (uses standard utilities + CSS vars). Effort: Low.
- **Auto-hiding sticky nav recipe** (useScroll + sticky) — https://www.frontend.fyi/recipes/framer-motion/auto-hiding-sticky-navigation — free recipe code (Frontend.FYI, MIT). Effort: Low.
- **shadcn `navigation-menu` + `sheet` mobile drawer** — https://ui.shadcn.com/docs/components/navigation-menu — MIT, Tailwind v4 + R19 official. Add motion `useScroll` for background/backdrop-blur swap. Effort: Low-Medium.

### 2. Hero with animated dispatch board (SVG clock + cycling images + stamp slam)
- **Custom SVG clock face**: framer-motion SVG `pathLength` draw + `rotate` tick; docs: https://motion.dev/docs/react-scroll-animations and https://motion.dev/docs/react-svg (scroll/SVG guides). Zero deps, full control — recommended for the dispatch aesthetic. Effort: High (custom orchestration).
- **Cycling product images**: Aceternity `images-slider` — https://ui.aceternity.com/components/images-slider — or Motion-Primitives `Carousel` — https://motion-primitives.com/docs/carousel — or plain `AnimatePresence` crossfade (motion.dev/docs/animate-presence). Effort: Low.
- **Rotating status text**: Aceternity `flip-words` — https://ui.aceternity.com/components/flip-words — or Magic UI `Word Rotate` — https://magicui.design/docs/components/word-rotate. Effort: Low.
- **Radar/dispatch lines**: Magic UI `Animated Beam` — https://magicui.design/docs/components/animated-beam (MIT). Effort: Low.
- **Stamp slam**: custom keyframes (scale 3→1, rotate -12°→0, spring `{type:'spring', stiffness:400, damping:12}`) — motion.dev/docs/animate. No library ships this exactly.
- **Background option**: Aceternity `hero-parallax` — https://ui.aceternity.com/components/hero-parallax. Effort: Medium.

### 3. Live-lanes comparison table (scrolling/marquee rows, strikethrough old TAT vs highlighted new)
- **shadcn `Table`** — https://ui.shadcn.com/docs/components/table — MIT, R19 + TWv4 official, RSC-safe primitive. Base for the lanes grid. Effort: Low.
- **react-fast-marquee** (marquee the rows on mobile / scroll the lane feed) — https://www.npmjs.com/package/react-fast-marquee — MIT, `react >=16.8.0` peer (satisfies R19), pause-on-hover built in. Effort: Low.
- **Magic UI `Marquee`** — https://magicui.design/docs/components/marquee — MIT, motion-based alternative. Effort: Low.
- Strikethrough vs highlight: custom — `line-through` + muted old TAT, emerald `badge`/`animate-pulse` new TAT (shadcn Badge: https://ui.shadcn.com/docs/components/badge). Motion: stagger row reveal via Magic UI `Animated List` — https://magicui.design/docs/components/animated-list. Effort: Low.

### 4. Customer logo marquee
- **react-fast-marquee** — https://www.npmjs.com/package/react-fast-marquee — MIT. Primary. Effort: Low.
- **Magic UI `Marquee`** — https://magicui.design/docs/components/marquee — MIT. Effort: Low.
- **Aceternity Logo Cloud Marquee block** — https://ui.aceternity.com/blocks/logo-clouds/logo-cloud-marquee — free block, copy-paste. Effort: Low.
- Motion-Primitives `Infinite Slider` — https://motion-primitives.com/docs/infinite-slider — MIT, beta. Effort: Low.

### 5. Animated count-up metrics
- **Magic UI `Number Ticker`** — https://magicui.design/docs/components/number-ticker — MIT, motion useInView-triggered. Effort: Low.
- **Motion-Primitives `Animated Number`** — https://motion-primitives.com/docs/animated-number — MIT, beta. Effort: Low.
- **react-countup** — https://www.npmjs.com/package/react-countup — MIT, `react >=16.3.0` peer, 622k weekly downloads, last update Nov 2024. Effort: Low.

### 6. "Why Now" timeline
- **Aceternity `Timeline`** — https://ui.aceternity.com/components/timeline — scroll-linked animated timeline (framer-motion). Free tier. Effort: Medium.
- **Magic UI `Timeline`** — https://magicui.design/docs/components/timeline — MIT. Effort: Medium.
- **Origin UI timeline category** — https://originui.com + repo https://github.com/shadcn/originui (MIT, now maintained under shadcn org). Also mirrored on registry.directory. Effort: Medium.

### 7. Two-card comparison ("workaround" cards)
- **shadcn `Card`** base + custom vs-layout — https://ui.shadcn.com/docs/components/card — MIT. Effort: Low.
- Hover flair: Magic UI `Magic Card` — https://magicui.design/docs/components/magic-card — or `Neon Gradient Card` — https://magicui.design/docs/components/neon-gradient-card (MIT). Effort: Low.
- **Aceternity `Bento Grid` / `3d-card`** — https://ui.aceternity.com/components/bento-grid — if we want a bento pairing. Effort: Medium.
- 21st.dev comparison sliders — https://21st.dev/community/components/s/shadcn (search "compare"; per-item licenses, free MIT items exist). Cult UI Pro `Comparison` — https://pro.cult-ui.com/docs/comparison (paid). Effort: Low.

### 8. 3-step pipeline with animated progress fill
- **shadcn Stepper components** — https://www.shadcnblocks.com/components/stepper — free (MIT), shadcn-style, product-wizard + horizontal variants. Effort: Low.
- **Progress-fill on scroll**: motion `useScroll` + `scaleX` fill bar — https://motion.dev/docs/react-scroll-animations — zero-dep, exact behavior needed. Effort: Medium.
- GSAP `ScrollTrigger` scrub alternative — https://gsap.com/docs/v3/Plugins/ScrollTrigger — free under Standard No-Charge license (not OSI). Effort: Medium.

### 9. B2B / D2C full-width bands
- **shadcnblocks feature/marketing sections** — https://www.shadcnblocks.com/blocks — free MIT blocks (feature, banner, gallery categories). Effort: Medium.
- **Aceternity backgrounds**: `background-beams` — https://ui.aceternity.com/components/background-beams — `spotlight` — https://ui.aceternity.com/components/spotlight — `grid` patterns: Magic UI `Animated Grid Pattern` — https://magicui.design/docs/components/animated-grid-pattern. Effort: Low.
- Tailwind Plus marketing sections — https://tailwindcss.com/plus/ui-blocks/marketing — PAID, and new sign-ups closing (see exec brief). Use only as design reference. Effort: N/A.

### 10. Integrations marquee
- Same core as §4 (react-fast-marquee / Magic UI Marquee).
- **Magic UI `Icon Cloud`** (orbiting icons centerpiece) — https://magicui.design/docs/components/icon-cloud — MIT. Effort: Low.
- Aceternity Logo Cloud blocks — https://ui.aceternity.com/blocks/logo-clouds — free. Effort: Low.

### 11. Dark CTA with underline-sweep headline
- **tailwindcss-animated plugin** — https://github.com/new-data-services/tailwindcss-animated — MIT; Tailwind v4 usage confirmed in README: `@import "tailwindcss-animated";` in CSS (no JS config needed). Provides underline/fade/slide utilities. Effort: Low.
- Zero-dep CSS trick: span with `background-image: linear-gradient(currentColor,currentColor); background-size: 0% 2px; hover:100%; background-repeat:no-repeat; transition: background-size .3s` — recommended regardless. Effort: Low.
- Magic UI `Text Reveal` / `Word Rotate` for headline flourish — https://magicui.design/docs/components/text-reveal. Effort: Low.

### 12. Footer
- **shadcnblocks footer blocks (44+)** — https://www.shadcnblocks.com/blocks/footer — free MIT, shadcn-compatible. Effort: Low.
- Official shadcn blocks library — https://ui.shadcn.com/blocks — includes dashboard/nav/footer-style blocks, MIT, `npx shadcn add block-name`. Effort: Low.

### 13. Terminal-style modal with typewriter + email form
- **Magic UI `Terminal`** — https://magicui.design/docs/components/terminal — MIT. Effort: Low.
- **Cult UI `Terminal Animation`** — https://www.cult-ui.com/docs/components/terminal-animation — core repo MIT (https://github.com/nolly-studio/cult-ui, LICENSE MIT verified; ⚠️ some components moved to Pro — check per component). Effort: Low.
- **shadcn `Dialog`** — https://ui.shadcn.com/docs/components/dialog — MIT, RSC-safe primitives, controlled client wrapper. Form: shadcn `Input` + `Form` (react-hook-form+zod optional). Effort: Medium.
- Typewriter text: **Magic UI `Typing Animation`** — https://magicui.design/docs/components/typing-animation — MIT. Alts: `react-simple-typewriter` (https://www.npmjs.com/package/react-simple-typewriter), `react-typed` (https://www.npmjs.com/package/react-typed) — both MIT. Effort: Low.
- Full marketing block (reference): https://www.shadcn-ui-blocks.com/blocks/react/marketing/feature-sections/terminal — free. Effort: Low.

### 14. Scroll-reveal on everything
- **Motion-Primitives `In View`** — https://motion-primitives.com/docs/in-view — MIT, wraps children, fires on enter (the `motion/react` `useInView` pattern). Effort: Low.
- **Magic UI**: `Blur Fade` — https://magicui.design/docs/components/blur-fade — `Fade Text` — https://magicui.design/docs/components/fade-text — `Scroll Based Velocity` — https://magicui.design/docs/components/scroll-based-velocity — MIT. Effort: Low.
- Bare motion `whileInView` (global `<Reveal>` util component) — https://motion.dev/docs/react-scroll-animations — zero extra dep. Recommended default. Effort: Low.
- GSAP ScrollTrigger.batch as alternative — free, not OSI. Effort: Medium.

## Map / tracking UI options

| Option | URL | License | Cost | Notes |
|---|---|---|---|---|
| react-map-gl | https://visgl.github.io/react-map-gl | MIT (https://github.com/visgl/react-map-gl) | free lib | Renders Mapbox GL JS (token + billing) or MapLibre (free). R19 support in v8. Client-only. |
| @vis.gl/react-maplibre | https://www.npmjs.com/package/@vis.gl/react-maplibre | MIT (npm verified) | free | React bindings for MapLibre GL JS. Same vis.gl API family. |
| maplibre-gl | https://www.npmjs.com/package/maplibre-gl | BSD-3-Clause | free | Free vector styles: Protomaps, demotiles; self-hostable. |
| deck.gl | https://deck.gl | MIT | free | Arc/GreatCircle/Icon layers → animated lane-tracking overlay on react-map-gl base map. |
| Mapbox GL JS | https://docs.mapbox.com/mapbox-gl-js/ | v2+ proprietary Mapbox terms (v1 BSD-3) | **Free tier 50,000 map loads/month (web)** + 100k geocoding + 100k directions (verified Jun 2026, https://agentdeals.dev/vendor/mapbox; cross-check https://www.mapbox.com/pricing/#maps) | Token required; overages billed per map load. |
| MapTiler Cloud | https://www.maptiler.com/cloud/pricing/ | proprietary | Free tier $0 (non-commercial only, logo watermark); Flex $30/mo commercial | Works with maplibre-gl. |
| react-leaflet | https://github.com/PaulLeCam/react-leaflet | **Hippocratic License 2.1** (LICENSE.md verified) | free | NOT OSI/MIT — avoid unless human-rights-clause license is acceptable. Leaflet core is BSD-2. |
| Static SVG route map | — | — | $0 | For the hero dispatch board: stylized India route polyline, zero API calls, matches brand. |

Recommendation: **react-map-gl or @vis.gl/react-maplibre + maplibre-gl with a free/open style** for a live-tracking dashboard section; static SVG map in hero. Mapbox only if we need its specific styles/routing and stay under 50k loads/mo.

## Licensing & maintenance risk notes

- **shadcn/ui**: MIT; code copied into repo → zero runtime dependency risk. Best default for primitives.
- **Magic UI**: core MIT (GitHub verified); free components are MIT; separate Pro tier (~$199 lifetime per magicui.net/pricing). Tailwind v4 + Next.js 15 docs exist (v3.magicui.design).
- **Motion-Primitives**: MIT (GitHub verified) but **beta** — expect breaking component updates. Pro tier separate (pro.motion-primitives.com).
- **Aceternity UI**: free components copy-paste, commercial use permitted, widely treated as MIT, but ⚠️ no consolidated public repo (org: https://github.com/aceternity) — snapshot code into our repo. Pro items use the restrictive "Aceternity License" (no redistribution as template/kit) — https://ui.aceternity.com/licence.
- **Cult UI**: core repo MIT (LICENSE.md verified, nolly-studio/cult-ui); Pro tier paid (pro.cult-ui.com); third-party report of components shifting to Pro — verify each component before copying (https://note.com/ai_driven/n/n8166a3e69b6e).
- **Kokonut UI**: MIT (https://github.com/kokonut-labs/kokonutui, LICENSE verified). Component: Card Stack — https://kokonutui.com/docs/cards/card-stack. Mostly CSS/custom-styled — heavier adaptation to TWv4.
- **Origin UI**: MIT, now under shadcn org (https://github.com/shadcn/originui) — installable via registry. Good timeline/marquee/banner/table categories.
- **Sailboat UI**: 150+ components, "open-source" per README (https://github.com/sailboatui/sailboatui); ⚠️ license file not verified — check LICENSE before copying. Hugo-based site, HTML-first components (more porting work).
- **21st.dev**: marketplace, NOT a uniform license — each component free/paid individually; good for discovery, copy the free MIT ones.
- **Tailwind UI/Plus**: proprietary; $299-lifetime historically; **new sign-ups closing post-Shopify acquisition (Sep 2026)** — do not plan a purchase. (https://tailwindcss.com/plus, https://reui.io/alternatives/tailwind-plus)
- **GSAP**: free "Standard No Charge" license incl. all former Club plugins (https://gsap.com/licensing/); not OSI; fine to use, but keep framer-motion as the primary animation stack for consistency.
- **react-fast-marquee**: MIT; dormant-but-stable (last publish Jul 2024); pure CSS animation → no perf risk; if it breaks, Magic UI Marquee is a 10-minute swap.
- **framer-motion → motion**: use `motion` package (`motion/react`); v12 supports React 19. All `motion` components are client-only.
- **RSC rule of thumb**: only shadcn primitives + our own server components render on the server; everything animated is a `'use client'` island fed by server-fetched data props.
- **Tailwind v4 compat**: verified = shadcn/ui, Magic UI, tailwindcss-animated, motion-primitives (official statements). ⚠️ Unverified-but-expected = Aceternity (uses standard utilities + CSS vars; some components use old `tw-` prefix classes — check each), Cult UI, Kokonut (custom CSS, needs manual port), 21st.dev items (per-item).
- **React 19 peer-dep check**: shadcn (official R19), Magic UI (R19 docs), motion v12 (R19), react-fast-marquee (`>=16.8.0` — installs clean), react-countup (`>=16.3.0` — installs clean), embla (framework-agnostic core, react wrapper peer `>=16.8`). Run `npm info <pkg> peerDependencies` before adding anything new.

## Raw links log

- https://ui.shadcn.com/docs/react-19 (R19 support)
- https://v3.shadcn.com/docs/tailwind-v4 (TWv4 support)
- https://ui.shadcn.com/blocks (official blocks library)
- https://ui.shadcn.com/docs/components/table | /card | /badge | /dialog | /navigation-menu
- https://ui.aceternity.com/components (index) | /navbar-menu | /flip-words | /images-slider | /hero-parallax | /timeline | /bento-grid | /background-beams | /spotlight
- https://ui.aceternity.com/blocks/logo-clouds/logo-cloud-marquee | https://ui.aceternity.com/blocks/logo-clouds
- https://ui.aceternity.com/licence (Pro license terms)
- https://magicui.design/docs/components (full index — verified: Marquee, Number Ticker, Typing Animation, Terminal, Animated Beam, Word Rotate, Magic Card, Icon Cloud, Blur Fade, Fade Text, Text Reveal, Animated List, Neon Gradient Card, Scroll Based Velocity, Scroll Progress)
- https://v3.magicui.design/docs/tailwind-v4 | https://github.com/magicuidesign/magicui (MIT) | https://magicui.net/pricing/
- https://motion-primitives.com/docs (index) | /carousel | /in-view | /animated-number | /infinite-slider | /text-effect | /installation
- https://github.com/ibelick/motion-primitives (MIT, beta) | https://pro.motion-primitives.com/docs
- https://motion.dev/examples | https://motion.dev/docs/react-scroll-animations | https://motion.dev/docs/animate-presence
- https://www.npmjs.com/package/react-fast-marquee (MIT) | https://www.npmjs.com/package/react-countup (MIT) | https://www.npmjs.com/package/embla-carousel-react (MIT, v8.6.0)
- https://www.embla-carousel.com/docs/v8/get-started/react
- https://www.cult-ui.com/docs/components/terminal-animation | /feature-carousel | /halo-progress | https://github.com/nolly-studio/cult-ui (MIT) | https://pro.cult-ui.com/docs/comparison (paid)
- https://github.com/shadcn/originui (MIT) | https://originui.com
- https://github.com/kokonut-labs/kokonutui (MIT) | https://kokonutui.com/docs/cards/card-stack
- https://github.com/sailboatui/sailboatui (license unverified) | https://sailboatui.com/docs/components/card/
- https://21st.dev/community/components/s/shadcn | https://21st.dev/@ibelick/library/motion-primitives | https://21st.dev/@cult-ui/library/cult-ui
- https://www.shadcnblocks.com/blocks/footer | https://www.shadcnblocks.com/components/stepper | https://www.shadcn-ui-blocks.com/blocks/react/marketing/feature-sections/terminal
- https://tailwindcss.com/plus (paid; sign-ups closing) | https://tailwindcss.com/plus/ui-blocks/marketing/elements/flyout-menus
- https://reui.io/alternatives/tailwind-plus (Shopify acquisition fact-check)
- https://github.com/new-data-services/tailwindcss-animated (MIT, TWv4 via @import) | https://tailwindcss-animated.com
- https://gsap.com/licensing/ | https://gsap.com/community/standard-license/ | https://gsap.com/docs/v3/Plugins/ScrollTrigger | https://webflow.com/blog/gsap-becomes-free
- https://github.com/greensock/gsap
- https://visgl.github.io/react-map-gl | https://github.com/visgl/react-map-gl (MIT) | https://www.npmjs.com/package/@vis.gl/react-maplibre (MIT) | https://www.npmjs.com/package/maplibre-gl (BSD-3) | https://deck.gl (MIT)
- https://github.com/PaulLeCam/react-leaflet (Hippocratic License 2.1) | https://github.com/PaulLeCam/react-leaflet/blob/master/LICENSE.md
- https://www.mapbox.com/pricing | https://docs.mapbox.com/accounts/guides/pricing/ | https://agentdeals.dev/vendor/mapbox (free-tier verified Jun 2026)
- https://www.maptiler.com/cloud/pricing/ (Free $0 non-commercial; Flex $30/mo)
- https://www.frontend.fyi/recipes/framer-motion/auto-hiding-sticky-navigation
- https://www.npmjs.com/package/react-simple-typewriter | https://www.npmjs.com/package/react-typed
- Logistics-flavored reference kits (paid, design reference only): https://www.lightswind.com/blocks/logistics-pro | https://tailadmin.com/blog/logistics-dashboard-templates
