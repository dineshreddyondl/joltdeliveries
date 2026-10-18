"use client";

/**
 * Customer marquee — frozen v5 port (lines 735–747).
 * Restored per founder instruction (2026-10-19): benchmark fidelity.
 * Brand names ship on the founder's explicit direction — relationship
 * verification is his call, recorded here.
 */

import { Space_Grotesk } from "next/font/google";
import { motion, type Variants } from "motion/react";

import { useReveal } from "@/components/ui/use-reveal";
import { cn } from "@/lib/utils";
import styles from "./customer-marquee.module.css";

const sg = Space_Grotesk({
  subsets: ["latin"],
  weight: ["600"],
  display: "swap",
});

const rv: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

const ITEMS = ["Ather", "Wakefit", "Ola Electric", "Duroflex"];

function Spark() {
  return (
    <svg className={styles.spark} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2 Q12 12 22 12 Q12 12 12 22 Q12 12 2 12 Q12 12 12 2 Z" />
    </svg>
  );
}

export function CustomerMarquee() {
  const { ref, animateIn, inView } = useReveal<HTMLDivElement>();
  const show = animateIn ? (inView ? "show" : "hidden") : false;

  return (
    <motion.div
      ref={ref}
      variants={rv}
      initial={animateIn ? "hidden" : false}
      animate={show as never}
      className={styles.marquee}
      aria-hidden="true"
    >
      <div className={styles.track}>
        {[...ITEMS, ...ITEMS].map((name, i) => (
          <span key={i} className={cn(sg.className, styles.item)}>
            {name}
            <Spark />
          </span>
        ))}
      </div>
    </motion.div>
  );
}
