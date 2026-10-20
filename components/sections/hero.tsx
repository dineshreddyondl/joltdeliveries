"use client";

/**
 * Hero — Section 01 · V0.1 Brief 01 (frozen Header + Hero, mock v5.1+)
 *
 * Left column = benchmark dot-to-dot (frozen v5): aurora chrome, eyebrow,
 * H1 "India's first express layer for heavy shipments." with the blaze +
 * embers accent, pillar row and the [ Live Lanes ] table ("Traditional
 * Logistics" column header — founder override 2026-10-19, the sweep
 * exempts this file). The schedule-derived dispatch line was removed
 * 2026-10-19 (founder) — lib/dispatch-data.ts stays for when real
 * schedule values are confirmed.
 *
 * Right column = THE SQUARE (frozen). A single 1:1 white stage with
 * spotlight + grain, 6-product parade (one per category) at 1.2s each,
 * chip top-left (CATEGORY / NAME / SPEC), stamp top-right
 * "DELIVERED IN 24–48 HRS" that SLAMS AND STAYS, and the in-stage journey
 * bar (INSTANT PICKUP → NEXT TRAIN OUT → OUT FOR DELIVERY → DELIVERED,
 * with nodes, ripples, shimmer segments, arrowheads, lit labels and the
 * 09:10 · 09:40 · 10:30 · 11:02 times row). A category ticker (6 dots +
 * CURRENT → NEXT) sits below the stage.
 *
 * START-STOP loop (founder, non-negotiable): 9.6s total —
 * journey fills 0–7.2s → DELIVERED flare + stamp slam at 73.1% → 2.4s
 * HOLD (everything stopped, stamp visible, 6th product held) → clean
 * reset → restart. ONE master clock drives everything: a single
 * requestAnimationFrame loop (no Date.now(), no separate intervals).
 * Segment windows (of 9.6s): 0–20.2% · 21.7–39.4% · 40.8–58.5%;
 * nodes flash 3.4% / 22.9% / 42%; DELIVERED flare + stamp slam at the
 * SAME instant (73.1%, delta 0ms).
 *
 * Reduced motion: static first product, journey bar fully lit, stamp
 * visible, status INSTANT PICKUP — no loops, no pulses.
 */

import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Space_Grotesk } from "next/font/google";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";
import { PointerHighlight } from "@/components/ui/pointer-highlight";
import { SparklesCore } from "@/components/ui/sparkles";
import { LANES, SHOWCASE_LANE } from "@/lib/lanes";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import { CustomerMarquee } from "@/components/sections/customer-marquee";
import styles from "./hero.module.css";

const sg = Space_Grotesk({
  subsets: ["latin"],
  weight: "700",
  display: "swap",
});

/* SSR-safe layout effect: runs before paint on the client, no-op on server. */
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* ==================== frozen square-stage constants ==================== */
const T = 9.6; /* full start-stop loop (s) */
const PER = 1.2; /* seconds per product — 6 × 1.2s = one 7.2s journey */
const HOLD_AT = 7.2; /* delivered hold starts (journey end) */
const STAMP_AT = T * 0.731; /* DELIVERED flare + stamp slam — same instant */
const pct = (p: number) => (p / 100) * T;

/* The frozen 6-product parade (mock v5.1+ image set — final images still
   being finalised per the brief; wiring follows the frozen mock). */
const PRODUCTS = [
  {
    src: "/assets/hero-final/test-sofa-cutout.png",
    alt: "Sectional sofa",
    cat: "FURNITURE",
    name: "SECTIONAL SOFA",
    spec: "96 KG · 2.4 CBM",
  },
  {
    src: "/assets/hero-final/hero-auto-alternator-nb.png",
    alt: "Car alternator",
    cat: "AUTO PARTS",
    name: "ALTERNATOR",
    spec: "5 KG · 0.15 CBM",
  },
  {
    src: "/assets/hero-final/hero-furniture-bench-nb.png",
    alt: "Velvet bench",
    cat: "FURNITURE",
    name: "VELVET BENCH",
    spec: "18 KG · 0.9 CBM",
  },
  {
    src: "/assets/hero-final/hero-bedding-mattress-nb.png",
    alt: "Mattress with bed frame",
    cat: "BEDDING",
    name: "MATTRESS SET",
    spec: "45 KG · 1.9 CBM",
  },
  {
    src: "/assets/hero-final/hero-nursery-crib-nb.png",
    alt: "Baby crib",
    cat: "NURSERY",
    name: "BABY CRIB",
    spec: "28 KG · 1.2 CBM",
  },
  {
    src: "/assets/hero-final/hero-appliances-nb.png",
    alt: "Home appliance set",
    cat: "APPLIANCES",
    name: "APPLIANCE SET",
    spec: "180 KG · 4.5 CBM",
  },
];
const NP = PRODUCTS.length;

