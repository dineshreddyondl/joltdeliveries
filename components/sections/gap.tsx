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
    badge: "Hack 1",
    tone: "courier",
    title: "Express Courier Network",
    sub: "Built for small parcels",
    points: [
      "Heavy goods get damaged in parcel networks",
      "Dimensional pricing destroys your unit economics",
    ],
  },
  {
    badge: "Hack 2",
    tone: "freight",
    title: "LTL Network",
    sub: "Built for bulk aggregation",
    points: [
      "Your shipment idles in hub yards, waiting for volume",
      "You save money — and lose a week",
    ],
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
              <div className={styles.trapHead}>
                <div>
                  <h3 className={sg.className}>{trap.title}</h3>
                  <span className={styles.sub}>{trap.sub}</span>
                </div>
                <span className={styles.sideBadge}>{trap.badge}</span>
              </div>
              <div className={styles.pts}>
                {trap.points.map((pt) => (
                  <p key={pt} className={styles.pt}>
                    <i aria-hidden="true" />
                    {pt}
                  </p>
                ))}
              </div>
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
