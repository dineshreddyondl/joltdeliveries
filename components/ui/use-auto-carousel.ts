"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

/**
 * Auto-advancing horizontal carousel with dot index.
 * - Advances every `interval` ms; loops back to the start.
 * - Pauses on pointer/touch interaction, resumes after `resume` ms.
 * - Reduced motion: no auto-advance (manual swipe only).
 */
export function useAutoCarousel<T extends HTMLElement>(
  count: number,
  { interval = 3600, resume = 6000 } = {},
) {
  const ref = useRef<T | null>(null);
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || count <= 1 || reduce) return;

    const go = (n: number) => {
      const i = ((n % count) + count) % count;
      const child = el.children[i] as HTMLElement | undefined;
      if (!child) return;
      const pad = parseFloat(getComputedStyle(el).paddingLeft) || 0;
      el.scrollTo({ left: child.offsetLeft - pad, behavior: "smooth" });
      setIndex(i);
    };

    let paused = false;
    let timer: ReturnType<typeof setInterval> | null = null;
    let resumeTimer: ReturnType<typeof setTimeout> | null = null;
    const start = () => {
      if (timer) clearInterval(timer);
      timer = setInterval(() => {
        if (!paused) {
          const cur = Math.round(el.scrollLeft / (el.children[0]?.clientWidth || 1));
          go(cur + 1);
        }
      }, interval);
    };
    const pause = () => {
      paused = true;
      if (resumeTimer) clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => {
        paused = false;
      }, resume);
    };

    start();
    el.addEventListener("pointerdown", pause);
    el.addEventListener("touchstart", pause);
    el.addEventListener(
      "scroll",
      () => {
        const w = el.children[0]?.clientWidth || 1;
        setIndex(Math.min(count - 1, Math.max(0, Math.round(el.scrollLeft / w))));
      },
      { passive: true },
    );
    return () => {
      if (timer) clearInterval(timer);
      if (resumeTimer) clearTimeout(resumeTimer);
      el.removeEventListener("pointerdown", pause);
      el.removeEventListener("touchstart", pause);
    };
  }, [count, interval, resume, reduce]);

  const goTo = (n: number) => {
    const el = ref.current;
    if (!el) return;
    const child = el.children[n] as HTMLElement | undefined;
    if (!child) return;
    const pad = parseFloat(getComputedStyle(el).paddingLeft) || 0;
    el.scrollTo({ left: child.offsetLeft - pad, behavior: "smooth" });
    setIndex(n);
  };

  return { ref, index, goTo };
}
