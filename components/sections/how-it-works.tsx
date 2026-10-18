"use client";

/**
 * How It Works — The Orchestration Layer · Brief 06 (claim-corrected)
 * Frozen v5 port: dark band, sec-tag, H2, lede, pipeline (CSS-only
 * loop) and three columns (NTO / HUBLESS / VISIBILITY). Copy per
 * Brief 06: scoped "fastest mid-mile", "cleanest" rail, domestic-lane
 * wording, "up to 89% less CO₂ per tonne-km" + footnote, honest
 * consolidation wording.
 */

import { Space_Grotesk } from "next/font/google";
import { motion, type Variants } from "motion/react";

import { FOOTNOTES } from "@/lib/metrics-data";
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

const COLS = [
  {
    step: "01 / NTO",
    title: "Next Train Out (NTO) Speed",
    body: "Aviation has Next Flight Out. We built Next Train Out for heavy commerce. Your payload doesn\u2019t wait for a truck to fill up. High-capacity rail bypasses highway tolls and traffic to deliver non-stop linehaul \u2014 up to 89% less CO\u2082 per tonne-km vs road.",
  },
  {
    step: "02 / HUBLESS",
    title: "End-to-End Hubless Execution",
    body: "From first-mile pickup to final-mile delivery. No multi-day consolidation waits. No waiting in truck hubs. We pick up your payload, load it directly onto the rail linehaul, and deliver it straight to the destination. One seamless motion. Zero mid-journey sorting delays.",
  },
  {
    step: "03 / VISIBILITY",
    title: "Control Tower Visibility",
    body: "Real-time tracking across every milestone. Rail used to be a blind spot. Our tech gives your ops team proactive alerts and absolute visibility, allowing us to guarantee the SLA.",
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
          Not another marketplace. We built the intelligence to unlock the
          fastest mid-mile network in India.
        </motion.h2>

        <motion.p
          variants={rv}
          custom={2}
          initial={animateIn ? "hidden" : false}
          animate={show as never}
          className={styles.lede}
        >
          Marketplaces match supply and demand, then wash their hands of the
          SLA. We don&rsquo;t. Indian rail was always the cleanest way to move
          weight. It was just an analog black box. We built the tech to run it
          end-to-end, and we take full accountability for the delivery.
        </motion.p>

        {/* Pipeline — CSS-only loop (reduced-motion → completed static) */}
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
        </motion.div>

        <div className={styles.cols}>
          {COLS.map((col, i) => (
            <motion.div
              key={col.step}
              variants={rv}
              custom={i + 3}
              initial={animateIn ? "hidden" : false}
              animate={show as never}
              className={styles.col}
            >
              <span className={styles.step}>{col.step}</span>
              <h3 className={sg.className}>{col.title}</h3>
              <p>{col.body}</p>
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
          <sup aria-hidden="true">†</sup>
          {FOOTNOTES.co2}
        </motion.p>
      </div>
    </section>
  );
}