/* Journey-bar segment windows (frozen mock keyframes, seconds of 9.6s). */
const SEGS = [
  { fill: [pct(2.6), pct(20.2)], arrow: [pct(3.4), pct(20.2)] },
  { fill: [pct(21.7), pct(39.4)], arrow: [pct(22.5), pct(39.4)] },
  { fill: [pct(40.8), pct(58.5)], arrow: [pct(41.6), pct(58.5)] },
];

/* Node ignition + expanding ripple windows (n4 = DELIVERED flare). */
const NODE_LIT = [pct(3.4), pct(22.9), pct(42), STAMP_AT];
const RIPPLE = [
  [pct(3.4), pct(6.8)],
  [pct(22.9), pct(26.2)],
  [pct(42), pct(45.5)],
  [STAMP_AT, pct(80)],
];

const STAGES = [
  "INSTANT PICKUP",
  "NEXT TRAIN OUT",
  "OUT FOR DELIVERY",
  "DELIVERED",
] as const;

/* Status windows (frozen mock STAT table, seconds). */
const STAT = [
  { from: 0, to: 2.19, text: STAGES[0], lit: 0 },
  { from: 2.19, to: 4.03, text: STAGES[1], lit: 1 },
  { from: 4.03, to: 7.0, text: STAGES[2], lit: 2 },
  { from: 7.0, to: T, text: STAGES[3], lit: 3 },
];

const TIMES = ["09:10", "09:40", "10:30", "11:02"];

const STAGE_LABEL =
  "Live dispatch stage: a square shipment board cycling through six heavy shipments — sectional sofa, alternator, velvet bench, mattress set, baby crib and appliance set. Each one runs the journey bar: instant pickup, next train out, out for delivery, then a DELIVERED IN 24 HRS seal slams and stays.";

/* ------------------------------ easing ------------------------------ */

/** Cubic-bezier easing (classic solver) — used for the springy conveyor
    entry (.18,1.35,.4,1) and the stamp slam (.16,1,.3,1). */
function cubicBezier(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): (x: number) => number {
  const NEWTON_ITERATIONS = 8;
  const SUBDIVISION_PRECISION = 1e-7;
  const SUBDIVISION_MAX_ITERATIONS = 12;
  const kSplineTableSize = 11;
  const kSampleStepSize = 1 / (kSplineTableSize - 1);
  const sampleValues = new Float32Array(kSplineTableSize);

  const A = (a1: number, a2: number) => 1 - 3 * a2 + 3 * a1;
  const B = (a1: number, a2: number) => 3 * a2 - 6 * a1;
  const C = (a1: number) => 3 * a1;
  const calcBezier = (t: number, a1: number, a2: number) =>
    ((A(a1, a2) * t + B(a1, a2)) * t + C(a1)) * t;
  const getSlope = (t: number, a1: number, a2: number) =>
    3 * A(a1, a2) * t * t + 2 * B(a1, a2) * t + C(a1);

  for (let i = 0; i < kSplineTableSize; ++i) {
    sampleValues[i] = calcBezier(i * kSampleStepSize, x1, x2);
  }

  const getTForX = (x: number) => {
    let intervalStart = 0;
    let currentSample = 1;
    const lastSample = kSplineTableSize - 1;
    for (
      ;
      currentSample !== lastSample && sampleValues[currentSample] <= x;
      ++currentSample
    ) {
      intervalStart += kSampleStepSize;
    }
    --currentSample;
    const dist =
      (x - sampleValues[currentSample]) /
      (sampleValues[currentSample + 1] - sampleValues[currentSample]);
    let guessForT = intervalStart + dist * kSampleStepSize;
    const initialSlope = getSlope(guessForT, x1, x2);
    if (initialSlope >= 0.001) {
      for (let i = 0; i < NEWTON_ITERATIONS; ++i) {
        const currentX = calcBezier(guessForT, x1, x2) - x;
        if (Math.abs(currentX) <= SUBDIVISION_PRECISION) return guessForT;
        const currentSlope = getSlope(guessForT, x1, x2);
        if (currentSlope === 0) break;
        guessForT -= currentX / currentSlope;
      }
    } else if (initialSlope !== 0) {
      let a = intervalStart;
      let b = intervalStart + kSampleStepSize;
      for (let i = 0; i < SUBDIVISION_MAX_ITERATIONS; ++i) {
        const currentX = calcBezier(guessForT, x1, x2) - x;
        if (currentX > 0) b = guessForT;
        else a = guessForT;
        guessForT = (a + b) / 2;
      }
    }
    return guessForT;
  };

  return (x: number) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    return calcBezier(getTForX(x), y1, y2);
  };
}

