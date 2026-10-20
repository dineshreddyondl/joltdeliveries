"use client";

/**
 * Why Now — narrative section · Brief 05 (claim-corrected)
 * Frozen v5 port: dark `#08080A` band, sec-tag, H2, lede, 3-node
 * timeline, footnote, "▸ Until JOLT." term line. Copy per Brief 05
 * (audit replacements: invented day-counts dropped, "killed" softened,
 * hedged 3x rotation with footnote, "cleanest" not "fastest").
 */

import { Space_Grotesk } from "next/font/google";
import { motion, type Variants } from "motion/react";

import { FOOTNOTES } from "@/lib/metrics-data";
import { useReveal } from "@/components/ui/use-reveal";
import { cn } from "@/lib/utils";
import styles from "./why-now.module.css";

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

const ITEMS = [
  {
    n: "01",
    t: "The Expectation Gap",
    p: "Quick commerce reset delivery expectations across Indian commerce. Buyers now expect parcel-speed for 200kg payloads. Traditional freight was built around consolidation, not speed.",
  },
  {
    n: "02",
    t: "The Working Capital Trap",
    p: "Long transit times are a cash trap for your distributors. Every day in transit is dead capital. Up to 3x faster rotation of in-transit working capital on our longest lanes.",
  },
  {
    n: "03",
    t: "The Tech Unlock",
    p: "The capacity always existed on the Indian rail network — the cleanest way to move weight across India. But it was a black box. We built the orchestration tech to stitch it end-to-end and back it with a guaranteed SLA.",
  },
];

export function WhyNow() {
  const { ref, animateIn, inView } = useReveal<HTMLElement>();
  const show = animateIn ? (inView ? "show" : "hidden") : false;

  return (
    <section
      id="why"
      ref={ref}
      aria-labelledby="why-heading"
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
          Why Now
        </motion.span>

        <motion.h2
          id="why-heading"
          variants={rv}
          custom={1}
          initial={animateIn ? "hidden" : false}
          animate={show as never}
          className={cn(sg.className, styles.h2)}
        >
          Your customers won&rsquo;t wait for anything anymore.
        </motion.h2>

        <motion.p
          variants={rv}
          custom={2}
          initial={animateIn ? "hidden" : false}
          animate={show as never}
          className={styles.lede}
        >
          Heavy commerce moved online. Logistics didn&rsquo;t.
        </motion.p>

        <div className={styles.timeline}>
          {ITEMS.map((item, i) => (
            <motion.div
              key={item.n}
              variants={rv}
              custom={i}
              initial={animateIn ? "hidden" : false}
              animate={show as never}
              className={styles.tlItem}
            >
              <div className={styles.tlNode}>
                <span>{item.n}</span>
              </div>
              <h3 className={sg.className}>{item.t}</h3>
              <p>{item.p}</p>
            </motion.div>
          ))}
        </div>

        <motion.p
          variants={rv}
          custom={4}
          initial={animateIn ? "hidden" : false}
          animate={show as never}
          className={styles.footnote}
        >
          <sup aria-hidden="true">‡</sup>
          {FOOTNOTES.capital}
        </motion.p>

        <motion.div
          variants={rv}
          custom={5}
          initial={animateIn ? "hidden" : false}
          animate={show as never}
          className={styles.termLine}
        >
          <span className={styles.prompt}>▸</span>Until JOLT.
        </motion.div>
      </div>
    </section>
  );
}
