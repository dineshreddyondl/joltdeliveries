"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

/**
 * Shared scroll-reveal hook (house pattern — same as MetricsBand):
 * SSR + first client render ship visible content (no hydration mismatch);
 * after mount, non-reduced users animate from hidden once when the section
 * scrolls into view; reduced-motion users stay static.
 *
 * Usage:
 *   const { ref, animateIn, inView } = useReveal();
 *   const show = animateIn ? (inView ? "show" : "hidden") : false;
 *   <motion.div ref={ref} variants={rv} initial={animateIn ? "hidden" : false}
 *              animate={show as never}>…
 */

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function useReveal<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T | null>(null);
  const inView = useInView(ref as never, { once: true, margin: "-60px 0px" });
  const reduceMotion = useReducedMotion();
  const [ready, setReady] = useState(false);
  useIsomorphicLayoutEffect(() => setReady(true), []);
  const animateIn = ready && !reduceMotion;
  return { ref, inView, animateIn };
}