const STAMP_EASE = cubicBezier(0.16, 1, 0.3, 1);

/**
 * Two identical 11-row cycles so `translateY(-50%)` loops seamlessly;
 * the DEL→BOM showcase row leads each cycle (the same row leads both
 * halves so they stay pixel-identical at the wrap point).
 */
const LANE_CYCLE = [SHOWCASE_LANE, ...LANES];
const LANE_TRACK = [...LANE_CYCLE, ...LANE_CYCLE];

/* ==================== entrance variants (frozen timings) ==================== */

export function Hero() {
  const reduceMotion = useReducedMotion();
  const [blazeIn, setBlazeIn] = useState(false);
  /* Same treatment as 'never built for you': the color lands only after
     the pointer draw-in — orange here instead of red. */
  const [hlOn, setHlOn] = useState(false);
  /* Sequenced entrance: the stage loop starts only after the left
     column has finished presenting (reading order). */
  const [stageOn, setStageOn] = useState(false);
  const pausedRef = useRef(false);

  /* Hydration-safe animation gate: SSR and first client render ship the
     final visible state (no hidden styles), so reduced-motion users get a
     mismatch-free static hero; non-reduced users animate from hidden only
     after mount (layout effect fires before paint — no flash). */
  const [ready, setReady] = useState(false);
  useIsomorphicLayoutEffect(() => setReady(true), []);
  const animateIn = ready && !reduceMotion;

  const raceRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const stampRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLSpanElement>(null);
  const blinkRef = useRef<HTMLSpanElement>(null);
  const seqLabelRef = useRef<HTMLSpanElement>(null);
  const catRef = useRef<HTMLSpanElement>(null);
  const nameRef = useRef<HTMLSpanElement>(null);
  const specRef = useRef<HTMLSpanElement>(null);

  /* Blaze accent: frozen adds `in` 580 ms after load. */
  useEffect(() => {
    if (reduceMotion) {
      setBlazeIn(true);
      return;
    }
    const id = setTimeout(() => setBlazeIn(true), 580);
    const stageId = setTimeout(() => setStageOn(true), 2700);
    return () => {
      clearTimeout(id);
      clearTimeout(stageId);
    };
  }, [reduceMotion]);

  /* ============ ONE master clock — the frozen 9.6s start-stop loop ============
     Single rAF loop; every element reads the same `t` so the parade, the
     journey bar, the DELIVERED flare and the stamp can never drift. */
  useIsomorphicLayoutEffect(() => {
    const race = raceRef.current;
    const stage = stageRef.current;
    const flashEl = flashRef.current;
    const spotEl = spotRef.current;
    const contactEl = contactRef.current;
    const stampEl = stampRef.current;
    const statusEl = statusRef.current;
    const blinkEl = blinkRef.current;
    const seqLabelEl = seqLabelRef.current;
    const catEl = catRef.current;
    const nameEl = nameRef.current;
    const specEl = specRef.current;
    if (
      !race ||
      !stage ||
      !flashEl ||
      !spotEl ||
      !contactEl ||
      !stampEl ||
      !statusEl ||
      !blinkEl ||
      !seqLabelEl ||
      !catEl ||
      !nameEl ||
      !specEl
    ) {
      return;
    }

    /* Non-null aliases for the nested closures. */
    const raceEl: HTMLDivElement = race;
    const stageEl: HTMLDivElement = stage;
    const flash: HTMLDivElement = flashEl;
    const spot: HTMLDivElement = spotEl;
    const contact: HTMLDivElement = contactEl;
    const stamp: HTMLDivElement = stampEl;
    const status: HTMLSpanElement = statusEl;
    const blink: HTMLSpanElement = blinkEl;
    const seqLabel: HTMLSpanElement = seqLabelEl;
    const cat: HTMLSpanElement = catEl;
    const name: HTMLSpanElement = nameEl;
    const spec: HTMLSpanElement = specEl;

    const q = <E extends Element>(sel: string) =>
      Array.from(raceEl.querySelectorAll<E>(sel));
    const imgs = q<HTMLImageElement>("[data-stage-img]");
    const dots = q<HTMLElement>("[data-stage-dot]");
    const fills = q<HTMLElement>("[data-stage-fill]");
    const arrows = q<HTMLElement>("[data-stage-arrow]");
    const nodeDots = q<HTMLElement>("[data-stage-nodedot]");
    const rings = q<HTMLElement>("[data-stage-ring]");
    const labels = q<HTMLElement>("[data-stage-label]");

    const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

    const render = (tt: number) => {
      /* ---------- parade: 6 products × 1.2s; the 6th holds through the pause */
      const k = Math.min(NP - 1, Math.floor(tt / PER));
      imgs.forEach((img, i) => {
        if (i === NP - 1 && tt >= HOLD_AT) {
          img.style.opacity = "1";
          img.style.transform = "translate3d(0,0,0)";
        } else if (i === k) {
          /* Camera cut: instant swap, no travel - the per-swap flash
             + spotlight pulses sell the cut. */
          img.style.opacity = "1";
          img.style.transform = "translate3d(0,0,0)";
        } else {
          img.style.opacity = "0";
          img.style.transform = "translate3d(0,0,0)";
        }
      });

      /* ---------- camera flash + spotlight + contact-shadow pulses per swap */
      const sinceSwap = tt - k * PER;
      const flashO =
        sinceSwap < 0.3 ? Math.sin(clamp01(sinceSwap / 0.3) * Math.PI) : 0;
      flash.style.opacity = String(flashO);
      const spotO =
        sinceSwap < 0.6
          ? 0.7 * Math.sin(clamp01(sinceSwap / 0.6) * Math.PI)
          : 0;
      spot.style.opacity = String(spotO);
      const contactScale =
        1 +
        0.07 *
          (sinceSwap < 0.7
            ? Math.sin(clamp01(sinceSwap / 0.7) * Math.PI)
            : 0);
      contact.style.transform = `translate(-50%,-50%) scale(${contactScale.toFixed(3)})`;

      /* ---------- chip (top-left) + category ticker */
      const item = PRODUCTS[k];
      cat.textContent = item.cat;
      name.textContent = item.name;
      spec.textContent = item.spec;
      dots.forEach((d, j) => {
        d.style.background = j === k ? "#C2410C" : "rgba(12,14,9,.14)";
      });
      seqLabel.textContent = `${item.cat} → ${PRODUCTS[(k + 1) % NP].cat}`;

      /* ---------- status row (blink dot freezes lit through the hold) */
      let idx = 0;
      for (let j = 0; j < STAT.length; j++) {
        if (tt >= STAT[j].from && tt < STAT[j].to) idx = j;
      }
      status.textContent = STAT[idx].text;
      const blinkPhase = Math.min(tt, HOLD_AT);
      blink.style.opacity = blinkPhase % 1 < 0.5 ? "1" : "0.25";

      /* ---------- journey bar: shimmer fills + arrowheads */
      SEGS.forEach((s, j) => {
        const fillEl = fills[j];
        const arrowEl = arrows[j];
        const fillU = clamp01((tt - s.fill[0]) / (s.fill[1] - s.fill[0]));
        fillEl.style.width = `${(fillU * 100).toFixed(2)}%`;
        fillEl.style.backgroundPosition = `${(fillU * 100).toFixed(2)}% 0`;
        const aU = clamp01((tt - s.arrow[0]) / (s.arrow[1] - s.arrow[0]));
        arrowEl.style.left = `${(aU * 100).toFixed(2)}%`;
        let aO = 0;
        if (tt >= s.arrow[0] && tt <= s.fill[1]) aO = 1;
        else if (tt > s.fill[1] && tt <= s.fill[1] + 0.004 * T) {
          aO = 1 - (tt - s.fill[1]) / (0.004 * T);
        }
        arrowEl.style.opacity = String(aO);
      });

      /* ---------- nodes: flash orange + expanding ripple when reached */
      NODE_LIT.forEach((at, j) => {
        const dot = nodeDots[j];
        const ring = rings[j];
        if (tt >= at) {
          dot.style.background = "#E85A2C";
          dot.style.boxShadow =
            j === 3
              ? "0 0 22px rgba(232,90,44,.95)"
              : "0 0 10px rgba(232,90,44,.75)";
        } else {
          dot.style.background = "rgba(12,14,9,.14)";
          dot.style.boxShadow = "none";
        }
        const [rs, re] = RIPPLE[j];
        const active = tt >= rs && tt < re;
        const rU = clamp01((tt - rs) / (re - rs));
        ring.style.opacity = active ? String(Math.sin(Math.PI * rU)) : "0";
        ring.style.transform = `scale(${(0.6 + (j === 3 ? 2.0 : 1.5) * rU).toFixed(3)})`;
      });

      /* ---------- labels light up as stages pass */
      labels.forEach((el, j) => {
        el.dataset.on = String(j <= STAT[idx].lit);
      });

      /* ---------- DELIVERED stamp: slam-and-stay through the hold */
      if (tt >= STAMP_AT) {
        const su = clamp01((tt - STAMP_AT) / 0.3);
        const o = Math.min(1, STAMP_EASE(su / 0.6));
        const scale =
          su < 0.6
            ? 0.5 + 0.58 * STAMP_EASE(su / 0.6)
            : 1.08 - 0.08 * STAMP_EASE((su - 0.6) / 0.4);
        stamp.style.opacity = String(o);
        stamp.style.transform = `rotate(-7deg) scale(${scale.toFixed(3)})`;
      } else {
        stamp.style.opacity = "0";
        stamp.style.transform = "rotate(-7deg) scale(0.5)";
      }
    };

    /* Reduced motion (brief §1): static first product, journey bar fully
       lit, stamp visible, status INSTANT PICKUP — no loops, no pulses. */
    const renderStatic = () => {
      imgs.forEach((img, i) => {
        img.style.opacity = i === 0 ? "1" : "0";
        img.style.transform =
          i === 0 ? "translate3d(0,0,0) scale(1)" : "translate3d(64px,0,0) scale(0.96)";
      });
      flash.style.opacity = "0";
      spot.style.opacity = "0";
      contact.style.transform = "translate(-50%,-50%) scale(1)";
      const first = PRODUCTS[0];
      cat.textContent = first.cat;
      name.textContent = first.name;
      spec.textContent = first.spec;
      dots.forEach((d, j) => {
        d.style.background = j === 0 ? "#C2410C" : "rgba(12,14,9,.14)";
      });
      seqLabel.textContent = `${first.cat} → ${PRODUCTS[1].cat}`;
      status.textContent = STAGES[0];
      blink.style.opacity = "1";
      SEGS.forEach((s, j) => {
        fills[j].style.width = "100%";
        fills[j].style.backgroundPosition = "100% 0";
        arrows[j].style.left = "100%";
        arrows[j].style.opacity = "0";
      });
      nodeDots.forEach((dot, j) => {
        dot.style.background = "#E85A2C";
        dot.style.boxShadow =
          j === 3
            ? "0 0 22px rgba(232,90,44,.95)"
            : "0 0 10px rgba(232,90,44,.75)";
      });
      rings.forEach((ring) => {
        ring.style.opacity = "0";
      });
      labels.forEach((el) => {
        el.dataset.on = "true";
      });
      stamp.style.opacity = "1";
      stamp.style.transform = "rotate(-7deg) scale(1)";
    };

    let t = 0;
    let last = performance.now();
    let hover = false;
    let onScreen = true;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const active = () =>
      !pausedRef.current && !hover && onScreen && !document.hidden;

    let raf = 0;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!active()) return;
      t += dt;
      if (t >= T) t -= T;
      render(t);
    };

    const enter = (e: PointerEvent) => {
      if (e.pointerType === "mouse") hover = true;
    };
    const leave = () => {
      hover = false;
    };
    stageEl.addEventListener("pointerenter", enter);
    stageEl.addEventListener("pointerleave", leave);
    const io = new IntersectionObserver(
      (es) => {
        onScreen = es[0].isIntersecting;
      },
      { threshold: 0.15 },
    );
    io.observe(stageEl);
    const ro = new ResizeObserver(() => {
      if (!reduce) render(t);
    });
    ro.observe(raceEl);

    /* Freeze-frame support (`#t=SS.S`) keeps the loop deterministic for
       browser verification, same as the frozen v5 board. */
    const hashT = /[#&]t=([\d.]+)/.exec(window.location.hash);
    if (hashT) {
      const tv = parseFloat(hashT[1]);
      t = tv % T;
      pausedRef.current = true;
      render(t);
    } else if (reduce) {
      renderStatic();
    } else if (stageOn) {
      render(0);
      raf = requestAnimationFrame((n) => {
        last = n;
        tick(n);
      });
    } else {
      /* Pre-sequence: static first frame, loop waits its turn. */
      render(0);
    }

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      stageEl.removeEventListener("pointerenter", enter);
      stageEl.removeEventListener("pointerleave", leave);
    };
  }, [stageOn]);

  return (
    <header id="top" className={styles.hero}>
      <div className={styles.aurora} aria-hidden="true" />
      {/* Floor ripple — click/tap anywhere empty to ripple the grid. */}
      <div className={styles.rippleFloor} aria-hidden="true">
        <BackgroundRippleEffect rows={7} cols={34} cellSize={44} />
      </div>
      <div
        className={cn(styles.heroWrap, styles.heroGrid)}
        data-seq={animateIn ? "1" : undefined}
      >
        {/* ---------- LEFT · benchmark dot-to-dot ---------- */}
        <div className={styles.leftCol}>
          <motion.span
            className={styles.eyebrow}
          >
            Express speed is no longer just for small parcels.
          </motion.span>

          <motion.h1
            className={cn(sg.className, styles.h1, blazeIn && styles.in)}
          >
            India&rsquo;s first express layer for{" "}
            <span className={styles.em}>
              <PointerHighlight delay={0.35} onComplete={() => setHlOn(true)}>
                <em className={cn(styles.hl, hlOn && styles.hlOn)}>
                  heavy shipments.
                </em>
              </PointerHighlight>
            </span>
          </motion.h1>

          <motion.div
            className={styles.pillarRow}
          >
            <span className={styles.plItem}>
              <i className={styles.plSq} />
              Just-in-time execution
            </span>
            <span className={styles.plItem}>
              <i className={styles.plSq} />
              Direct dispatch
            </span>
            <span className={styles.plItem}>
              <i className={styles.plSq} />
              <span className={styles.plAcid}>80%</span> less carbon
            </span>
          </motion.div>

                  <motion.div
            className={styles.laneWrap}
            id="live-lanes"
          >
            <motion.span
              className={styles.laneHead}
            >
              <span className={styles.sq} />
              [ Live Lanes ]
            </motion.span>
            <div className={styles.laneBox}>
            <div className={styles.laneCols}>
              <span>Route</span>
              {/* Founder override 2026-10-19: benchmark column label kept
                  verbatim — the banned-claims sweep exempts this file. */}
              <span>Traditional Logistics</span>
              <span>JOLT Deliveries</span>
            </div>
            <div className={styles.laneView}>
              <div className={styles.laneTrack}>
                {LANE_TRACK.map((r, i) => (
                  <div
                    key={i}
                    className={cn(styles.laneRow, r.fast && styles.fast)}
                  >
                    <span className={styles.lane}>{r.lane}</span>
                    <s>{r.old}</s>
                    <span className={styles.new}>{r.next}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          </motion.div>
        </div>

        {/* ---------- RIGHT · the frozen square stage ---------- */}
        <motion.div
          className={styles.heroRace}
          ref={raceRef}
        >
          {/* Sparkle band rising off the top edge of the stage — pure
              overlay, desktop-only, never under reduced motion. Gated on
              `ready` (hydration-safe: SSR and first client render agree)
              plus `!reduceMotion` (client-only media state). */}
          {ready && !reduceMotion && (
            <div className={styles.stageSparkle} aria-hidden="true">
              <SparklesCore
                background="transparent"
                minSize={0.4}
                maxSize={1}
                particleDensity={300}
                speed={1.2}
                className="h-full w-full"
                particleColor="#0C0E09"
              />
            </div>
          )}
          <div
            className={styles.stage}
            ref={stageRef}
            role="img"
            aria-label={STAGE_LABEL}
          >
            <div className={styles.grain} aria-hidden="true" />

            <div className={styles.product}>
              <div className={styles.spot} ref={spotRef} aria-hidden="true" />
              <div className={styles.flash} ref={flashRef} aria-hidden="true" />
              <div className={styles.imgs}>
                {PRODUCTS.map((p, i) => (
                  /* eslint-disable-next-line @next/next/no-img-element -- the
                     single-rAF master clock drives these via querySelectorAll +
                     inline styles; next/image would wrap them and break the
                     6×1.2s lock. Local, pre-optimized PNG/JPG assets. */
                  <img
                    key={p.src}
                    src={p.src}
                    alt={p.alt}
                    data-stage-img
                    className={styles.img}
                    decoding="async"
                    style={
                      i === 0
                        ? { opacity: 1, transform: "translate3d(0,0,0) scale(1)" }
                        : { opacity: 0 }
                    }
                  />
                ))}
              </div>
            </div>

            <div className={styles.contact} ref={contactRef} aria-hidden="true" />

            <div className={styles.chip}>
              <span className={styles.chipCat} ref={catRef}>
                FURNITURE
              </span>
              <span className={styles.chipName} ref={nameRef} data-stage-name>
                SECTIONAL SOFA
              </span>
              <span className={styles.chipSpec} ref={specRef}>
                96 KG · 2.4 CBM
              </span>
            </div>

            <div
              className={cn(styles.stamp, sg.className)}
              ref={stampRef}
              data-stage-stamp
            >
              <span className={styles.stampRing} aria-hidden="true" />
              <span className={styles.stampT1}>DELIVERED</span>
              <span className={styles.stampT2}>IN 24 HRS</span>
            </div>

            <div className={styles.stagebar} aria-hidden="true">
              <div className={styles.status}>
                <span className={styles.blink} ref={blinkRef} data-stage-blink />
                <span ref={statusRef} data-stage-status>
                  INSTANT PICKUP
                </span>
              </div>
              <div className={styles.nodes}>
                {STAGES.map((label, j) => (
                  <Fragment key={label}>
                    {j > 0 && (
                      <div className={styles.seg}>
                        <i
                          className={styles.fill}
                          data-stage-fill
                          style={{ width: "0%" }}
                        />
                        <span
                          className={styles.arrow}
                          data-stage-arrow
                          style={{ opacity: 0 }}
                        />
                      </div>
                    )}
                    <div className={cn(styles.node, j === 3 && styles.nodeLast)}>
                      <i className={styles.nodeDot} data-stage-nodedot />
                      <span className={styles.ring} data-stage-ring />
                    </div>
                  </Fragment>
                ))}
              </div>
              <div className={styles.labels}>
                {STAGES.map((label) => (
                  <span key={label} data-stage-label>
                    {label}
                  </span>
                ))}
              </div>
              <div className={styles.times}>
                {TIMES.map((tm) => (
                  <span key={tm}>{tm}</span>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.seq}>
            {PRODUCTS.map((p, j) => (
              <span
                key={p.src}
                data-stage-dot
                className={styles.seqDot}
                style={{
                  background: j === 0 ? "#C2410C" : "rgba(12,14,9,.14)",
                }}
              />
            ))}
            <span className={styles.seqLabel} ref={seqLabelRef}>
              FURNITURE → AUTO PARTS
            </span>
          </div>
        </motion.div>
      </div>

      {/* Brands marquee — inside the hero section (frozen mock: the
          marquee lives at the bottom of the hero header). The instant
          freight estimate strip was removed 2026-10-19 (founder). */}
      <CustomerMarquee />
    </header>
  );
}
