# Web

Brownie web application (Next.js).

## Design Language (Micro-Skeuomorphism)

Micro-skeuomorphism is a strict, token-driven visual language:
- Gradients create depth (3-stop formula derived from CSS variables via `color-mix()`).
- Elevated surfaces use layered shadows (outer glow + top highlight + bottom edge).
- Interactions feel tactile (hover/active scale + shadow transitions).

### Prohibited Patterns
- Plain `backdrop-blur*` used as the primary style without a `color-mix()` surface tint.
- Flat `0 0 Npx ...` diffuse glow shadows instead of layered shadows.
- Hardcoded colors (no `bg-[#...]`, `text-[rgb(...)]`, or literal hex values).

## Visual Formulas

Defined in `apps/web/app/globals.css`:
- Gradients: `--ms-gradient-primary`, `--ms-gradient-secondary`, `--ms-gradient-accent`
- Shadows: `--ms-shadow-elevated`, `--ms-shadow-elevated-hover`, `--ms-shadow-glow`, `--ms-shadow-inset`
- Motion: `@keyframes float` (`.animate-float`), `@keyframes path-draw`

Example usage:
```css
background-image: var(--ms-gradient-primary);
box-shadow: var(--ms-shadow-elevated);
```

## Design Tokens

Source of truth: `apps/web/src/lib/design-tokens.ts`
- Rounded corners: `ROUNDED_CORNERS` (`card-sm`: 16px, `card`: 20px, `card-lg`: 24px, `card-xl`: 32px)
- Typography scale: `TYPOGRAPHY_SCALE` (Hero → Display → Title → Subtitle → Body → Caption)
- Spacing system: `SPACING` (Section, Container, Stack)

Layout primitives:
- `Section` (`apps/web/src/components/ui/section.tsx`) applies `py-20 md:py-28 lg:py-32` and `px-4 sm:px-6 lg:px-8`.

## Motion System

Source of truth: `apps/web/src/lib/motion-presets.ts`
- Easing: `EASE_OUT_EXPO` (`[0.22, 1, 0.36, 1]`)
- Durations: `MOTION_DURATION` (`fast|medium|slow`)
- Stagger: `STAGGER_DELAY`, `staggerContainer`
- Variants: `fadeInUp`, `scaleIn`, `slideInLeft`, `slideInRight`
- Reduced motion: `reduceMotionVariants()` + global `prefers-reduced-motion` overrides in `apps/web/app/globals.css`

## Component Examples

### Button

```tsx
import { Button } from "@/components/ui/button";

<Button>Default</Button>;
<Button variant="outline">Outline</Button>;
<Button variant="secondary">Secondary</Button>;
<Button variant="ghost">Ghost</Button>;
<Button variant="link">Link</Button>;
<Button variant="destructive">Destructive</Button>;
```

### Card

```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

<Card variant="flat">
  <CardHeader>
    <CardTitle>Flat</CardTitle>
  </CardHeader>
  <CardContent>...</CardContent>
</Card>;

<Card variant="elevated">...</Card>;
<Card variant="glass">...</Card>;
<Card variant="glow">...</Card>;
```

### Badge

```tsx
import { Badge } from "@/components/ui/badge";

<Badge size="sm">Most Popular</Badge>;
<Badge>Default</Badge>;
<Badge size="lg">Large</Badge>;
<Badge variant="success">Success</Badge>;
```

### Motion presets

```tsx
import { motion, useReducedMotion } from "framer-motion";
import { fadeInUp, reduceMotionVariants } from "@/lib/motion-presets";

const reduced = useReducedMotion();
const variants = reduced ? reduceMotionVariants(fadeInUp) : fadeInUp;

<motion.div variants={variants} initial="hidden" whileInView="show" viewport={{ once: true }} />;
```

## Landing Page Architecture

Landing pages use a consistent section set (see `apps/web/src/components/landing/`):
- Hero (LP-001): `min-h-[90vh]`, image `priority`, sequential reveal
- Logo Bar (LP-002): `grayscale opacity-60`, hover restores color, `transition-all duration-300`
- Problem (LP-003): destructive icons + fade-up on viewport entry
- Features (LP-004): grid or bento layouts, hover scale + shadow transitions
- How It Works (LP-005): numbered badges + connecting lines + sequential reveal
- Pricing (LP-006): recommended plan `scale-105 ring-2 ring-primary shadow-xl` + “Most Popular” badge
- Final CTA (LP-007): gradient mesh background + `animate-float`, optional texture overlay

Performance guidelines:
- Target LCP: `< 2.5s` on the home page
- Target CLS: `< 0.1`

## Accessibility

- Semantic HTML: all landing sections are `<section aria-label="...">` with h1 → h2 hierarchy.
- Focus visibility: interactive elements must show `focus-visible:ring-2 focus-visible:ring-primary`.
- Keyboard navigation: no keyboard traps; logical tab order.
- Reduced motion: honor `prefers-reduced-motion` (motion presets + global CSS overrides).
- Contrast sanity check (RGB semantic tokens): `node apps/web/scripts/check-contrast.mjs`

## Design System Mandate

- **Component First**: Use `@/components/ui` primitives before creating new ones.
- **No Hardcoded Colors**: Use semantic tokens and CSS variables.
- **CSS Variables + color-mix**: For depth effects, prefer `var(--primary)` + `color-mix()` and shared formulas in `apps/web/app/globals.css`.
- **Consistent Motion**: Use Framer Motion presets from `apps/web/src/lib/motion-presets.ts` and honor reduced motion.

## Routes

- Landing page: `/`
- Developer console: `/console` (e.g. `/console/transactions`, `/console/login`)
 - Design system showcase: `/design-system`

## Setup

- Copy `.env.example` → `.env.local` and set `NEXT_PUBLIC_API_BASE_URL`.
- Run `pnpm dev --filter=web` (defaults to port `3000`).
