"use client";

/**
 * Ecosystem — Live Across Your Logistics Ecosystem · Brief 07
 * Frozen v5 port: dark band, two full-bleed audience bands
 * (B2B Replenishment / D2C Heavy Delivery), generic capability
 * marquee. Copy per Brief 07: no invented numbers, brand names
 * removed (unverified relationships — AGENTS guardrail).
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

const MARQUEE = ["REST APIs", "Webhooks", "EDI", "Custom REST APIs"];

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
      </div>

      {/* ---------- B2B band ---------- */}
      <motion.div
        variants={rv}
        custom={3}
        initial={animateIn ? "hidden" : false}
        animate={show as never}
        className={cn(styles.band, styles.bandB2b)}
      >
        <div className={styles.bandInner}>
          <div className={styles.bandSide}>
            <span className={styles.bandTag}>For Your Distributors</span>
            <h3 className={sg.className}>B2B Replenishment</h3>
          </div>
          <p>
            Guaranteed 24-48 hour arrivals mean your distributors stop holding
            defensive buffer stock. It compresses working capital cycles, kills
            out-of-stock losses, and unlocks trapped cash.
          </p>
        </div>
      </motion.div>

      {/* ---------- D2C band ---------- */}
      <motion.div
        variants={rv}
        custom={4}
        initial={animateIn ? "hidden" : false}
        animate={show as never}
        className={cn(styles.band, styles.bandD2c)}
      >
        <div className={styles.bandInner}>
          <div className={styles.bandSide}>
            <span className={styles.bandTag}>For Your Consumers</span>
            <h3 className={sg.className}>D2C Heavy Delivery</h3>
          </div>
          <p>
            Consumers won&rsquo;t wait for heavy purchases. Give them a
            courier-grade post-purchase experience. Drop your cart
            cancellations and eliminate doorstep rejections on your heaviest
            items.
          </p>
        </div>
      </motion.div>

      {/* ---------- Generic capability marquee ---------- */}
      <div className={styles.wrap}>
        <motion.div
          variants={rv}
          custom={5}
          initial={animateIn ? "hidden" : false}
          animate={show as never}
          className={styles.marquee}
          aria-hidden="true"
        >
          <div className={styles.marqueeTrack}>
            {[...MARQUEE, ...MARQUEE].map((item, i) => (
              <span key={i} className={styles.mqItem}>
                {item}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
