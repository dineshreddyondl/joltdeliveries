"use client";

/**
 * Hero — Section 01 · Brief 04 (frozen v5 port, claim-corrected)
 *
 * Exact port of the frozen v5 hero (`frozen design/jolt-landing-v5.html`,
 * lines 641–733): white/orange shell with aurora glows, eyebrow, H1 with
 * the blaze/flame accent on the em span, pillar row, [ Live Lanes ] table
 * and the V5 dispatch board — 9 payload images at 0.8s cadence, clock
 * hand sweeping one full revolution in 7.2s completing at 12 o'clock
 * exactly as the "DELIVERED IN 24 HRS" stamp slams (STAMP_OUT = 8.6,
 * total loop T = 9.0). The rAF timeline math below is the frozen file's
 * own (lines 1015–1138), ported 1:1 onto refs. No new animation libraries.
 *
 * Copy is claim-corrected per Brief 04 / AGENTS.md guardrails:
 * - H1: "India's rail-first express network for 200kg+ B2B."
 * - Pillar: "up to 89% less CO₂ per tonne-km" († footnote)
 * - Lanes header: "LTL / Part-Load" (claim-corrected column label)
 * - Showcase row: Delhi → Mumbai 4–5 days → 2 days
 */

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Space_Grotesk } from "next/font/google";
import { motion, useReducedMotion, type Variants } from "motion/react";

import { cn } from "@/lib/utils";
import styles from "./hero.module.css";

const sg = Space_Grotesk({
  subsets: ["latin"],
  weight: "700",
  display: "swap",
});

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* SSR-safe layout effect: runs before paint on the client, no-op on server. */
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* ==================== frozen dispatch-board constants ==================== */
const PER = 0.8; /* seconds per payload */
const CLOCK_TURN = 7.2; /* one full clock revolution (9 × 0.8s) */
const STAMP_OUT = 8.6; /* "DELIVERED IN 24 HRS" slam window */
const T = 9.0; /* full loop */
const IMG_END = 9 * PER;

const ITEMS = [
  { n: "SIDEBOARD", s: "38 KG · 1.2 CBM" },
  { n: "SHOCK ABSORBERS", s: "6 KG · 0.8 CBM" },
  { n: "ARMCHAIR", s: "24 KG · 0.9 CBM" },
  { n: "WINGBACK ARMCHAIR", s: "28 KG · 1.1 CBM" },
  { n: "SECTIONAL SOFA", s: "96 KG · 2.4 CBM" },
  { n: "FURNITURE SET", s: "140 KG · 3.4 CBM" },
  { n: "BLOWER MOTOR", s: "4 KG · 0.2 CBM" },
  { n: "BABY CRIB", s: "28 KG · 1.2 CBM" },
  { n: "APPLIANCE SET", s: "180 KG · 4.5 CBM" },
];
const N = ITEMS.length;

const IMAGES = [
  { src: "/assets/payload-1-sideboard.png", alt: "Mid-century wooden sideboard" },
  { src: "/assets/payload-2-shock.png", alt: "Automotive shock absorbers" },
  { src: "/assets/payload-5-armchair.png", alt: "Dark grey fabric armchair" },
  { src: "/assets/payload-6-wingback.png", alt: "Blue wingback armchair" },
  { src: "/assets/payload-7-sofa.png", alt: "Sectional sofa" },
  { src: "/assets/payload-5-furniture.png", alt: "Mid-century furniture set" },
  { src: "/assets/payload-9-blower.png", alt: "Blower motor assembly" },
  { src: "/assets/payload-10-crib.png", alt: "Baby crib" },
  { src: "/assets/payload-11-appliances.png", alt: "Home appliance set" },
];

const BOARD_LABEL =
  "Live dispatch: heavy shipments — sideboard, shock absorbers, armchair, wingback armchair, sectional sofa, furniture set, blower motor, baby crib, home appliance set — moving rail-first on a JOLT flatbed. Next-day, zero handoffs.";

