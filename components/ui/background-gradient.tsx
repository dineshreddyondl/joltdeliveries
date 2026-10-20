"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { usePrefersReducedMotion } from "@/components/ui/use-prefers-reduced-motion";

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
  muted = false,
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  animate?: boolean;
  /** Stone/ink ring instead of orange - for balancing accent density. */
  muted?: boolean;
}) => {
  const reduce = usePrefersReducedMotion();
  const run = animate && !reduce;

  const variants = {
    initial: { backgroundPosition: "0 50%" },
    animate: {
      backgroundPosition: ["0, 50%", "100% 50%", "0 50%"],
    },
  };
  const gradient = muted
    ? "bg-[radial-gradient(circle_farthest-side_at_0_100%,#4A4E44,transparent),radial-gradient(circle_farthest-side_at_100%_0,#3A3D34,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#6B6B66,transparent),radial-gradient(circle_farthest-side_at_0_0,#08080A,#08080A)]"
    : "bg-[radial-gradient(circle_farthest-side_at_0_100%,#E85A2C,transparent),radial-gradient(circle_farthest-side_at_100%_0,#C2410C,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#FF9A50,transparent),radial-gradient(circle_farthest-side_at_0_0,#08080A,#08080A)]";

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
          "absolute inset-0 rounded-[inherit] z-[1] opacity-35 group-hover:opacity-100 blur-xl transition duration-500 will-change-transform",
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
          "absolute inset-0 rounded-[inherit] z-[1] will-change-transform opacity-55 group-hover:opacity-90 transition duration-500",
          gradient,
        )}
      />
      <div className={cn("relative z-10", className)}>{children}</div>
    </div>
  );
};
