"use client";

import React, { useEffect, useState } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

export function Button({
  borderRadius = "1.75rem",
  children,
  as: Component = "button",
  containerClassName,
  borderClassName,
  duration,
  className,
  ...otherProps
}: {
  borderRadius?: string;
  children: React.ReactNode;
  as?: React.ElementType;
  containerClassName?: string;
  borderClassName?: string;
  duration?: number;
  className?: string;
  [key: string]: unknown;
}) {
  return (
    <Component
      className={cn(
        "relative h-16 w-40 overflow-hidden bg-transparent p-[1px] text-xl",
        containerClassName,
      )}
      style={{ borderRadius: borderRadius }}
      {...(otherProps as Record<string, unknown>)}
    >
      <div
        className="absolute inset-0"
        style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
      >
        <MovingBorder duration={duration} rx="30%" ry="30%">
          <div
            className={cn(
              "h-20 w-20 rounded-full bg-[radial-gradient(#E85A2C_40%,transparent_60%)] opacity-80",
              borderClassName,
            )}
          />
        </MovingBorder>
      </div>

      <div
        className={cn(
          "relative flex h-full w-full items-center justify-center border border-slate-800 bg-slate-900/[0.8] text-sm text-white antialiased backdrop-blur-xl",
          className,
        )}
        style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
      >
        {children}
      </div>
    </Component>
  );
}

export const MovingBorder = ({
  children,
  duration = 5000,
  ...otherProps
}: {
  children: React.ReactNode;
  duration?: number;
  [key: string]: unknown;
}) => {
  const pathRef = useRef<SVGRectElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const progress = useMotionValue<number>(0);
  const reduce = useReducedMotion();
  /* Trace the HOST's actual corner radius so the path follows the
     pill contour (percentages resolved against the pill height). */
  const [radius, setRadius] = useState(20);
  useEffect(() => {
    const host = svgRef.current?.parentElement?.parentElement;
    if (!host) return;
    const update = () => {
      const cs = getComputedStyle(host);
      const v = cs.borderTopLeftRadius;
      const h = host.getBoundingClientRect().height;
      let px = 20;
      if (v.includes("%")) px = (parseFloat(v) / 100) * h;
      else px = parseFloat(v) || 20;
      setRadius(px);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(host);
    return () => ro.disconnect();
  }, []);

  useAnimationFrame((time) => {
    if (reduce) return;
    const length = pathRef.current?.getTotalLength();
    if (length) {
      const pxPerMillisecond = length / duration;
      progress.set((time * pxPerMillisecond) % length);
    }
  });

  const x = useTransform(progress, (val) => {
    const len = pathRef.current?.getTotalLength();
    return pathRef.current && len && len > 0
      ? pathRef.current.getPointAtLength(val).x
      : 0;
  });
  const y = useTransform(progress, (val) => {
    const len = pathRef.current?.getTotalLength();
    return pathRef.current && len && len > 0
      ? pathRef.current.getPointAtLength(val).y
      : 0;
  });
  /* Tangent angle so the streak stays aligned to the border. */
  const angle = useTransform(progress, (val) => {
    const len = pathRef.current?.getTotalLength();
    if (!pathRef.current || !len || len <= 0) return 0;
    const a = pathRef.current.getPointAtLength(val);
    const b = pathRef.current.getPointAtLength(Math.min(val + 2, len - 0.001));
    return (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
  });

  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%) rotate(${angle}deg)`;

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="absolute h-full w-full"
        width="100%"
        height="100%"
        ref={svgRef}
        {...otherProps}
      >
        <rect
          fill="none"
          width="100%"
          height="100%"
          rx={radius}
          ry={radius}
          ref={pathRef}
        />
      </svg>
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          display: reduce ? "none" : "inline-block",
          transform,
        }}
      >
        {children}
      </motion.div>
    </>
  );
};
