"use client";

/**
 * How It Works — The Orchestration Layer · V0.1 restructure (founder 2026-10-19)
 *
 * The solution + USP section. Restructured from three dense paragraphs to a
 * low-density, journey-first layout:
 *   H2 → one-line lede → horizontal journey pipeline (FIRST MILE → RAIL
 *   LINEHAUL → LAST MILE with the travelling dot) → three compact USP cards
 *   (NTO / HUBLESS / VISIBILITY, one line each + mono spec) → CO₂ footnote.
 *
 * Copy changes in this pass (flagged to founder):
 * - H2: founder's new sentence "We built the purpose-built layer for express
 *   heavy commerce — the fastest, from first mile to last mile."
 * - Lede: black-box/cleanest-weight duplication vs Why Now removed.
 * - 89% CO₂ now carries its required footnote (NITI Aayog, SFC India 2025).
 * - "absolute visibility" → "every milestone tracked".
 */

import { Space_Grotesk } from "next/font/google";
import { motion, type Variants } from "motion/react";

import { useReveal } from "@/components/ui/use-reveal";
import { cn } from "@/lib/utils";
import styles from "./how-it-works.module.css";

const sg = Space_Grotesk({
  subsets: ["latin"],
  weight: ["600", "700"],
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

const STAGES = [
  {
    idx: "01",
    name: "First Mile",
    sub: "Scheduled road pickup",
    hot: false,
  },
  {
    idx: "02",
    name: "Just-in-Time Linehaul",
    sub: "Next Train Out · no stops",
    hot: true,
  },
  {
    idx: "03",
    name: "Direct Delivery",
    sub: "Right to your distributor",
    hot: false,
  },
];

const USPS = [
  {
    step: "01 / NTO",
    word: "Faster",
    line: "Just-in-time linehaul on scheduled express trains.",
    spec: "Up to 89% less CO₂ per tonne-km vs road",
  },
  {
    step: "02 / HUBLESS",
    word: "Seamless",
    line: "One motion from first mile to last. Almost zero stops.",
    spec: "No mid-journey sorting",
  },
  {
    step: "03 / VISIBILITY",
    word: "Live",
    line: "Live tracking at every milestone — not intermittent like traditional models.",
    spec: "Guaranteed SLA",
  },
];

export function HowItWorks() {
  const { ref, animateIn, inView } = useReveal<HTMLElement>();
  const show = animateIn ? (inView ? "show" : "hidden") : false;

  return (
    <section
      id="how"
      ref={ref}
      aria-labelledby="how-heading"
      className={styles.sec}
    >
      <div className={styles.grain} aria-hidden="true" />
      <div className={styles.wrap}>
        <motion.span
          variants={rv}
          custom={0}
          initial={animateIn ? "hidden" : false}
          animate={show as never}
          className={styles.tag}
        >
          The Orchestration Layer
        </motion.span>

        <motion.h2
          id="how-heading"
          variants={rv}
          custom={1}
          initial={animateIn ? "hidden" : false}
          animate={show as never}
          className={cn(sg.className, styles.h2)}
        >
          A <em>purpose-built express layer</em> for heavy commerce — not
          another bidding board or marketplace.
        </motion.h2>

        <motion.p
          variants={rv}
          custom={2}
          initial={animateIn ? "hidden" : false}
          animate={show as never}
          className={styles.lede}
        >
          We don&rsquo;t match loads and hope. Every shipment moves
          just-in-time — first mile, linehaul, last mile — with almost zero
          stops in between.
        </motion.p>

        {/* Journey pipeline — the section's hero. CSS loop; reduced-motion
            renders the completed static journey. */}
        <motion.div
          variants={rv}
          custom={3}
          initial={animateIn ? "hidden" : false}
          animate={show as never}
          className={styles.pipeline}
          aria-hidden="true"
        >
          <div className={styles.track}>
            <div className={styles.fill} />
            <div className={styles.dot} />
            <div className={cn(styles.stop, styles.s0)}>
              <div className={styles.psDot} />
            </div>
            <div className={cn(styles.stop, styles.s50)}>
              <div className={styles.psDot} />
            </div>
            <div className={cn(styles.stop, styles.s100)}>
              <div className={styles.psDot} />
            </div>
          </div>
          <div className={styles.stageRow}>
            {STAGES.map((s) => (
              <div
                key={s.idx}
                className={cn(styles.stage, s.hot && styles.stageHot)}
              >
                <span className={styles.stageIdx}>{s.idx}</span>
                <span className={cn(sg.className, styles.stageName)}>
                  {s.name}
                </span>
                <span className={styles.stageSub}>{s.sub}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <div className={styles.usps}>
          {USPS.map((u, i) => (
            <motion.div
              key={u.step}
              variants={rv}
              custom={i + 3}
              initial={animateIn ? "hidden" : false}
              animate={show as never}
              className={styles.usp}
            >
              <span className={styles.step}>{u.step}</span>
              <h3 className={sg.className}>{u.word}</h3>
              <p>{u.line}</p>
              <span className={styles.spec}>{u.spec}</span>
            </motion.div>
          ))}
        </div>

        <motion.p
          variants={rv}
          custom={6}
          initial={animateIn ? "hidden" : false}
          animate={show as never}
          className={styles.footnote}
        >
          <sup aria-hidden="true">‡</sup>
          vs road freight per tonne-km · NITI Aayog, SFC India 2025
        </motion.p>
      </div>
    </section>
  );
}
