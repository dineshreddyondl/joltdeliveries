"use client";

import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "motion/react";

/**
 * Aceternity BackgroundGradient, themed for JOLT:
 * - Orange/ink gradient ring instead of the teal/purple demo hues.
 * - Radius inherits from the container (rounded-[inherit]).
 * - Reduced motion disables the background-position loop.
 */
export const BackgroundGradient = ({
  children,
  className,
  containerClassName,
  animate = true,
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  animate?: boolean;
}) => {
  const reduce = useReducedMotion();
  const run = animate && !reduce;

  const variants = {
    initial: { backgroundPosition: "0 50%" },
    animate: {
      backgroundPosition: ["0, 50%", "100% 50%", "0 50%"],
    },
  };
  const gradient =
    "bg-[radial-gradient(circle_farthest-side_at_0_100%,#E85A2C,transparent),radial-gradient(circle_farthest-side_at_100%_0,#C2410C,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#FF9A50,transparent),radial-gradient(circle_farthest-side_at_0_0,#08080A,#08080A)]";

  return (
    <div className={cn("relative p-[4px] group", containerClassName)}>
      <motion.div
        variants={run ? variants : undefined}
        initial={run ? "initial" : undefined}
        animate={run ? "animate" : undefined}
        transition={
          run ? { duration: 5, repeat: Infinity, repeatType: "reverse" } : undefined
        }
        style={{ backgroundSize: run ? "400% 400%" : undefined }}
        className={cn(
          "absolute inset-0 rounded-[inherit] z-[1] opacity-25 group-hover:opacity-100 blur-xl transition duration-500 will-change-transform",
          gradient,
        )}
      />
      <motion.div
        variants={run ? variants : undefined}
        initial={run ? "initial" : undefined}
        animate={run ? "animate" : undefined}
        transition={
          run ? { duration: 5, repeat: Infinity, repeatType: "reverse" } : undefined
        }
        style={{ backgroundSize: run ? "400% 400%" : undefined }}
        className={cn(
          "absolute inset-0 rounded-[inherit] z-[1] will-change-transform opacity-40 group-hover:opacity-90 transition duration-500",
          gradient,
        )}
      />
      <div className={cn("relative z-10", className)}>{children}</div>
    </div>
  );
};
