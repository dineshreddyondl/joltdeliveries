"use client";

/**
 * Hero — Section 01 · Brutalist Monochrome
 *
 * COPY SOURCE: FINAL FROZEN CONTENT v3 (202609232347.md · Section 1)
 * Aesthetic: strictly monochrome (#000/#fff/greys), sharp corners only,
 * 1px solid black borders, tech-dashboard styling.
 * Layout: 60/40 asymmetric split on desktop, single column on mobile.
 * Typography: Inter (font-sans) bold + tracking-tight for headings;
 * JetBrains Mono (font-mono) for eyebrows, micro-headers, route data, pillars.
 * Motion: Framer Motion entrance stagger + the 7s looping route animation
 * (legacy zigzag with hub stalls → fade → JOLT direct line → hold → loop).
 */

import { useEffect, useRef } from "react";
import { motion, type Variants } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

/* ---------- frozen copy · Section 1 ---------- */
const EYEBROW = "Express speed is no longer just for small parcels.";
const HEADLINE = "India\u2019s First Express Layer for Heavy Commerce.";
const MICRO_HEADER = "[ LIVE SLA GUARANTEES ]";
const ROUTES = [
  { lane: "Mumbai \u2192 Delhi", old: "7 days", next: "\u2192 2 days" },
  { lane: "Bangalore \u2192 Delhi", old: "7 days", next: "\u2192 3 days" },
];
const PILLAR_ROW =
  "Zero-Hub Execution \u00b7 Dedicated Rail Linehaul \u00b7 80% Lower Emissions";
const CLOSING = "\u201CFinally, an express layer that doesn\u2019t crawl.\u201D";
const SOCIAL_PROOF =
  "Powering heavy supply chains for: Wakefit \u00b7 Ola Electric \u00b7 Duroflex \u00b7 Ather";

