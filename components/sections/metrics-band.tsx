"use client";

/**
 * Metrics Band — Section · Brief 01 (outcome-metric strip)
 *
 * Light #metrics section rendered after the proof strip. Four defensible
 * stats mapped to JOLT's value math (faster / reliable / cleaner /
 * cash-velocity), claims corrected per uplift-spec §0.
 *
 * - Reveal: opacity 0→1, y 20→0, 300ms ease-out, 80ms stagger (first in-view).
 * - Count-up: 100 / 89 / 3 animate 0→target once (~800ms ease-out, spring),
 *   triggered after the reveal begins. "24–48" and "up to" are static text.
 * - Live line (reliability card): pulsing 8px dot + mono timestamp ticking
 *   every second in Asia/Kolkata; starts on first in-view, pauses when the
 *   tab is hidden, clears on unmount.
 * - prefers-reduced-motion: final numbers immediately, no reveal/pulse/hover.
 * - SSR: tickers render their target value server-side (no "0" flash).
 */

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Space_Grotesk } from "next/font/google";
import { motion, useInView, type Variants } from "motion/react";

import { NumberTicker } from "@/components/ui/number-ticker";
import {
  FOOTNOTES,
  METRICS,
  RELIABLE_AUDITED,
  RELIABLE_DEFAULT,
  isAuditedOptionAUnlocked,
} from "@/lib/metrics-data";
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
  /** Static prefix rendered before the number ("up to"). */
  prefix?: string;
  /** Static text ("24–48") or a count-up target. */
  number: string | number;
  decimalPlaces?: number;
  unit: string;
  marker?: "†" | "‡";
  leadIn: string;
  rest: string;
  /** Full-sentence sr-only equivalent of the animated number. */
  srOnly: string;
  live?: boolean;
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
  const [now, setNow] = useState<Date | null>(null);

  /* Hydration-safe animation gate (same pattern as Hero): SSR + first
     client render show the final values with no hidden styles; animation
     starts from hidden only after mount, and never for reduced motion. */
  const [ready, setReady] = useState(false);
  useIsomorphicLayoutEffect(() => setReady(true), []);
  const animateIn = ready && !reduceMotion;

  useEffect(() => {
    setReduceMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
  }, []);

  /* Live timestamp: first in-view start, hidden-tab pause, unmount clear. */
  useEffect(() => {
    if (!bandInView) return;
    let timer: ReturnType<typeof setInterval> | null = null;
    const tick = () => setNow(new Date());
    const start = () => {
      tick();
      if (timer === null) timer = setInterval(tick, 1000);
    };
    const stop = () => {
      if (timer !== null) {
        clearInterval(timer);
        timer = null;
      }
    };
    start();
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [bandInView]);

  const timeStr = now
    ? new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(now)
    : null;

  /* Founder-gated Option A: renders ONLY when every audited field exists. */
  const audited = isAuditedOptionAUnlocked(METRICS);
  const reliableNumber =
    METRICS.sla.adherencePercent ?? RELIABLE_DEFAULT.number;

  const cards: CardSpec[] = [
    {
      key: "faster",
      number: "24–48",
      unit: "h",
      leadIn: "B2B distributor arrivals",
      rest: "vs 3–7 days by LTL / Part-Load",
      srOnly:
        "24 to 48 hour B2B distributor arrivals, versus 3 to 7 days by LTL / Part-Load",
    },
    {
      key: "reliable",
      number: reliableNumber,
      decimalPlaces: audited ? 1 : 0,
      unit: "%",
      leadIn: audited ? RELIABLE_AUDITED.leadIn : RELIABLE_DEFAULT.leadIn,
      rest: audited ? RELIABLE_AUDITED.rest : RELIABLE_DEFAULT.rest,
      srOnly: audited ? RELIABLE_AUDITED.srOnly : RELIABLE_DEFAULT.srOnly,
      live: true,
    },
    {
      key: "cleaner",
      prefix: "up to",
      number: 89,
      unit: "%",
      marker: "†",
      leadIn: "Less CO₂ per tonne-km",
      rest: "vs road freight — rail-first linehaul",
      srOnly:
        "Up to 89 percent less CO₂ per tonne-kilometre versus road freight",
    },
    {
      key: "cash",
      prefix: "up to",
      number: 3,
      unit: "×",
      marker: "‡",
      leadIn: "Faster rotation of in-transit working capital",
      rest: "on our longest lanes",
      srOnly:
        "Up to 3 times faster rotation of in-transit working capital on our longest lanes",
    },
  ];

  return (
    <section
      id="metrics"
      ref={bandRef}
      aria-labelledby="metrics-heading"
      className="bg-white py-6"
    >
      <h2 id="metrics-heading" className="sr-only">
        JOLT by the numbers
      </h2>

      <div className="mx-auto max-w-[1140px] px-8">
        <div className="grid grid-cols-1 gap-[22px] sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c, i) => (
            <motion.div
              key={c.key}
              custom={i}
              variants={cardVariants}
              initial={animateIn ? "hidden" : false}
              animate={animateIn ? (bandInView ? "show" : "hidden") : false}
              className={cn(
                "rounded-[18px] border border-[rgba(12,14,9,0.06)] bg-white p-[30px_26px]",
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
                {c.prefix ? (
                  <span className="mr-[6px] align-[0.18em] text-[15px] font-medium leading-none text-[#4A4E44]">
                    {c.prefix}
                  </span>
                ) : null}
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
                {c.marker ? (
                  <sup className="ml-[2px] text-[0.62em] text-[#C2410C]">
                    {c.marker}
                  </sup>
                ) : null}
              </div>

              <p className="mt-3 text-[13px] leading-[1.5] text-[#4A4E44]">
                <span className="font-semibold text-[#0C0E09]">
                  {c.leadIn}
                </span>{" "}
                — {c.rest}
              </p>

              {c.live ? (
                <div className="mt-3 flex items-center gap-2">
                  {reduceMotion ? (
                    <span
                      aria-hidden
                      className="inline-block size-2 shrink-0 rounded-full bg-[#E85A2C]"
                    />
                  ) : (
                    <motion.span
                      aria-hidden
                      className="inline-block size-2 shrink-0 rounded-full bg-[#E85A2C]"
                      animate={{ scale: [1, 1.4, 1], opacity: [1, 0.3, 1] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  )}
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#4A4E44]">
                    Live · Updated {timeStr ?? "00:00:00"} IST
                  </span>
                </div>
              ) : null}
            </motion.div>
          ))}
        </div>

        {/* Footnotes († cards 3, ‡ card 4) */}
        <div className="mt-6 space-y-[6px]">
          <p className="text-[12px] leading-[1.6] text-[#4A4E44]">
            <sup className="mr-[3px] text-[#C2410C]">†</sup>
            {FOOTNOTES.co2}
          </p>
          <p className="text-[12px] leading-[1.6] text-[#4A4E44]">
            <sup className="mr-[3px] text-[#C2410C]">‡</sup>
            {FOOTNOTES.capital}
          </p>
        </div>
      </div>
    </section>
  );
}
