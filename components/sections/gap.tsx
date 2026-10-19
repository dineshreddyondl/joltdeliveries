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

/* One comparison table (founder): the two networks share the same
   variables — express speed, bulky speed, bulk pricing — and the
   verdict lives in the highlighted double-✕ row: neither network
   gives you bulky speed. */

const CMP = [
  {
    name: "Express Courier Network",
    sub: "Built for small parcels",
    hack: "Hack 1",
  },
  {
    name: "LTL Network",
    sub: "Built for bulk aggregation",
    hack: "Hack 2",
  },
];

const ROWS = [
  {
    label: "Express speed",
    note: "Same-day / next-day",
    marks: [true, false],
  },
  {
    label: "Bulky speed",
    note: "Your 200kg+ shipment",
    marks: [false, false],
    highlight: true,
  },
  {
    label: "Bulk pricing",
    note: "Freight economics at scale",
    marks: [false, true],
  },
];

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
          <PointerHighlight pointerClassName="h-4 w-4">
            <em>never built for you.</em>
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
          surviving on workarounds—hacking logistics models designed for
          entirely different categories.
        </motion.p>

        <motion.div
          variants={rv}
          custom={2}
          initial={animateIn ? "hidden" : false}
          animate={show as never}
          className={styles.cmpTable}
        >
          <div className={styles.cmpHeadRow}>
            <span className={styles.cmpLabel} />
            {CMP.map((col) => (
              <span key={col.name} className={styles.cmpCol}>
                <span className={styles.hackTag}>{col.hack}</span>
                <span className={cn(sg.className, styles.cmpColTitle)}>
                  {col.name}
                </span>
                <span className={styles.cmpSub}>{col.sub}</span>
              </span>
            ))}
          </div>
          {ROWS.map((row) => (
            <div
              key={row.label}
              className={cn(styles.cmpRow, row.highlight && styles.cmpHi)}
            >
              <span className={styles.cmpLabel}>
                {row.label}
                <i>{row.note}</i>
              </span>
              {row.marks.map((ok, i) => (
                <span
                  key={i}
                  className={cn(styles.cmpCell, ok && styles.cmpCellOk)}
                >
                  {ok ? "✓" : "✕"}
                </span>
              ))}
            </div>
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