/* 12 clock ticks, generated with the frozen math (radius 116 → 128). */
const TICKS = Array.from({ length: 12 }, (_, i) => {
  const a = (i * 30 * Math.PI) / 180;
  return {
    x1: (140 + Math.sin(a) * 116).toFixed(1),
    y1: (140 - Math.cos(a) * 116).toFixed(1),
    x2: (140 + Math.sin(a) * 128).toFixed(1),
    y2: (140 - Math.cos(a) * 128).toFixed(1),
  };
});

/* ==================== live lanes (claim-corrected) ==================== */

interface Lane {
  lane: string;
  old: string;
  next: string;
  fast?: boolean;
}

const LANES: Lane[] = [
  { lane: "Hyderabad → Delhi", old: "7 days", next: "3 days" },
  { lane: "Mumbai → Hyderabad", old: "3 days", next: "1 day" },
  { lane: "Mumbai → Delhi", old: "5 days", next: "2 days" },
  { lane: "Chennai → Mumbai", old: "5 days", next: "2 days" },
  { lane: "Bangalore → Trivandrum", old: "6 days", next: "2 days" },
  { lane: "Bangalore → Delhi", old: "7 days", next: "3 days" },
  { lane: "Hyderabad → Bangalore", old: "3 days", next: "24 hrs", fast: true },
  { lane: "Bangalore → Chennai", old: "2 days", next: "24 hrs", fast: true },
  { lane: "Coimbatore → Trivandrum", old: "5 days", next: "24 hrs", fast: true },
  { lane: "Hyderabad → Pune", old: "3 days", next: "24 hrs", fast: true },
];

/** Showcase lane (AGENTS.md): the one corridor where the gap is real. */
const SHOWCASE_LANE: Lane = {
  lane: "Delhi → Mumbai",
  old: "4–5 days",
  next: "2 days",
};

/**
 * Two identical 11-row cycles so `translateY(-50%)` loops seamlessly;
 * the DEL→BOM showcase row leads each cycle (top of the second cycle
 * per the brief — the same row also leads the first cycle so the two
 * halves stay pixel-identical at the wrap point).
 */
const LANE_CYCLE = [SHOWCASE_LANE, ...LANES];
const LANE_TRACK = [...LANE_CYCLE, ...LANE_CYCLE];

/* ==================== entrance variants (frozen timings) ==================== */

const fadeUp = (delay: number): Variants => ({
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE, delay },
  },
});

const raceReveal: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE, delay: 0.3 },
  },
};

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="6" y="5" width="4" height="14" />
      <rect x="14" y="5" width="4" height="14" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

