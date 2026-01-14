/**
 * Shared corner radii for the micro-skeuomorphism system.
 * - `card`: default surface radius (20px)
 * - `cardSm`: small control radius (16px)
 */
export const ROUNDED_CORNERS = {
  card: "20px",
  cardSm: "16px",
} as const;

/**
 * Typography scale for marketing and product surfaces.
 *
 * Usage:
 * - `className={TYPOGRAPHY_SCALE.hero}` for hero headlines
 * - `className={TYPOGRAPHY_SCALE.display}` for section headings
 */
export const TYPOGRAPHY_SCALE = {
  /** Big hero headline (landing hero H1). */
  hero: "text-balance text-5xl font-semibold tracking-tight text-text-primary md:text-6xl lg:text-7xl",
  /** Large section headline (landing H2). */
  display: "text-balance text-4xl font-semibold tracking-tight text-text-primary md:text-5xl",
  /** Page/section title (smaller than display). */
  title: "text-balance text-3xl font-semibold tracking-tight text-text-primary md:text-4xl",
  /** Supporting headline. */
  subtitle: "text-pretty text-lg leading-relaxed text-text-secondary sm:text-xl",
  /** Default body copy. */
  body: "text-pretty text-base leading-relaxed text-text-secondary sm:text-lg",
  /** Small helper/caption text. */
  caption: "text-sm leading-relaxed text-text-secondary",
} as const;

/**
 * Spacing primitives for consistent layouts.
 *
 * Usage:
 * - Wrap content in `Section` (applies `SPACING.section` and `SPACING.container`)
 * - Use `SPACING.stack.*` for vertical rhythm inside cards/sections
 */
export const SPACING = {
  /** Section vertical rhythm. */
  section: "py-20 md:py-28 lg:py-32",
  /** Max-width + responsive side padding. */
  container: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
  /** Vertical stacks. */
  stack: {
    sm: "space-y-3",
    md: "space-y-6",
    lg: "space-y-10",
  },
} as const;

/**
 * Returns the standard 3-stop micro-skeuomorphic gradient formula.
 * Uses `color-mix()` and MUST be fed CSS variables (no hardcoded colors).
 */
export function microGradient(primaryColor: string = "var(--primary)") {
  return `linear-gradient(135deg, ${primaryColor} 0%, color-mix(in srgb, ${primaryColor} 85%, black) 50%, color-mix(in srgb, ${primaryColor} 70%, black) 100%)`;
}

/**
 * Returns the layered shadow formula (outer glow + inset highlights).
 * Uses `color-mix()` and is designed to pair with `microGradient()`.
 */
export function layeredShadow(primaryColor: string = "var(--primary)") {
  return `0 4px 12px color-mix(in srgb, ${primaryColor} 35%, transparent), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.1)`;
}
