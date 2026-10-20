"use client";

/**
 * Mobile section navigation — founder concept v1:
 * - Four pure dots (Why / Gap / How / Solutions); the active one
 *   shows its tiny mono number and stretches into an orange bar.
 * - Scrollspy via scroll position; tap jumps to the section.
 * - Appears only after the hero scrolls away; hidden ≥lg.
 * - The pilot CTA lives as a separate floating bubble (FAB) with a
 *   hover/press label, above the dots, opening the pilot flow.
 */

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import styles from "./mobile-nav.module.css";

const SECTIONS = [
  { id: "why", n: "01", label: "Why Now" },
  { id: "gap", n: "02", label: "The Gap" },
  { id: "how", n: "03", label: "How It Works" },
  { id: "eco", n: "04", label: "Solutions" },
];

export function MobileNav() {
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(0);
  const [fabLabel, setFabLabel] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.9);
      const probe = window.scrollY + window.innerHeight * 0.45;
      let cur = 0;
      SECTIONS.forEach((s, i) => {
        const el = document.getElementById(s.id);
        if (el && el.offsetTop <= probe) cur = i;
      });
      setActive(cur);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const jump = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.nav
            initial={{ y: 90, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 90, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="fixed inset-x-4 bottom-4 z-[1050] lg:hidden"
            aria-label="Page sections"
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
          >
            <div className="flex items-center justify-center gap-7 rounded-2xl border border-[#E4E0D6] bg-white/90 px-4 py-3.5 shadow-[0_8px_30px_rgba(12,14,9,0.12)] backdrop-blur-md">
              {SECTIONS.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  aria-label={s.label}
                  aria-current={i === active ? "true" : undefined}
                  onClick={() => jump(s.id)}
                  className="relative flex h-7 w-7 items-center justify-center"
                >
                  <span
                    className={cn(
                      "block rounded-full transition-all duration-300",
                      i === active
                        ? "h-[5px] w-[18px] rounded-[2.5px] bg-[#E85A2C] shadow-[0_0_8px_rgba(232,90,44,0.5)]"
                        : "h-1.5 w-1.5 bg-[rgba(12,14,9,0.18)]",
                    )}
                  />
                  <span
                    className={cn(
                      "pointer-events-none absolute -top-3 font-mono text-[7px] tracking-[0.08em] text-[#C2410C] transition-opacity duration-200",
                      i === active ? "opacity-100" : "opacity-0",
                    )}
                  >
                    {s.n}
                  </span>
                </button>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {visible && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.08 }}
            type="button"
            aria-label="Start Pilot"
            onMouseEnter={() => setFabLabel(true)}
            onMouseLeave={() => setFabLabel(false)}
            onTouchStart={() => setFabLabel(true)}
            onTouchEnd={() => setTimeout(() => setFabLabel(false), 1600)}
            onClick={() => window.dispatchEvent(new Event("jolt:open-pilot"))}
            className={cn(
              "fixed bottom-[92px] right-4 z-[1050] flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-b from-[#E85A2C] to-[#C2410C] text-white shadow-[0_10px_24px_rgba(232,90,44,0.4)] lg:hidden",
              styles.fab,
            )}
            style={{ marginBottom: "env(safe-area-inset-bottom)" }}
          >
            <span className={styles.pulseRing} aria-hidden="true" />
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
              aria-hidden="true"
            >
              <path d="M5 12l14-7-4.5 14-2.5-6-7-1z" />
            </svg>
            <motion.span
              initial={false}
              animate={{ opacity: fabLabel ? 1 : 0, x: fabLabel ? 0 : 6 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-none absolute right-[64px] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-[#08080A] px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-white"
            >
              Start Pilot
            </motion.span>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