export function Hero() {
  const seg1Ref = useRef<SVGPathElement>(null);
  const seg2Ref = useRef<SVGPathElement>(null);
  const seg3Ref = useRef<SVGPathElement>(null);
  const straightRef = useRef<SVGPathElement>(null);
  const zigGroupRef = useRef<SVGGElement>(null);
  const hub1Ref = useRef<SVGCircleElement>(null);
  const hub2Ref = useRef<SVGCircleElement>(null);
  const endARef = useRef<SVGCircleElement>(null);
  const endBRef = useRef<SVGCircleElement>(null);

  /* ---------- 7-second looping route animation ---------- */
  useEffect(() => {
    const segs = [seg1Ref.current, seg2Ref.current, seg3Ref.current];
    const straight = straightRef.current;
    const zigGroup = zigGroupRef.current;
    const hub1 = hub1Ref.current;
    const hub2 = hub2Ref.current;
    const endDots = [endARef.current, endBRef.current];
    if (
      segs.some((s) => !s) ||
      !straight ||
      !zigGroup ||
      !hub1 ||
      !hub2 ||
      endDots.some((d) => !d)
    ) {
      return;
    }

    const paths = segs as SVGPathElement[];
    const L = paths.map((s) => s.getTotalLength());
    const LS = straight.getTotalLength();
    const CYCLE = 7000;

    /* draw-in: dasharray L/L + offset L→0 reveals progressively */
    paths.forEach((s, i) => {
      s.style.strokeDasharray = `${L[i]} ${L[i]}`;
      s.style.strokeDashoffset = String(L[i]);
    });
    straight.style.strokeDasharray = `${LS} ${LS}`;
    straight.style.strokeDashoffset = String(LS);
    straight.style.opacity = "1";

    /* stutter: small end-gap oscillation while stuck at a hub */
    const stutter = (t: number, p0: number) =>
      10 * Math.abs(Math.sin((t - p0) * 0.05));

    /* hub pulse: two quick beats during its pause window */
    const pulse = (m: number, p0: number) => {
      if (m < p0 || m > p0 + 200) return 0;
      return Math.abs(Math.sin((Math.PI * (m - p0)) / 100));
    };

    const render = (t: number) => {
      const m = t % CYCLE;

      /* Beat 1 (0–1500ms): legacy zigzag draws with pauses at hubs */
      let o0: number, o1: number, o2: number;
      if (m < 400) o0 = L[0] * (1 - m / 400);
      else if (m < 600) o0 = stutter(m, 400);
      else o0 = 0;

      if (m < 600) o1 = L[1];
      else if (m < 1000) o1 = L[1] * (1 - (m - 600) / 400);
      else if (m < 1200) o1 = stutter(m, 1000);
      else o1 = 0;

      if (m < 1200) o2 = L[2];
      else if (m < 1500) o2 = L[2] * (1 - (m - 1200) / 300);
      else o2 = 0;

      paths[0].style.strokeDashoffset = String(o0);
      paths[1].style.strokeDashoffset = String(o1);
      paths[2].style.strokeDashoffset = String(o2);

      hub1.setAttribute("r", String(6 + 3 * pulse(m, 400)));
      hub2.setAttribute("r", String(6 + 3 * pulse(m, 1000)));

      /* Beat 2 (1500–3000ms): zigzag fades out completely */
      let zg = 1;
      if (m >= 1500 && m < 3000) zg = 1 - (m - 1500) / 1500;
      else if (m >= 3000) zg = 0;
      zigGroup.style.opacity = String(zg);

      /* Beat 3 (3000–3800ms): direct black line snaps in, then holds */
      let so = LS;
      if (m >= 3000 && m < 3800) so = LS * (1 - (m - 3000) / 800);
      else if (m >= 3800) so = 0;
      straight.style.strokeDashoffset = String(so);

      /* endpoints: grey during legacy beat, black once the direct line is live */
      const active = m >= 3000;
      endDots.forEach((d) => d?.setAttribute("fill", active ? "#000" : "#999"));
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      zigGroup.style.opacity = "0";
      straight.style.strokeDashoffset = "0";
      endDots.forEach((d) => d?.setAttribute("fill", "#000"));
      return;
    }

    let raf = 0;
    let t0: number | null = null;
    const frame = (now: number) => {
      if (t0 === null) t0 = now;
      render(now - t0);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section id="hero" className="border-b border-black bg-white text-black">
      <div className="mx-auto grid min-h-screen w-full max-w-[1240px] grid-cols-1 content-center gap-x-16 gap-y-14 px-6 py-20 lg:grid-cols-[3fr_2fr] lg:items-center lg:px-12">
        {/* ---------- LEFT · frozen copy ---------- */}
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.p
            variants={item}
            className="font-mono text-[13px] tracking-[0.02em] text-gray-500"
          >
            {EYEBROW}
          </motion.p>

          <motion.h1
            variants={item}
            className="mt-7 max-w-[640px] text-[clamp(30px,3.5vw,50px)] font-bold leading-[1.06] tracking-[-0.035em]"
          >
            {HEADLINE.slice(0, HEADLINE.indexOf("for"))}
            <span className="block">for Heavy Commerce.</span>
          </motion.h1>

          {/* micro-header + route data · mono · dashboard table */}
          <motion.div variants={item} className="mt-9 max-w-[560px]">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-gray-500">
              <span className="inline-block h-1.5 w-1.5 animate-pulse bg-black" />
              <span>{MICRO_HEADER}</span>
            </div>
            <div className="mt-2 rounded-none border border-black font-mono text-[14px]">
              {ROUTES.map((r, i) => (
                <div
                  key={r.lane}
                  className={`flex flex-wrap items-baseline gap-x-3 px-4 py-3 ${
                    i === 0 ? "border-b border-black" : ""
                  }`}
                >
                  <span className="min-w-[18ch] text-gray-500">{r.lane}</span>
                  <span className="text-gray-500">—</span>
                  <s className="text-gray-500 line-through decoration-black decoration-[1.5px]">
                    {r.old}
                  </s>
                  <span className="font-bold">{r.next}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.p
            variants={item}
            className="mt-7 max-w-[560px] font-mono text-[11px] tracking-[0.05em] text-gray-500"
          >
            {PILLAR_ROW}
          </motion.p>

          <motion.p
            variants={item}
            className="mt-7 text-[20px] italic text-gray-600"
          >
            {CLOSING}
          </motion.p>

          <motion.div
            variants={item}
            className="mt-9 flex flex-wrap items-center gap-x-10 gap-y-4"
          >
            <a
              href="#serviceability"
              className="inline-block rounded-none border border-black bg-black px-9 py-4 text-[15px] font-semibold text-white transition-colors duration-200 hover:bg-gray-900"
            >
              Check Serviceability
            </a>
            <a
              href="#demo"
              className="inline-block rounded-none border-b border-gray-400 pb-1.5 text-[15px] font-medium text-black transition-colors duration-200 hover:border-black"
            >
              Request Demo
            </a>
          </motion.div>

          <motion.p
            variants={item}
            className="mt-8 font-mono text-[11px] tracking-[0.04em] text-gray-500"
          >
            {SOCIAL_PROOF}
          </motion.p>
        </motion.div>

        {/* ---------- RIGHT · lane simulation card ---------- */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35, ease: EASE }}
          className="rounded-none border border-black bg-white"
        >
          {/* card header strip */}
          <div className="flex items-center justify-between rounded-none border-b border-black px-4 py-3 font-mono text-[11px] uppercase tracking-[0.14em]">
            <span className="text-gray-500">Lane simulation</span>
            <span className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 animate-pulse bg-black" />
              <span>Live</span>
            </span>
          </div>

          {/* route animation */}
          <div className="p-4">
            <svg
              viewBox="0 0 520 420"
              className="h-auto w-full"
              aria-hidden="true"
              focusable="false"
            >
              <circle ref={endARef} cx="50" cy="330" r="6" fill="#999" />
              <circle ref={endBRef} cx="470" cy="80" r="6" fill="#999" />

              <g ref={zigGroupRef}>
                <path
                  ref={seg1Ref}
                  d="M 50 330 L 190 120"
                  fill="none"
                  stroke="#999"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  ref={seg2Ref}
                  d="M 190 120 L 320 270"
                  fill="none"
                  stroke="#999"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  ref={seg3Ref}
                  d="M 320 270 L 470 80"
                  fill="none"
                  stroke="#999"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <circle ref={hub1Ref} cx="190" cy="120" r="6" fill="#999" />
                <circle ref={hub2Ref} cx="320" cy="270" r="6" fill="#999" />
              </g>

              <path
                ref={straightRef}
                d="M 50 330 L 470 80"
                fill="none"
                stroke="#000"
                strokeWidth="3.5"
                strokeLinecap="round"
                opacity="0"
              />
            </svg>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