export function Hero() {
  const reduceMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const [blazeIn, setBlazeIn] = useState(false);
  const pausedRef = useRef(false);

  /* Hydration-safe animation gate: SSR and first client render ship the
     final visible state (no hidden styles), so reduced-motion users get a
     mismatch-free static hero; non-reduced users animate from hidden only
     after mount (layout effect fires before paint — no flash). */
  const [ready, setReady] = useState(false);
  useIsomorphicLayoutEffect(() => setReady(true), []);
  const animateIn = ready && !reduceMotion;

  const zoneRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const stampRef = useRef<HTMLDivElement>(null);
  const handRef = useRef<SVGGElement>(null);
  const chipRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLSpanElement>(null);
  const specRef = useRef<HTMLSpanElement>(null);
  const ticksRef = useRef<SVGGElement>(null);

  /* Blaze accent: frozen adds `in` 580 ms after load. */
  useEffect(() => {
    if (reduceMotion) {
      setBlazeIn(true);
      return;
    }
    const id = setTimeout(() => setBlazeIn(true), 580);
    return () => clearTimeout(id);
  }, [reduceMotion]);

  const togglePaused = () => {
    pausedRef.current = !pausedRef.current;
    setPaused(pausedRef.current);
  };

  /* Frozen rAF timeline (v5 script lines 1015–1138), ported 1:1 onto refs. */
  useEffect(() => {
    const zone = zoneRef.current;
    const panel = panelRef.current;
    const frame = frameRef.current;
    const flash = flashRef.current;
    const stamp = stampRef.current;
    const hand = handRef.current;
    const chip = chipRef.current;
    const core = coreRef.current;
    const shadow = shadowRef.current;
    const nameEl = nameRef.current;
    const specEl = specRef.current;
    const ticksG = ticksRef.current;
    if (
      !zone ||
      !panel ||
      !frame ||
      !flash ||
      !stamp ||
      !hand ||
      !chip ||
      !core ||
      !shadow ||
      !nameEl ||
      !specEl
    ) {
      return;
    }

    /* Non-null aliases: TS narrowing doesn't flow into the nested
       render/tick closures below. */
    const zoneEl: HTMLDivElement = zone;
    const panelEl: HTMLDivElement = panel;
    const frameEl: HTMLDivElement = frame;
    const flashEl: HTMLDivElement = flash;
    const stampEl: HTMLDivElement = stamp;
    const handEl: SVGGElement = hand;
    const chipEl: HTMLDivElement = chip;
    const coreEl: HTMLDivElement = core;
    const shadowEl: HTMLDivElement = shadow;
    const nameElSafe: HTMLSpanElement = nameEl;
    const specElSafe: HTMLSpanElement = specEl;

    const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
    const bounce = (u: number) => {
      const n = 7.5625;
      const d = 2.75;
      return u < 1 / d
        ? n * u * u
        : u < 2 / d
          ? n * (u -= 1.5 / d) * u + 0.75
          : u < 2.5 / d
            ? n * (u -= 2.25 / d) * u + 0.9375
            : n * (u -= 2.625 / d) * u + 0.984375;
    };
    const angDiff = (a: number, b: number) => {
      let d = ((a - b) % 360 + 360) % 360;
      if (d > 180) d -= 360;
      return d;
    };

    const imgs = Array.from(frame.querySelectorAll("img"));
    const tickEls = ticksG ? Array.from(ticksG.children) : [];

    let t = 0;
    let last = performance.now();
    let hover = false;
    let onScreen = true;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const active = () =>
      !pausedRef.current && !hover && onScreen && !document.hidden;

    function render(tt: number) {
      const i = Math.min(N - 1, Math.floor(tt / PER));
      imgs.forEach((el, k) => el.classList.toggle("on", k === i));
      nameElSafe.textContent = ITEMS[i].n;
      specElSafe.textContent = ITEMS[i].s;

      /* image pop on entry + ground shadow breathes with it */
      const p = tt % PER;
      const pop = 1 + 0.05 * Math.max(0, 1 - p / 0.35);
      frameEl.style.transform = "translate(-50%,-50%) scale(" + pop.toFixed(3) + ")";
      shadowEl.style.transform = "translate(-50%,-50%) scale(" + pop.toFixed(3) + ")";

      /* camera flash at each swap + cycle start */
      let f = 0;
      if (tt < 0.3) f = Math.sin(clamp(tt / 0.3) * Math.PI);
      else if (tt < IMG_END) {
        const bi = Math.floor(tt / PER);
        if (bi > 0) {
          const u = clamp((tt - bi * PER) / 0.3);
          f = Math.sin(u * Math.PI);
        }
      }
      flashEl.style.opacity = String(f);

      /* clock hand: starts at 12, one full revolution in 7.2s (9 × 0.8s),
         completes at 12 o'clock exactly as the stamp slams */
      const ang = -90 + (Math.min(tt, CLOCK_TURN) / CLOCK_TURN) * 360;
      handEl.style.transform = "rotate(" + ang.toFixed(2) + "deg)";

      /* ticks ignite as the hand tip passes */
      tickEls.forEach((l, j) => {
        const ta = -90 + j * 30;
        const pulse = Math.max(0, 1 - Math.abs(angDiff(ang, ta)) / 14);
        const line = l as SVGLineElement;
        line.style.stroke =
          pulse > 0
            ? "rgba(232,90,44," + (0.25 + 0.55 * pulse).toFixed(3) + ")"
            : "rgba(12,14,9,.22)";
        line.style.strokeWidth = (1.5 + 2.5 * pulse).toFixed(2);
      });

      /* spec chip: LED tick-in on swap, fades out as stamp approaches */
      const chipIn = Math.min(1, p / 0.22);
      const co =
        (tt < CLOCK_TURN - 0.15 ? 1 : clamp((CLOCK_TURN - 0.05 - tt) / 0.1)) *
        chipIn;
      chipEl.style.opacity = String(co);
      chipEl.style.transform =
        "translateX(-50%) translateY(" +
        (-7 * (1 - co) + 5 * (1 - chipIn)).toFixed(2) +
        "px) scale(" +
        ((0.55 + 0.45 * co) * (0.9 + 0.1 * chipIn)).toFixed(3) +
        ")";

      /* DELIVERED stamp slam + board micro-shake on impact */
      if (tt >= CLOCK_TURN - 0.01 && tt < STAMP_OUT) {
        const su = clamp((tt - CLOCK_TURN) / 0.4);
        const so = clamp((STAMP_OUT - tt) / 0.3);
        stampEl.style.opacity = String(Math.min(su, so));
        stampEl.style.transform =
          "translate(-50%,-50%) rotate(-8deg) scale(" +
          (0.4 + 0.6 * bounce(su)).toFixed(3) +
          ")";
        const shAmp = 3 * Math.max(0, 1 - (tt - CLOCK_TURN) / 0.18);
        coreEl.style.transform =
          "translate(" +
          (Math.sin((tt - CLOCK_TURN) * 70) * shAmp).toFixed(2) +
          "px,0)";
      } else {
        stampEl.style.opacity = "0";
        coreEl.style.transform = "";
      }
    }

    let raf = 0;
    function tick(now: number) {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!active()) return;
      t += dt;
      if (t >= T) t -= T;
      render(t);
    }

    const enter = (e: PointerEvent) => {
      if (e.pointerType === "mouse") hover = true;
    };
    const leave = () => {
      hover = false;
    };
    panelEl.addEventListener("pointerenter", enter);
    panelEl.addEventListener("pointerleave", leave);
    const io = new IntersectionObserver(
      (es) => {
        onScreen = es[0].isIntersecting;
      },
      { threshold: 0.15 },
    );
    io.observe(panelEl);
    const ro = new ResizeObserver(() => render(t));
    ro.observe(zoneEl);

    const hashT = /[#&]t=([\d.]+)/.exec(window.location.hash);
    if (hashT) {
      const tv = parseFloat(hashT[1]);
      t = tv % T;
      pausedRef.current = true;
      setPaused(true);
      render(t);
    } else if (reduce) {
      t = 1.0;
      pausedRef.current = true;
      setPaused(true);
      render(t);
    } else {
      render(0);
      raf = requestAnimationFrame((n) => {
        last = n;
        tick(n);
      });
    }

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      panelEl.removeEventListener("pointerenter", enter);
      panelEl.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <header id="top" className={styles.hero}>
      <div className={styles.aurora} aria-hidden="true" />
      <div className={cn(styles.heroWrap, styles.heroGrid)}>
        {/* ---------- LEFT · claim-corrected copy ---------- */}
        <div>
          <motion.span
            variants={fadeUp(0.4)}
            initial={animateIn ? "hidden" : false}
            animate={animateIn ? "show" : false}
            className={styles.eyebrow}
          >
            Express speed is no longer just for small parcels.
          </motion.span>

          <motion.h1
            variants={fadeUp(0.5)}
            initial={animateIn ? "hidden" : false}
            animate={animateIn ? "show" : false}
            className={cn(sg.className, styles.h1, blazeIn && styles.in)}
          >
            India&rsquo;s rail-first express network for{" "}
            <span className={styles.em}>
              200kg+ B2B
              <i className={styles.blaze} aria-hidden="true">
                <i className={styles.s1} />
                <i className={styles.s2} />
                <i className={styles.s3} />
              </i>
            </span>
            .
          </motion.h1>

          <motion.div
            variants={fadeUp(0.7)}
            initial={animateIn ? "hidden" : false}
            animate={animateIn ? "show" : false}
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
              up to <span className={styles.plAcid}>89%</span> less CO₂ per
              tonne-km<sup aria-hidden="true">†</sup>
            </span>
          </motion.div>

          <motion.span
            variants={fadeUp(0.85)}
            initial={animateIn ? "hidden" : false}
            animate={animateIn ? "show" : false}
            className={styles.laneHead}
          >
            <span className={styles.sq} />
            [ Live Lanes ]
          </motion.span>

          <motion.div
            variants={fadeUp(0.9)}
            initial={animateIn ? "hidden" : false}
            animate={animateIn ? "show" : false}
            className={styles.laneBox}
          >
            <div className={styles.laneCols}>
              <span>Route</span>
              <span>LTL / Part-Load</span>
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
          </motion.div>

          <p className={styles.footnote}>
            <sup>†</sup>
            Rail 10.6 vs road 55–82 gCO₂e/tonne-km (NITI Aayog 2021; Smart
            Freight Centre India 2025)
          </p>
        </div>

        {/* ---------- RIGHT · V5 dispatch board ---------- */}
        <motion.div
          variants={raceReveal}
          initial={animateIn ? "hidden" : false}
          animate={animateIn ? "show" : false}
          className={styles.heroRace}
        >
          <div className={styles.panel} ref={panelRef}>
            {/* live label + pause/play (frozen pd-head + ctl styling) */}
            <div className={styles.pdHead}>
              <span className={styles.pdLive}>
                <span className={styles.sq} aria-hidden="true" />
                LIVE
              </span>
              <span className={styles.pdSide}>
                <span className={styles.pdCount}>9 PAYLOADS</span>
                <button
                  type="button"
                  className={styles.ctl}
                  onClick={togglePaused}
                  aria-label={paused ? "Play animation" : "Pause animation"}
                >
                  {paused ? <PlayIcon /> : <PauseIcon />}
                </button>
              </span>
            </div>

            <div role="img" aria-label={BOARD_LABEL}>
              <div className={styles.parade}>
                <div className={styles.zone} ref={zoneRef}>
                  <div className={styles.dbShadow} ref={shadowRef} aria-hidden="true" />
                  <div className={styles.dbCore} ref={coreRef}>
                    <svg
                      className={styles.dbRing}
                      viewBox="0 0 280 280"
                      aria-hidden="true"
                    >
                      <circle cx="140" cy="140" r="128" className={styles.rc} />
                      <g className={styles.ticks} ref={ticksRef}>
                        {TICKS.map((tick, i) => (
                          <line key={i} {...tick} />
                        ))}
                      </g>
                      <g className={styles.hand} ref={handRef}>
                        <line x1="140" y1="140" x2="140" y2="26" className={styles.hd} />
                        <circle cx="140" cy="140" r="7" className={styles.hub} />
                      </g>
                    </svg>
                    <div className={styles.dbFrame} ref={frameRef}>
                      {IMAGES.map((img) => (
                        /* eslint-disable-next-line @next/next/no-img-element -- the
                           frozen dispatch-board rAF loop drives these via
                           frame.querySelectorAll("img") + classList; next/image
                           would wrap them and break the 1:1 timing. Local,
                           pre-optimized PNG assets. */
                        <img
                          key={img.src}
                          src={img.src}
                          alt={img.alt}
                          className={styles.it}
                          decoding="async"
                        />
                      ))}
                    </div>
                  </div>
                  <div className={styles.dbGrain} aria-hidden="true" />
                  <div className={styles.dbFlash} ref={flashRef} aria-hidden="true" />
                  <div
                    className={cn(styles.dbStamp, sg.className)}
                    ref={stampRef}
                  >
                    <span>DELIVERED IN 24 HRS</span>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </div>
                  <div className={styles.pdChip} ref={chipRef}>
                    <span className={styles.cName} ref={nameRef}>
                      SIDEBOARD
                    </span>
                    <span className={styles.cSpec} ref={specRef}>
                      38 KG · 1.2 CBM
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </header>
  );
}
