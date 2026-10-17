"use client";

/**
 * Number Ticker — Magic UI (MIT).
 * Source: https://magicui.design/docs/components/number-ticker
 *
 * Copy-pasted source, adapted for this repo:
 *  - motion APIs imported only from `motion/react` (brief requirement)
 *  - `cn` from the dependency-free local `@/lib/utils`
 *  - renders `children` so the final value is server-rendered (no "0" flash
 *    before hydration / before the count-up triggers)
 */

import { useInView, useMotionValue, useSpring } from "motion/react";
import { ComponentPropsWithoutRef, useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

interface NumberTickerProps extends ComponentPropsWithoutRef<"span"> {
  value: number;
  direction?: "up" | "down";
  delay?: number;
  decimalPlaces?: number;
}

export function NumberTicker({
  value,
  direction = "up",
  delay = 0,
  decimalPlaces = 0,
  className,
  children,
  ...props
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(direction === "down" ? value : 0);
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  });
  const isInView = useInView(ref, { once: true, margin: "0px" });

  useEffect(() => {
    if (isInView) {
      const timeoutId = setTimeout(() => {
        motionValue.set(direction === "down" ? 0 : value);
      }, delay * 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [motionValue, isInView, delay, value, direction]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Intl.NumberFormat("en-US", {
          minimumFractionDigits: decimalPlaces,
          maximumFractionDigits: decimalPlaces,
        }).format(Number(latest.toFixed(decimalPlaces)));
      }
    });
    return unsubscribe;
  }, [springValue, decimalPlaces]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)} {...props}>
      {children}
    </span>
  );
}
