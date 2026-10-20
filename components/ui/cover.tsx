"use client";

/**
 * Cover — ported from Aceternity UI (MIT), adapted to the JOLT theme.
 * Source: https://ui.aceternity.com/registry/cover-demo.json
 *
 * A hover-reactive inline "cover" for words: sweeping orange gradient
 * beams, corner pulse dots, and — on hover — an ink fill with orange
 * sparkles (tsparticles) sweeping across and a playful text wiggle.
 *
 * JOLT adaptations (recorded):
 * - Beam gradients #2EB9DF/#3b82f6 → our accent #E85A2C + warm #FF9A6B.
 * - Hover fill neutral-900 → ink #0C0E09; sparkles #FFFFFF → #E85A2C.
 * - Base background transparent (the demo's neutral-100 chip) so the
 *   frozen hero blaze underline under "heavy shipments" stays visible.
 * - Corner dots tinted accent; decorative layers aria-hidden.
 * - prefers-reduced-motion: beams static, no sparkles, no wiggle.
 */

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";
import { SparklesCore } from "@/components/ui/sparkles";

export const Cover = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  const [hovered, setHovered] = useState(false);
  const reduceMotion = useReducedMotion();

  const ref = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [beamPositions, setBeamPositions] = useState<number[]>([]);

  /* Beams are spaced ~10px apart across the cover's height; recomputed on
     resize (the hero grid is fluid, so a ResizeObserver beats measuring
     once on mount). */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      setContainerWidth(el.clientWidth);
      const height = el.clientHeight;
      const count = Math.max(1, Math.floor(height / 10));
      setBeamPositions(
        Array.from(
          { length: count },
          (_, i) => ((i + 1) * height) / (count + 1),
        ),
      );
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      ref={ref}
      className="group/cover relative inline-block rounded-md transition-colors duration-200 hover:bg-[#0C0E09]"
    >
      {!reduceMotion && (
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ opacity: { duration: 0.2 } }}
              className="absolute inset-0 h-full w-full overflow-hidden"
              aria-hidden="true"
            >
              <motion.div
                animate={{ translateX: ["-50%", "0%"] }}
                transition={{
                  translateX: { duration: 18, ease: "linear", repeat: Infinity },
                }}
                className="flex h-full w-[200%]"
              >
                <SparklesCore
                  background="transparent"
                  minSize={0.4}
                  maxSize={1}
                  particleDensity={150}
                  speed={1.2}
                  className="h-full w-full"
                  particleColor="#E85A2C"
                />
                <SparklesCore
                  background="transparent"
                  minSize={0.4}
                  maxSize={1}
                  particleDensity={150}
                  speed={1.2}
                  className="h-full w-full"
                  particleColor="#E85A2C"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      <div aria-hidden="true">
        {beamPositions.map((position, index) => (
          <Beam
            key={index}
            hovered={hovered}
            frozen={!!reduceMotion}
            duration={Math.random() * 2 + 1}
            delay={Math.random() * 2 + 1}
            width={containerWidth}
            style={{ top: `${position}px` }}
          />
        ))}
      </div>

      <motion.span
        key={String(hovered)}
        animate={
          reduceMotion
            ? undefined
            : {
                scale: hovered ? 0.8 : 1,
                x: hovered ? [0, -30, 30, -30, 30, 0] : 0,
                y: hovered ? [0, 30, -30, 30, -30, 0] : 0,
              }
        }
        transition={{
          duration: 0.2,
          x: { duration: 0.2, repeat: Infinity, repeatType: "loop" },
          y: { duration: 0.2, repeat: Infinity, repeatType: "loop" },
          scale: { duration: 0.2 },
        }}
        className={cn(
          "relative z-20 inline-block text-[#0C0E09] transition-colors duration-200 group-hover/cover:text-white",
          className,
        )}
      >
        {children}
      </motion.span>

      <CircleIcon className="absolute -right-[2px] -top-[2px]" />
      <CircleIcon className="absolute -bottom-[2px] -right-[2px]" delay={0.4} />
      <CircleIcon className="absolute -left-[2px] -top-[2px]" delay={0.8} />
      <CircleIcon className="absolute -bottom-[2px] -left-[2px]" delay={1.6} />
    </div>
  );
};

const Beam = ({
  className,
  delay,
  duration,
  hovered,
  frozen,
  width = 600,
  ...svgProps
}: {
  className?: string;
  delay?: number;
  duration?: number;
  hovered?: boolean;
  frozen?: boolean;
  width?: number;
} & React.ComponentProps<typeof motion.svg>) => {
  const id = useId();

  return (
    <motion.svg
      width={width ?? "600"}
      height="1"
      viewBox={`0 0 ${width ?? "600"} 1`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("absolute inset-x-0 w-full", className)}
      {...svgProps}
    >
      <motion.path d={`M0 0.5H${width ?? "600"}`} stroke={`url(#svgGradient-${id})`} />

      <defs>
        <motion.linearGradient
          id={`svgGradient-${id}`}
          key={String(hovered)}
          gradientUnits="userSpaceOnUse"
          initial={{
            x1: "0%",
            x2: hovered ? "-10%" : "-5%",
            y1: 0,
            y2: 0,
          }}
          animate={
            frozen
              ? undefined
              : {
                  x1: "110%",
                  x2: hovered ? "100%" : "105%",
                  y1: 0,
                  y2: 0,
                }
          }
          transition={{
            duration: hovered ? 0.5 : (duration ?? 2),
            ease: "linear",
            repeat: Infinity,
            delay: hovered ? Math.random() * (1 - 0.2) + 0.2 : 0,
            repeatDelay: hovered ? Math.random() * (2 - 1) + 1 : (delay ?? 1),
          }}
        >
          <stop stopColor="#FF9A6B" stopOpacity="0" />
          <stop stopColor="#E85A2C" />
          <stop offset="1" stopColor="#E85A2C" stopOpacity="0" />
        </motion.linearGradient>
      </defs>
    </motion.svg>
  );
};

const CircleIcon = ({ className, delay }: { className?: string; delay?: number }) => {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none h-2 w-2 animate-pulse rounded-full bg-[#C2410C] opacity-20 group-hover/cover:bg-white",
        className,
      )}
      style={{ animationDelay: `${delay ?? 0}s` }}
    ></div>
  );
};
