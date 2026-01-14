export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export const DURATIONS = {
  fast: 0.2,
  base: 0.45,
  slow: 0.7,
} as const;

export function fadeUp({ delay = 0 }: { delay?: number } = {}) {
  return {
    initial: { opacity: 0, y: 14 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: DURATIONS.base,
        ease: EASE_OUT,
        delay,
      },
    },
  } as const;
}

