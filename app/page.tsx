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
      {/* ===================== NAV + HERO (Brief 04) =====================
          Hero now ends with the brands marquee (founder 2026-10-19);
          the instant freight estimate strip was removed. */}
      <Nav />
      <Hero />

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
