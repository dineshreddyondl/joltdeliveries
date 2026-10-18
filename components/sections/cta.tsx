"use client";

/**
 * Challenge CTA — Brief 08 · frozen v5 port with real wiring.
 * "Check Active Routes" scrolls to the hero lanes table (#live-lanes);
 * "Start Pilot" opens the real 3-step pilot dialog (jolt:open-pilot).
 * Fineprint cross-references the SLA page (money-back remedy, §0 #3).
 */

import { Space_Grotesk } from "next/font/google";
import { motion, type Variants } from "motion/react";

import { useReveal } from "@/components/ui/use-reveal";
import { cn } from "@/lib/utils";
import styles from "./cta.module.css";

const sg = Space_Grotesk({
  subsets: ["latin"],
  weight: ["700"],
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

export function Cta() {
  const { ref, animateIn, inView } = useReveal<HTMLElement>();
  const show = animateIn ? (inView ? "show" : "hidden") : false;

  return (
    <section
      id="cta"
      ref={ref}
      aria-labelledby="cta-heading"
      className={styles.sec}
    >
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.wrap}>
        <motion.span
          variants={rv}
          custom={0}
          initial={animateIn ? "hidden" : false}
          animate={show as never}
          className={styles.tag}
        >
          The JOLT Challenge
        </motion.span>

        <motion.h2
          id="cta-heading"
          variants={rv}
          custom={1}
          initial={animateIn ? "hidden" : false}
          animate={show as never}
          className={cn(sg.className, styles.h2)}
        >
          Try a pilot on any active route. If we miss the SLA,{" "}
          <span className={styles.u}>it&rsquo;s on us.</span>
        </motion.h2>

        <motion.p
          variants={rv}
          custom={2}
          initial={animateIn ? "hidden" : false}
          animate={show as never}
          className={styles.lede}
        >
          Supply chain leaders are tired of empty vendor promises. Let&rsquo;s
          look at the data. Pick a route from our live network and run a
          payload with JOLT. If we miss the guaranteed TAT, the shipment is
          free.
        </motion.p>

        <motion.div
          variants={rv}
          custom={3}
          initial={animateIn ? "hidden" : false}
          animate={show as never}
          className={styles.btns}
        >
          <a href="#live-lanes" className={styles.btnPrimary}>
            Check Active Routes
          </a>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event("jolt:open-pilot"))}
            className={styles.btnGhost}
          >
            Start Pilot
          </button>
        </motion.div>

        <motion.p
          variants={rv}
          custom={4}
          initial={animateIn ? "hidden" : false}
          animate={show as never}
          className={styles.fineprint}
        >
          *Conditions apply. Pilot SLA guarantees apply strictly to active,
          serviceable routes and are subject to payload specifications. See the{" "}
          <a href="/sla" className={styles.fineprintLink}>
            SLA policy
          </a>
          .
        </motion.p>
      </div>
    </section>
  );
}
