"use client";

/**
 * The Unfilled Gap — narrative section · Brief 05 (claim-corrected)
 * Frozen v5 port: light `#F4F2ED` band, sec-tag, H2 with orange
 * underline em, lede, two workaround cards, verdict pull-quote.
 * Copy per Brief 05 (de-firsted lede; courier-card allegations
 * softened; "small parcels" instead of an invented weight figure).
 */

import { Space_Grotesk } from "next/font/google";
import { motion, type Variants } from "motion/react";

import { useReveal } from "@/components/ui/use-reveal";
import { PointerHighlight } from "@/components/ui/pointer-highlight";
import { cn } from "@/lib/utils";
import styles from "./gap.module.css";

const sg = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const rv: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 },
  }),
};

const TRAPS = [
  {
    badge: "Workaround 01",
    tone: "courier",
    title: "Stretching the Courier Network",
    body: "You force heavy payloads into parcel networks for speed. The infrastructure breaks: goods get damaged, delays hide behind optimistic tracking, and punitive dimensional pricing destroys your unit economics.",
    tagline: "A model built for small parcels",
  },
  {
    badge: "Workaround 02",
    tone: "freight",
    title: "Settling for Traditional Transport",
    body: "You default to LTL freight for capacity. But their model relies on consolidation. Your shipments sit idle in hub yards for days, waiting for enough volume to justify a dispatch. You save money, but lose a week.",
    tagline: "A model built for bulk consolidation",
  },
];

/* ==================== card micro-graphics (founder pick A) ====================
   Hand-drawn data-viz line art in ink + one orange accent each. Static and
   deterministic (no random, no animation) so SSR and hydration agree. */

const INK = "rgba(12,14,9,0.16)";

/* Courier: a dense parcel-network mesh — everything wired to everything,
   with one orange route cutting through. */
function CourierMesh() {
  const nodes: [number, number][] = [
    [20, 30], [70, 18], [120, 42], [175, 22], [225, 50], [280, 25], [335, 45], [395, 20],
    [30, 90], [85, 75], [140, 105], [195, 80], [250, 105], [305, 78], [360, 100],
    [45, 135], [110, 120], [170, 140], [240, 125], [300, 138], [370, 122],
  ];
  /* web edges between near neighbours */
  const edges: [number, number][] = [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7],
    [8, 9], [9, 10], [10, 11], [11, 12], [12, 13], [13, 14],
    [15, 16], [16, 17], [17, 18], [18, 19], [19, 20],
    [0, 8], [1, 9], [2, 9], [3, 11], [4, 11], [5, 13], [6, 13], [7, 14],
    [8, 15], [9, 16], [10, 16], [11, 18], [12, 18], [13, 19], [14, 20],
    [1, 8], [2, 10], [3, 10], [5, 12], [6, 12], [7, 13],
    [8, 10], [11, 13], [16, 18], [19, 20],
  ];
  const route: [number, number][] = [[25, 120], [115, 88], [205, 105], [300, 60], [395, 100]];
  return (
    <svg viewBox="0 0 440 150" className={styles.trapArtSvg} aria-hidden="true">
      {edges.map(([a, b]) => (
        <line
          key={`${a}-${b}`}
          x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]}
          stroke={INK} strokeWidth="1"
        />
      ))}
      {nodes.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.6" fill="rgba(12,14,9,0.35)" />
      ))}
      <polyline
        points={route.map((p) => p.join(",")).join(" ")}
        fill="none" stroke="#E85A2C" strokeWidth="1.6" strokeLinecap="round"
        strokeLinejoin="round"
      />
      {route.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4" fill="#E85A2C" />
      ))}
    </svg>
  );
}

/* Freight: a hub-and-spoke yard — two big hubs, sparse lines, shipments
   parked idle beside the hubs, and an orange clock ticking on the wait. */
