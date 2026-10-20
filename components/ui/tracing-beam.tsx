"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Aceternity TracingBeam, themed for JOLT:
 * - Orange gradient beam (not the cyan/purple demo), muted base line.
 * - Leading dot stays orange.
 * - ResizeObserver keeps the SVG height in sync.
 * - Reduced motion: static beam, no springs.
 * - beamClassName lets callers position the beam column.
 */
export const TracingBeam = ({
  children,
  className,
  beamClassName = "-left-4 md:-left-20",
  dotClassName = "ml-[27px]",
  svgClassName = "ml-4",
}: {
  children: React.ReactNode;
  className?: string;
  beamClassName?: string;
  dotClassName?: string;
  svgClassName?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [svgHeight, setSvgHeight] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const update = () => setSvgHeight(el.offsetHeight);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y1 = useSpring(
    useTransform(scrollYProgress, [0, 0.8], [50, svgHeight]),
    { stiffness: 500, damping: 90 },
  );
  const y2 = useSpring(
    useTransform(scrollYProgress, [0, 1], [50, svgHeight - 200]),
    { stiffness: 500, damping: 90 },
  );

  const staticY1 = svgHeight * 0.3;
  const staticY2 = svgHeight * 0.85;

  return (
    <motion.div
      ref={ref}
      className={cn("relative h-full w-full", className)}
    >
      <div className={cn("absolute top-3", beamClassName)}>
        <motion.div
          transition={{ duration: 0.2, delay: 0.5 }}
          animate={{
            boxShadow:
              scrollYProgress.get() > 0
                ? "none"
                : "rgba(0, 0, 0, 0.24) 0px 3px 8px",
          }}
          className={cn("flex h-4 w-4 items-center justify-center rounded-full border border-[rgba(232,90,44,0.55)] shadow-sm", dotClassName)}
        >
          <motion.div
            transition={{ duration: 0.2, delay: 0.5 }}
            className="h-2 w-2 rounded-full bg-[#E85A2C]"
          />
        </motion.div>
        <svg
          viewBox={`0 0 20 ${svgHeight}`}
          width="20"
          height={svgHeight}
          className={cn("block", svgClassName)}
          aria-hidden="true"
        >
          <motion.path
            d={`M 1 0V -36 l 18 24 V ${svgHeight * 0.8} l -18 24V ${svgHeight}`}
            fill="none"
            stroke="rgba(139,139,144,0.3)"
            strokeWidth="1"
          />
          <motion.path
            d={`M 1 0V -36 l 18 24 V ${svgHeight * 0.8} l -18 24V ${svgHeight}`}
            fill="none"
            stroke="url(#jolt-beam)"
            strokeWidth="1.25"
            className="motion-reduce:hidden"
          />
          <defs>
            <motion.linearGradient
              id="jolt-beam"
              gradientUnits="userSpaceOnUse"
              x1="0"
              x2="0"
              y1={reduce ? staticY1 : y1}
              y2={reduce ? staticY2 : y2}
            >
              <stop stopColor="#E85A2C" stopOpacity="0" />
              <stop stopColor="#FF9A50" />
              <stop offset="0.325" stopColor="#E85A2C" />
              <stop offset="1" stopColor="#E85A2C" stopOpacity="0" />
            </motion.linearGradient>
          </defs>
        </svg>
      </div>
      <div ref={contentRef}>{children}</div>
    </motion.div>
  );
};
