"use client";

/**
 * Ecosystem — Live Across Your Logistics Ecosystem · Brief 07
 * Founder direction (2026-10-20):
 * - Use cases condensed (B2B Distributor Movement / B2C Customer
 *   Movement, intercity or intracity, same solution).
 * - After heading + supporting statement: the INTEGRATED PLATFORM
 *   LIST in the style of Aceternity's feature-block-animated-card
 *   (hover beams + glow, staggered reveal). Platform names come from
 *   the frozen benchmark marquee (SAP · Oracle · Clickpost · Pando ·
 *   eShipz · Custom REST APIs).
 *   GUARDRAIL FLAG: brand names ship per founder request — the
 *   verified-relationship re-check stays on the final review list.
 */

import { Space_Grotesk } from "next/font/google";
import { motion, type Variants } from "motion/react";

import { useReveal } from "@/components/ui/use-reveal";
import { cn } from "@/lib/utils";
import styles from "./ecosystem.module.css";

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

const PLATFORMS = [
  { name: "SAP", role: "Enterprise ERP" },
  { name: "Oracle", role: "Cloud SCM" },
  { name: "Clickpost", role: "Post-purchase & tracking" },
  { name: "Pando", role: "Transport management" },
  { name: "eShipz", role: "Shipping automation" },
  { name: "Custom REST APIs", role: "Your own stack" },
];

export function Ecosystem() {
  const { ref, animateIn, inView } = useReveal<HTMLElement>();
  const show = animateIn ? (inView ? "show" : "hidden") : false;

  return (
    <section
      id="eco"
      ref={ref}
      aria-labelledby="eco-heading"
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
          Live Across Your Logistics Ecosystem
        </motion.span>

        <motion.h2
          id="eco-heading"
          variants={rv}
          custom={1}
          initial={animateIn ? "hidden" : false}
          animate={show as never}
          className={cn(sg.className, styles.h2)}
        >
          No integration effort. We&rsquo;re already live where you are.
        </motion.h2>

        <motion.p
          variants={rv}
          custom={2}
          initial={animateIn ? "hidden" : false}
          animate={show as never}
          className={styles.lede}
        >
          Express SLAs for your distributors and your end-consumers. Zero IT
          overhaul required — our API plugs into your existing stack. Just
          switch us on.
        </motion.p>

        {/* Integrated platform list — feature-block-animated-card style:
            hover beams + glow, staggered reveal. */}
        <div className={styles.platforms}>
          {PLATFORMS.map((p, i) => (
            <motion.div
              key={p.name}
              variants={rv}
              custom={i + 3}
              initial={animateIn ? "hidden" : false}
              animate={show as never}
              className={styles.pCard}
            >
              <svg
                className={cn(styles.beam, styles.beamA)}
                viewBox="0 0 120 120"
                aria-hidden="true"
              >
                <rect x="10" y="58.5" width="100" height="3" rx="1.5" />
              </svg>
              <svg
                className={cn(styles.beam, styles.beamB)}
                viewBox="0 0 120 120"
                aria-hidden="true"
              >
                <rect x="10" y="58.5" width="100" height="3" rx="1.5" />
              </svg>
              <span className={styles.pRole}>{p.role}</span>
              <h3 className={sg.className}>{p.name}</h3>
            </motion.div>
          ))}
        </div>

        {/* Two movement types, one line each. */}
        <div className={styles.cases}>
          <motion.div
            variants={rv}
            custom={3}
            initial={animateIn ? "hidden" : false}
            animate={show as never}
            className={styles.caseCard}
          >
            <span className={styles.caseTag}>For Distributors</span>
            <h3 className={sg.className}>B2B Distributor Movement</h3>
            <p>Replenishment without buffer stock.</p>
          </motion.div>
          <motion.div
            variants={rv}
            custom={4}
            initial={animateIn ? "hidden" : false}
            animate={show as never}
            className={styles.caseCard}
          >
            <span className={styles.caseTag}>For Consumers</span>
            <h3 className={sg.className}>B2C Customer Movement</h3>
            <p>Courier-grade delivery for heavy purchases.</p>
          </motion.div>
        </div>

        <motion.p
          variants={rv}
          custom={5}
          initial={animateIn ? "hidden" : false}
          animate={show as never}
          className={styles.distance}
        >
          Intercity or intracity — the same network, the same SLA.
        </motion.p>

        <motion.p
          variants={rv}
          custom={6}
          initial={animateIn ? "hidden" : false}
          animate={show as never}
          className={cn(sg.className, styles.same)}
        >
          The solution remains the same. <em>Faster than ever.</em>
        </motion.p>
      </div>
    </section>
  );
}