function FreightYard() {
  return (
    <svg viewBox="0 0 440 150" className={styles.trapArtSvg} aria-hidden="true">
      {/* hubs */}
      <circle cx="60" cy="78" r="18" fill="#fff" stroke="rgba(12,14,9,0.6)" strokeWidth="1.5" />
      <circle cx="380" cy="78" r="18" fill="#fff" stroke="rgba(12,14,9,0.6)" strokeWidth="1.5" />
      {/* sparse linehaul */}
      <line x1="78" y1="78" x2="362" y2="78" stroke={INK} strokeWidth="1" />
      <line x1="78" y1="60" x2="362" y2="60" stroke="rgba(12,14,9,0.1)" strokeWidth="1" />
      {/* idle shipments parked beside the hubs */}
      {[110, 124, 138].map((x) => (
        <rect key={`l${x}`} x={x} y="68" width="9" height="9" fill="none" stroke="rgba(12,14,9,0.5)" strokeWidth="1" />
      ))}
      {[110, 124].map((x) => (
        <rect key={`l2${x}`} x={x} y="82" width="9" height="9" fill="none" stroke="rgba(12,14,9,0.5)" strokeWidth="1" />
      ))}
      {[322, 336, 350].map((x) => (
        <rect key={`r${x}`} x={x} y="68" width="9" height="9" fill="none" stroke="rgba(12,14,9,0.5)" strokeWidth="1" />
      ))}
      {/* the wait: orange clock above the linehaul */}
      <circle cx="200" cy="28" r="14" fill="#fff" stroke="#E85A2C" strokeWidth="1.5" />
      <line x1="200" y1="28" x2="200" y2="19" stroke="#E85A2C" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="200" y1="28" x2="207" y2="31" stroke="#E85A2C" strokeWidth="1.5" strokeLinecap="round" />
      {/* one orange dispatch far away — the volume you're waiting for */}
      <rect x="395" y="122" width="9" height="9" fill="rgba(232,90,44,0.15)" stroke="#E85A2C" strokeWidth="1" />
    </svg>
  );
}

export function Gap() {
  const { ref, animateIn, inView } = useReveal<HTMLElement>();
  const show = animateIn ? (inView ? "show" : "hidden") : false;

  return (
    <section
      id="gap"
      ref={ref}
      aria-labelledby="gap-heading"
      className={styles.sec}
    >
      <div className={styles.wrap}>
        <motion.span
          variants={rv}
          custom={0}
          initial={animateIn ? "hidden" : false}
          animate={show as never}
          className={styles.tag}
        >
          The Unfilled Gap
        </motion.span>

        <motion.h2
          id="gap-heading"
          variants={rv}
          custom={1}
          initial={animateIn ? "hidden" : false}
          animate={show as never}
          className={cn(sg.className, styles.h2)}
        >
          You never had a choice. You were using networks that were{" "}
          <PointerHighlight>
            <em>never built for you</em>
          </PointerHighlight>
          .
        </motion.h2>

        <motion.p
          variants={rv}
          custom={2}
          initial={animateIn ? "hidden" : false}
          animate={show as never}
          className={styles.lede}
        >
          Heavy B2B never got a network built for it. You&rsquo;ve just been
          surviving on workarounds—hacking logistics models designed for
          entirely different categories.
        </motion.p>

        <div className={styles.trapGrid}>
          {TRAPS.map((trap, i) => (
            <motion.div
              key={trap.badge}
              variants={rv}
              custom={i + 2}
              initial={animateIn ? "hidden" : false}
              animate={show as never}
              className={cn(styles.trap, styles[trap.tone])}
            >
              {trap.tone === "courier" ? <CourierMesh /> : <FreightYard />}
              <span className={styles.badge}>{trap.badge}</span>
              <h3 className={sg.className}>{trap.title}</h3>
              <p>{trap.body}</p>
              <span className={styles.tagline}>{trap.tagline}</span>
            </motion.div>
          ))}
        </div>

        <motion.div
          variants={rv}
          custom={4}
          initial={animateIn ? "hidden" : false}
          animate={show as never}
          className={styles.verdict}
        >
          <p className={sg.className}>
            &ldquo;The system isn&rsquo;t broken.{" "}
            <b>It just wasn&rsquo;t built for you.</b>&rdquo;
          </p>
        </motion.div>
      </div>
    </section>
  );
}
