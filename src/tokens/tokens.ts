/**
 * The design tokens themselves are defined once as CSS custom properties in
 * src/app/globals.css and are the values components should reference via
 * Tailwind's arbitrary-value syntax, e.g. `bg-[var(--color-bg-surface)]`.
 *
 * This file holds the small set of motion-related values that have no CSS
 * equivalent (Framer Motion spring configs) so they aren't scattered as
 * inline magic numbers across components.
 */

export const springSnappy = { type: "spring", stiffness: 120, damping: 18 } as const;

export const easeOutExpo = [0.16, 1, 0.3, 1] as const;

export const durations = {
  fast: 0.15,
  base: 0.4,
  slow: 0.7,
} as const;
