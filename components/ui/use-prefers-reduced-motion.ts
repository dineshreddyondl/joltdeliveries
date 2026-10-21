"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onStoreChange: () => void): () => void {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

function getSnapshot(): boolean {
  return typeof window !== "undefined" && !!window.matchMedia
    ? window.matchMedia(QUERY).matches
    : false;
}

function getServerSnapshot(): boolean {
  return false;
}

/**
 * Hydration-safe `prefers-reduced-motion`.
 *
 * SSR and the first client render always report `false` (identical trees),
 * then the real preference lands right after hydration. Use this instead
 * of motion/react's `useReducedMotion` wherever the value changes
 * server-rendered markup or attributes — motion's hook is `null` during
 * SSR, so reduced-motion users would otherwise hydrate a different branch
 * than the server rendered.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
