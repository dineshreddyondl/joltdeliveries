"use client";

/**
 * PointerHighlight — ported from Aceternity UI (MIT), theme-adapted.
 * A rectangle that draws itself around a phrase (1s ease-in-out) while a
 * cursor arrow slides to the bottom-right corner — the "annotation"
 * highlight treatment.
 *
 * JOLT adaptations (recorded):
 * - rectangle border neutral-800/200 -> our accent #C2410C
 * - pointer blue-500 -> our accent #E85A2C
 * - overlay is aria-hidden (decoration only; text stays readable)
 * - prefers-reduced-motion: static full rectangle + corner pointer,
 *   no draw-in animation
 */

import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode, type SVGProps } from "react";

export function PointerHighlight({
  children,
  rectangleClassName,
  pointerClassName,
  containerClassName,
  onComplete,
  pointerInset = 2,
  showPointer = true,
}: {
  children: ReactNode;
  rectangleClassName?: string;
  pointerClassName?: string;
  containerClassName?: string;
  /** Fired once when the draw-in animation finishes (or immediately in
      reduced motion, where the static final state renders). */
  onComplete?: () => void;
  /** Pulls the pointer in from the box corner (negative = inside). */
  pointerInset?: number;
  /** Hide the corner pointer glyph (box draw-in only). */
  showPointer?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const reduceMotion = useReducedMotion();
  const firedRef = useRef(false);

  const fire = () => {
    if (!firedRef.current) {
      firedRef.current = true;
      onComplete?.();
    }
  };

  /* Reduced motion: no draw-in runs, so report completion once the box
     has dimensions. */
  useEffect(() => {
    if (reduceMotion && dimensions.width > 0 && dimensions.height > 0) {
      fire();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fire is stable
  }, [reduceMotion, dimensions.width, dimensions.height]);

  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      const { width, height } = el.getBoundingClientRect();
      setDimensions({ width, height });
    }
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({ width, height });
      }
    });
    if (el) resizeObserver.observe(el);
    return () => {
      if (el) resizeObserver.unobserve(el);
    };
  }, []);

  const { width, height } = dimensions;

  return (
    <div
      className={cn("relative inline-block w-fit", containerClassName)}
      ref={containerRef}
    >
      {children}
      {width > 0 && height > 0 && !reduceMotion && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-0"
          aria-hidden="true"
          initial={{ opacity: 0, scale: 0.95, originX: 0, originY: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <motion.div
            className={cn(
              "absolute inset-0 border border-[#C2410C]",
              rectangleClassName,
            )}
            initial={{ width: 0, height: 0 }}
            whileInView={{ width, height }}
            transition={{ duration: 1, ease: "easeInOut" }}
            onAnimationComplete={fire}
          />
          <motion.div
            className="pointer-events-none absolute"
            initial={{ opacity: showPointer ? 0 : 0 }}
            whileInView={{
              opacity: showPointer ? 1 : 0,
              x: width + pointerInset,
              y: height + pointerInset,
            }}
            style={{ rotate: -90 }}
            transition={{
              opacity: { duration: 0.1, ease: "easeInOut" },
              duration: 1,
              ease: "easeInOut",
            }}
          >
            <Pointer
              className={cn("h-5 w-5 text-[#E85A2C]", pointerClassName)}
            />
          </motion.div>
        </motion.div>
      )}
      {width > 0 && height > 0 && reduceMotion && (
        /* Static final state for reduced motion — no draw-in, no slide. */
        <div
          className="pointer-events-none absolute inset-0 z-0"
          aria-hidden="true"
        >
          <div
            className={cn(
              "absolute inset-0 border border-[#C2410C]",
              rectangleClassName,
            )}
          />
          <div
            className="absolute"
            style={{
              transform: `translate(${width + 2}px, ${height + 2}px) rotate(-90deg)`,
            }}
          >
            <Pointer
              className={cn("h-5 w-5 text-[#E85A2C]", pointerClassName)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

const Pointer = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 16 16"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z"></path>
    </svg>
  );
};
