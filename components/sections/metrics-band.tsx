"use client";

/**
 * Metrics Band — benchmark-faithful port (frozen v5 `#metrics`, lines 750–770).
 *
 * FOUNDER OVERRIDE (Dinesh, 2026-10-19): copy restored to the benchmark
 * verbatim — 80% / 99.2% / 1.4T / 24–48h. This deliberately reintroduces
 * stats the AGENTS.md guardrail table flags (bare SLA %, per-lane CO₂);
 * the founder reviewed the exact diff and chose benchmark fidelity.
 * Count-up + reveal animation preserved (benchmark's own `.count` behavior);
 * the LIVE timestamp and footnotes from Brief 01 are removed.
 */

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Space_Grotesk } from "next/font/google";
import { motion, useInView, type Variants } from "motion/react";

import { NumberTicker } from "@/components/ui/number-ticker";
import { cn } from "@/lib/utils";

const sg = Space_Grotesk({
  subsets: ["latin"],
  weight: "700",
  display: "swap",
});

/* SSR-safe layout effect: runs before paint on the client, no-op on server. */
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut", delay: i * 0.08 },
  }),
};

interface CardSpec {
  key: string;
  number: string | number;
  decimalPlaces?: number;
  unit: string;
  leadIn: string;
  rest: string;
  srOnly: string;
}

function formatNumber(value: number, decimals: number): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function MetricsBand() {
  const bandRef = useRef<HTMLElement>(null);
  const bandInView = useInView(bandRef, { once: true });

  const [reduceMotion, setReduceMotion] = useState(false);

  /* Hydration-safe animation gate. */
  const [ready, setReady] = useState(false);
  useIsomorphicLayoutEffect(() => setReady(true), []);
  const animateIn = ready && !reduceMotion;

  useEffect(() => {
    setReduceMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
  }, []);

  /* Benchmark copy verbatim (frozen v5 lines 753–768). */
  const cards: CardSpec[] = [
    {
      key: "emissions",
      number: 80,
      unit: "%",
      leadIn: "Lower emissions",
      rest: "vs road freight — rail-first linehaul",
      srOnly:
        "80 percent lower emissions versus road freight, rail-first linehaul",
    },
    {
      key: "sla",
      number: 99.2,
      decimalPlaces: 1,
      unit: "%",
      leadIn: "SLA adherence",
      rest: "across all live lanes",
      srOnly: "99.2 percent SLA adherence across all live lanes",
    },
    {
      key: "co2",
      number: 1.4,
      decimalPlaces: 1,
      unit: "T",
      leadIn: "CO₂ saved",
      rest: "per lane vs road",
      srOnly: "1.4 tonnes of CO₂ saved per lane versus road",
    },
    {
      key: "arrivals",
      number: "24–48",
      unit: "h",
      leadIn: "Distributor arrivals",
      rest: "B2B replenishment, guaranteed",
      srOnly:
        "24 to 48 hour distributor arrivals, B2B replenishment guaranteed",
    },
  ];

  return (
    <section
      id="metrics"
      ref={bandRef}
      aria-labelledby="metrics-heading"
      className="bg-white py-6 max-md:py-4"
    >
      <h2 id="metrics-heading" className="sr-only">
        JOLT by the numbers
      </h2>

      <div className="mx-auto max-w-[1140px] px-8">
        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-8 pb-2 -mx-8 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-[22px] sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4">
          {cards.map((c, i) => (
            <motion.div
              key={c.key}
              custom={i}
              variants={cardVariants}
              initial={animateIn ? "hidden" : false}
              animate={animateIn ? (bandInView ? "show" : "hidden") : false}
              className={cn(
                "min-w-[78%] snap-center rounded-[18px] border border-[rgba(12,14,9,0.06)] bg-white p-[30px_26px] sm:min-w-0",
                reduceMotion
                  ? ""
                  : "transition-[transform,box-shadow] duration-300 ease-out pointer-fine:hover:-translate-y-[3px] pointer-fine:hover:shadow-[0_24px_60px_-24px_rgba(12,14,9,0.18)]",
              )}
            >
              <div
                className={cn(
                  sg.className,
                  "text-[clamp(32px,3.4vw,42px)] font-bold leading-none tracking-[-0.03em] text-[#0C0E09]",
                )}
              >
                {typeof c.number === "string" ? (
                  <span>{c.number}</span>
                ) : reduceMotion ? (
                  <span>{formatNumber(c.number, c.decimalPlaces ?? 0)}</span>
                ) : (
                  <>
                    <NumberTicker
                      aria-hidden
                      value={c.number}
                      decimalPlaces={c.decimalPlaces ?? 0}
                      delay={0.2}
                    >
                      {formatNumber(c.number, c.decimalPlaces ?? 0)}
                    </NumberTicker>
                    <span className="sr-only">{c.srOnly}</span>
                  </>
                )}
                <span className="ml-[2px] align-[0.08em] text-[0.62em] text-[#C2410C]">
                  {c.unit}
                </span>
              </div>

              <p className="mt-3 text-[14px] leading-[1.5] text-[#4A4E44]">
                <span className="font-semibold text-[#0C0E09]">
                  {c.leadIn}
                </span>{" "}
                — {c.rest}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
