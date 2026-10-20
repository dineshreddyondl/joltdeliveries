"use client";

/**
 * The Unfilled Gap — narrative section · Brief 05 (claim-corrected)
 * Frozen v5 port: light `#F4F2ED` band, sec-tag, H2 with orange
 * underline em, lede, two workaround cards, verdict pull-quote.
 * Copy per Brief 05 (de-firsted lede; courier-card allegations
 * softened; "small parcels" instead of an invented weight figure).
 */

import { Space_Grotesk } from "next/font/google";
import { motion, useInView, type Variants } from "motion/react";
import { useRef, useState } from "react";

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

/* Staged row reveal: rows roll in one after another; marks pop in
   sequence; each row flashes orange as it lands (row 2 keeps its
   persistent highlight). Gated on the TABLE's own visibility. */
const rowV: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: i * 0.5 },
  }),
};

const markV: Variants = {
  hidden: { opacity: 0, scale: 0.4 },
  /* custom encodes row*10 + markIndex so the mark waits for its row. */
  show: (c: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 16,
      delay: Math.floor(c / 10) * 0.5 + 0.15 + (c % 10) * 0.2,
    },
  }),
};

/* Per-cell glow: travels cell by cell in reading order after the marks
   pop in — green on ✓ cells, red on ✕ cells. */
const glowV: Variants = {
  hidden: { opacity: 0 },
  show: (c: number) => ({
    opacity: [0, 1, 0],
    transition: {
      duration: 1.6,
      times: [0, 0.35, 1],
      repeat: 0,
      delay: 2.4 + (c % 2) * 0.12,
    },
  }),
};

/* One comparison table (founder): the two networks share the same
   variables — express speed, bulky speed, bulk pricing — and the
   verdict lives in the highlighted double-✕ row: neither network
   gives you bulky speed. */

const CMP = [
  {
    name: "Express Courier Network",
    sub: "Built for small parcels",
  },
  {
    name: "LTL Network",
    sub: "Built for bulk aggregation",
  },
];

const ROWS = [
  {
    label: "Speed for small parcels",
    note: "The courier sweet spot",
    marks: [true, false],
  },
  {
    label: "Speed for heavy shipments",
    note: "The gap JOLT fills",
    marks: [false, false],
    highlight: true,
  },
  {
    label: "Cost efficient for bulk",
    note: "Truckload economics",
    marks: [false, true],
  },
];

export function Gap() {
  const { ref, animateIn, inView } = useReveal<HTMLElement>();
  const show = animateIn ? (inView ? "show" : "hidden") : false;

  /* Red lands on the phrase only after the pointer draw-in completes. */
  const [redOn, setRedOn] = useState(false);

  /* The table stages its own rows (the section-level reveal can fire
     early while layout settles) — gate on the table itself. */
  const tblRef = useRef<HTMLDivElement>(null);
  const tblInView = useInView(tblRef as never, { once: true, amount: 0.4 });
  const lit = animateIn && tblInView;

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
          <PointerHighlight onComplete={() => setRedOn(true)}>
            <em className={cn(styles.emPhrase, redOn && styles.emPhraseRed)}>
              never built for you.
            </em>
          </PointerHighlight>
        </motion.h2>

        <motion.p
          variants={rv}
          custom={2}
          initial={animateIn ? "hidden" : false}
          animate={show as never}
          className={styles.lede}
        >
          Heavy B2B never got a network built for it. You&rsquo;ve just been
          surviving on workarounds — hacking logistics models designed for
          entirely different categories.
        </motion.p>

        <motion.div
          variants={rv}
          custom={2}
          initial={animateIn ? "hidden" : false}
          animate={show as never}
          className={styles.cmpTable}
          ref={tblRef}
        >
          {/* Instrument strip: mono readout header for the matrix. */}
          <div className={styles.cmpStrip}>
            <span className={styles.cmpStripTag}>Comparison · Workarounds</span>
            <span className={styles.cmpStripIdx}>
              <b>01</b> / 02
            </span>
          </div>
          <div className={styles.cmpHeadRow}>
            <span className={styles.cmpCorner}>Variable</span>
            {CMP.map((col) => (
              <span key={col.name} className={styles.cmpCol}>
                <span className={cn(sg.className, styles.cmpColTitle)}>
                  {col.name}
                </span>
                <span className={styles.cmpSub}>{col.sub}</span>
              </span>
            ))}
          </div>
          {ROWS.map((row, i) => (
            <motion.div
              key={row.label}
              variants={rowV}
              custom={i}
              initial={animateIn ? "hidden" : false}
              animate={lit ? "show" : false}
              className={cn(styles.cmpRow, row.highlight && styles.cmpHi)}
            >
              <span className={styles.cmpLabel}>
                <span className={styles.cmpIdx}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={styles.cmpLabelTxt}>
                  {row.label}
                  <i>{row.note}</i>
                </span>
              </span>
              {row.marks.map((ok, j) => (
                <motion.span
                  key={j}
                  data-cap={j === 0 ? "Courier" : "LTL"}
                  variants={markV}
                  custom={i * 10 + j}
                  initial={animateIn ? "hidden" : false}
                  animate={lit ? "show" : false}
                  className={cn(styles.cmpCell, ok && styles.cmpCellOk)}
                >
                  {ok ? "✓" : "✕"}
                  <motion.span
                    variants={glowV}
                    custom={i * 2 + j}
                    initial={animateIn ? "hidden" : false}
                    animate={lit ? "show" : false}
                    className={cn(
                      styles.cmpGlow,
                      ok ? styles.cmpGlowOk : styles.cmpGlowNo,
                    )}
                    aria-hidden="true"
                  />
                </motion.span>
              ))}
            </motion.div>
          ))}
        </motion.div>

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
