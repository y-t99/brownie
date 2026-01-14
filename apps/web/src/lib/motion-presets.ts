import type { Variants } from "framer-motion";

/**
 * Ease-out-expo curve used for entrance animations.
 * Matches the OpenSpec requirement: `[0.22, 1, 0.36, 1]`.
 */
export const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as const;

/**
 * Motion duration presets (in seconds) for Framer Motion transitions.
 */
export const MOTION_DURATION = {
  fast: 0.2,
  medium: 0.3,
  slow: 0.6,
} as const;

/**
 * Default stagger delay (in seconds) between children in container variants.
 */
export const STAGGER_DELAY = 0.1 as const;

/**
 * Fade + translate up entrance variant:
 * from `{ y: 20, opacity: 0 }` to `{ y: 0, opacity: 1 }`.
 */
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: MOTION_DURATION.slow, ease: EASE_OUT_EXPO },
  },
};

/**
 * Parent variant that staggers children by `STAGGER_DELAY`.
 */
export const staggerContainer: Variants = {
  show: {
    transition: { staggerChildren: STAGGER_DELAY },
  },
};

/**
 * Backwards-compatible alias for the stagger container.
 */
export const staggerChildren = staggerContainer;

/**
 * Scale-in entrance variant:
 * from `{ opacity: 0, scale: 0.95 }` to `{ opacity: 1, scale: 1 }`.
 */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: MOTION_DURATION.slow, ease: EASE_OUT_EXPO },
  },
};

/**
 * Slide-in-from-left entrance variant:
 * from `{ opacity: 0, x: -30 }` to `{ opacity: 1, x: 0 }`.
 */
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: MOTION_DURATION.slow, ease: EASE_OUT_EXPO },
  },
};

/**
 * Slide-in-from-right entrance variant:
 * from `{ opacity: 0, x: 30 }` to `{ opacity: 1, x: 0 }`.
 */
export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: MOTION_DURATION.slow, ease: EASE_OUT_EXPO },
  },
};

/**
 * Returns a copy of a `Variants` object with all `transition` blocks removed.
 * Useful for honoring `prefers-reduced-motion` while still rendering final states.
 */
export function reduceMotionVariants(variants: Variants): Variants {
  const reduced: Variants = {};
  for (const [key, value] of Object.entries(variants)) {
    if (typeof value === "object" && value && "transition" in value) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { transition: _transition, ...rest } = value as any;
      void _transition;
      reduced[key] = rest;
    } else {
      reduced[key] = value;
    }
  }
  return reduced;
}
