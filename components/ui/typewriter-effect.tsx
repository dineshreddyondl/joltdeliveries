"use client";

import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useLayoutEffect, useState } from "react";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Aceternity TypewriterEffectSmooth, adapted for JOLT:
 * - No default text sizes (inherits from the parent heading).
 * - Orange cursor instead of blue.
 * - SSR ships the full visible heading; the width reveal + cursor
 *   only mount after a ready gate, and reduced motion renders the
 *   static completed state (no reveal, static cursor).
 */
export const TypewriterEffectSmooth = ({
  words,
  className,
  cursorClassName,
}: {
  words: {
    text: string;
    className?: string;
  }[];
  className?: string;
  cursorClassName?: string;
}) => {
  const wordsArray = words.map((word) => ({
    ...word,
    text: word.text.split(""),
  }));

  const reduce = useReducedMotion();
  const [ready, setReady] = useState(false);
  useIsomorphicLayoutEffect(() => {
    setReady(true);
  }, []);

  const inner = (
    <div className="font-bold">
      {wordsArray.map((word, idx) => (
        <div key={`word-${idx}`} className="inline-block">
          {word.text.map((char, index) => (
            <span key={`char-${index}`} className={cn(word.className)}>
              {char}
            </span>
          ))}
          &nbsp;
        </div>
      ))}
    </div>
  );

  const cursor = (
    <span
      aria-hidden="true"
      className={cn(
        "inline-block rounded-sm w-[4px] bg-[#E85A2C]",
        cursorClassName,
      )}
      style={{ height: "0.82em", marginLeft: "0.08em" }}
    />
  );

  if (reduce === true) {
    return (
      <span className={cn("inline-flex items-center", className)}>
        {inner}
        {cursor}
      </span>
    );
  }

  if (!ready) {
    return <span className={cn("inline-flex items-center", className)}>{inner}</span>;
  }

  return (
    <span className={cn("inline-flex items-center", className)}>
      <motion.span
        className="overflow-hidden"
        initial={{ width: "0%" }}
        whileInView={{ width: "fit-content" }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: "linear", delay: 0.4 }}
      >
        {inner}
      </motion.span>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      >
        {cursor}
      </motion.span>
    </span>
  );
};
