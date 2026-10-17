/**
 * cn — className joiner (dependency-free, no clsx/tailwind-merge).
 * Adapted from shadcn's cn() to keep the dependency surface at zero
 * for this repo (Brief 01 forbids new npm packages beyond `motion`).
 */
export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}
