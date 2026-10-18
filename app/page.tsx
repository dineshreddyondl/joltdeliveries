/* ============================================================================
   JOLT — HOME
   Brief 04: frozen-v5 white/orange Nav + Hero (dispatch board, live lanes)
   at the top, followed by the dark proof strip (kept) and the Brief 01
   MetricsBand. ServiceabilityChecker lives in the Nav.
   ========================================================================== */

import { Hero } from "@/components/sections/hero";
import { MetricsBand } from "@/components/sections/metrics-band";
import { Nav } from "@/components/sections/nav";
import { WhyNow } from "@/components/sections/why-now";
import { Gap } from "@/components/sections/gap";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Ecosystem } from "@/components/sections/ecosystem";
import { Cta } from "@/components/sections/cta";
import { Footer } from "@/components/sections/footer";

export default function Home() {
  return (
    <>
      {/* ===================== NAV + HERO (Brief 04) ===================== */}
      <Nav />
      <Hero />

      {/* ===================== PROOF STRIP (dark band — explicit bg per architecture §3) ===================== */}
      <section className="reveal d6 border-t border-white/10 bg-[#08080A] text-white">
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

      {/* =============== NARRATIVE (Brief 05, claim-corrected) ============ */}
      <WhyNow />
      <Gap />

      {/* ============ HOW IT WORKS (Brief 06, claim-corrected) =========== */}
      <HowItWorks />

      {/* ============== ECOSYSTEM (Brief 07, generic marquee) ============ */}
      <Ecosystem />

      {/* ============ CHALLENGE CTA + FOOTER (Brief 08) ============== */}
      <Cta />
      <Footer />
    </>
  );
}
