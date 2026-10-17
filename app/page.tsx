/* ============================================================================
   JOLT — HERO (reference replication)
   Exact port of the reference HTML: spacing, typography, colors, borders and
   the staggered load animation (300ms ease-out / 80ms stagger / 20px rise).
   Fonts: Inter + JetBrains Mono via next/font/google (layout.tsx).
   Copy is frozen. No external component or animation libraries.
   ========================================================================== */

import { MetricsBand } from "@/components/sections/metrics-band";

export default function Home() {
  return (
    <>
      {/* ===================== NAV ===================== */}
      <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-white/10 bg-black/80 px-10 py-4 backdrop-blur-[12px] max-md:px-5 max-md:py-[14px]">
        <div className="text-[18px] font-bold tracking-[-0.02em]">
          JOLT
          <span className="ml-[6px] text-[12px] font-normal text-zinc-500">
            [by ONDL]
          </span>
        </div>

        <div className="hidden gap-9 md:flex">
          <a
            href="#engine"
            className="text-[14px] text-zinc-400 transition-colors duration-200 ease-out hover:text-white"
          >
            The Engine
          </a>
          <a
            href="#stack"
            className="text-[14px] text-zinc-400 transition-colors duration-200 ease-out hover:text-white"
          >
            The Stack
          </a>
          <a
            href="#corridors"
            className="text-[14px] text-zinc-400 transition-colors duration-200 ease-out hover:text-white"
          >
            Corridors
          </a>
          <a
            href="#integrations"
            className="text-[14px] text-zinc-400 transition-colors duration-200 ease-out hover:text-white"
          >
            Integrations
          </a>
        </div>

        <div className="flex items-center gap-6">
          <a
            href="#login"
            className="text-[14px] text-zinc-400 transition-colors duration-200 ease-out hover:text-white"
          >
            Login
          </a>
          <button className="cursor-pointer rounded-[6px] bg-white px-[18px] py-[10px] text-[14px] font-medium text-black transition-colors duration-200 ease-out hover:bg-zinc-200">
            Start a Pilot
          </button>
        </div>
      </nav>

      {/* ===================== HERO ===================== */}
      <section className="mx-auto max-w-[1280px] px-10 pb-24 pt-32 max-md:px-5 max-md:pb-16 max-md:pt-20">
        <p className="reveal d1 font-mono text-[12px] uppercase tracking-[0.2em] text-zinc-500">
          A Purpose-Built, Dedicated Network for Heavy Shipments
        </p>

        <h1 className="reveal d2 mt-[28px] text-[clamp(40px,6vw,76px)] font-semibold leading-[1.05] tracking-[-0.03em]">
          India&apos;s Express Layer for Heavy Commerce.
          <em className="block font-semibold italic text-zinc-400">
            Finally, an express layer that doesn&apos;t crawl.
          </em>
        </h1>

        <p className="reveal d3 mt-8 max-w-[640px] text-[19px] leading-[1.7] text-zinc-400">
          JOLT moves your shipments directly from your dock to the end
          customer. No hub routing. No sorting yards. No waiting for trucks
          to fill. Just-in-time execution, powered by the Next Train Out.
        </p>

        <button className="reveal d4 mt-10 cursor-pointer rounded-[6px] bg-white px-[28px] py-[14px] text-[15px] font-medium text-black transition-colors duration-200 ease-out hover:bg-zinc-200">
          Start a Pilot
        </button>

        <p className="reveal d5 mt-5 max-w-[560px] text-[12px] leading-[1.6] text-zinc-600">
          *Guaranteed SLAs: Next-Day short lanes (&lt;300km) · 1–2 days medium
          (300–900km) · Day-3 long (&gt;900km). Many corridors run faster than
          guarantee.
        </p>
      </section>

      {/* ===================== PROOF STRIP ===================== */}
      <section className="reveal d6 border-t border-white/10">
        <div className="mx-auto grid max-w-[1280px] grid-cols-2 md:grid-cols-4">
          <div className="border-l border-white/10 px-7 py-8 first:border-l-0 first:pl-10 last:pr-10 max-md:px-5 max-md:py-6 max-md:first:pl-5 max-md:odd:border-l-0">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-500">
              Mechanism
            </p>
            <p className="mt-[10px] text-[15px] font-medium leading-[1.4] text-white">
              Next Train Out (NTO)
            </p>
          </div>
          <div className="border-l border-white/10 px-7 py-8 first:border-l-0 first:pl-10 last:pr-10 max-md:px-5 max-md:py-6 max-md:first:pl-5 max-md:odd:border-l-0">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-500">
              Payload Class
            </p>
            <p className="mt-[10px] text-[15px] font-medium leading-[1.4] text-white">
              20kg to 5+ Tonnes
            </p>
          </div>
          <div className="border-l border-white/10 px-7 py-8 first:border-l-0 first:pl-10 last:pr-10 max-md:px-5 max-md:py-6 max-md:first:pl-5 max-md:odd:border-l-0">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-500">
              Corridor Velocity
            </p>
            <p className="mt-[10px] text-[15px] font-medium leading-[1.4] text-white">
              Next-Day Short · 1–2 Day Medium · Day-3 Long
            </p>
          </div>
          <div className="border-l border-white/10 px-7 py-8 first:border-l-0 first:pl-10 last:pr-10 max-md:px-5 max-md:py-6 max-md:first:pl-5 max-md:odd:border-l-0">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-500">
              Sorting Yards
            </p>
            <p className="mt-[10px] text-[15px] font-medium leading-[1.4] text-white">
              ZERO Intermediate Hubs
            </p>
          </div>
        </div>
      </section>

      {/* ===================== METRICS BAND (Brief 01) ===================== */}
      <MetricsBand />
    </>
  );
}
