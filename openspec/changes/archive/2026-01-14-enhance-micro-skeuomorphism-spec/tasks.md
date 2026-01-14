# Implementation Tasks

## 1. Design Token Enhancements

- [x] 1.1 Extend `src/lib/design-tokens.ts` with typography scale utilities
  - Add `TYPOGRAPHY_SCALE` constant with Hero, Display, Title, Subtitle, Body, Caption
  - Add JSDoc comments for each level with usage examples
  - Export as const for type safety

- [x] 1.2 Add spacing system utilities to `design-tokens.ts`
  - Add `SPACING` constant with section, container, and stack variants
  - Document responsive breakpoints in JSDoc
  - Export as const

- [x] 1.3 Add motion timing constants to `src/lib/motion-presets.ts`
  - Add `MOTION_DURATION` constant (fast: 0.2, medium: 0.3, slow: 0.6)
  - Add `STAGGER_DELAY` constant (0.1)
  - Update existing `EASE_OUT_EXPO` documentation

- [x] 1.4 Update `tailwind.config.ts` with rounded corner utilities
  - Add `borderRadius` extensions: card-sm (16px), card (20px), card-lg (24px), card-xl (32px)
  - Verify existing card/card-sm values match specification

## 2. CSS Formula Enhancements

- [x] 2.1 Add gradient variants to `app/globals.css`
  - Add `--ms-gradient-accent` for accent color gradients
  - Add `--ms-gradient-secondary` for secondary color gradients
  - Document usage in CSS comments

- [x] 2.2 Add shadow variants to `app/globals.css`
  - Add `--ms-shadow-glow` for emphasis/hover states
  - Verify existing `--ms-shadow-elevated`, `--ms-shadow-elevated-hover`, `--ms-shadow-inset`
  - Document 3-layer structure in CSS comments

- [x] 2.3 Add motion keyframes to `app/globals.css`
  - Add `@keyframes float` for CTA sections (0%/100%: translateY(0), 50%: translateY(-8px))
  - Add `.animate-float` utility class (3s ease-in-out infinite)
  - Add `@keyframes path-draw` for "How It Works" sections (stroke-dashoffset animation)

- [x] 2.4 Add prefers-reduced-motion overrides to `app/globals.css`
  - Add media query that disables all animations
  - Set animation-duration: 0.01ms, transition-duration: 0.01ms
  - Document accessibility rationale in comments

## 3. Component Upgrades

- [x] 3.1 Enhance `src/components/ui/button.tsx` with state transitions
  - Verify default variant uses `--ms-gradient-primary` and `--ms-shadow-elevated`
  - Verify hover state uses `scale-[1.02]` and `--ms-shadow-elevated-hover`
  - Verify active state uses `scale-[0.99]`
  - Add transition: `transition-[transform,box-shadow,background-color] duration-200`

- [x] 3.2 Add Glow variant to `src/components/ui/card.tsx`
  - Add `glow` variant to `cardVariants`
  - Use `--ms-shadow-elevated` default, `--ms-shadow-glow` on hover
  - Add hover scale: `hover:scale-[1.02]`
  - Add transition: `transition-[transform,box-shadow] duration-300`

- [x] 3.3 Update `src/components/ui/input.tsx` with inner-shadow
  - Verify inset shadow: `shadow-[var(--ms-shadow-inset)]`
  - Verify focus ring: `focus-visible:ring-2 focus-visible:ring-primary`
  - Add smooth transition: `transition-shadow duration-200`

- [x] 3.4 Create `src/components/ui/badge.tsx` with micro-skeuomorphism
  - Use `rounded-[12px]` (smaller than card-sm)
  - Apply mini gradient: `bg-[image:var(--ms-gradient-primary)]`
  - Apply subtle shadow: `shadow-sm`
  - Add size variants: sm, default, lg

## 4. Motion Preset Library

- [x] 4.1 Add ScaleIn variant to `src/lib/motion-presets.ts`
  - Hidden: `{ opacity: 0, scale: 0.95 }`
  - Show: `{ opacity: 1, scale: 1, transition: { duration: 0.6, ease: EASE_OUT_EXPO } }`

- [x] 4.2 Add SlideInLeft variant to `src/lib/motion-presets.ts`
  - Hidden: `{ opacity: 0, x: -30 }`
  - Show: `{ opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE_OUT_EXPO } }`

- [x] 4.3 Add SlideInRight variant to `src/lib/motion-presets.ts`
  - Hidden: `{ opacity: 0, x: 30 }`
  - Show: `{ opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE_OUT_EXPO } }`

- [x] 4.4 Add StaggerContainer variant to `src/lib/motion-presets.ts`
  - Show: `{ transition: { staggerChildren: STAGGER_DELAY } }`
  - Document usage with child variants in JSDoc

## 5. Landing Page Component Updates

- [x] 5.1 Update `src/components/landing/hero-section.tsx` to meet LP-001 spec
  - Verify `min-h-[90vh]` layout
  - Add title length validation (max 12 words) in prop types
  - Ensure image has `priority={true}` attribute
  - Add sequential fade-in animations (title → subtitle → CTA → visual)

- [x] 5.2 Update `src/components/landing/logo-bar.tsx` to meet LP-002 spec
  - Verify default state: `grayscale opacity-60`
  - Verify hover state: `grayscale-0 opacity-100`
  - Add transition: `transition-all duration-300`

- [x] 5.3 Create `src/components/landing/problem-section.tsx` for LP-003 spec
  - Use destructive color icons (X, AlertCircle, TriangleAlert)
  - Apply fade-up animation on viewport entry
  - Support 2-3 problem statements with impact descriptions

- [x] 5.4 Update `src/components/landing/features-grid.tsx` to meet LP-004 spec
  - Add Bento Grid layout option (irregular cell sizes)
  - Verify hover effects: `hover:shadow-lg hover:scale-[1.02]`
  - Verify icon size: 40-48px
  - Add transition: `transition-[transform,box-shadow] duration-300`

- [x] 5.5 Create `src/components/landing/how-it-works.tsx` for LP-005 spec
  - Implement numbered step indicators (circular badges)
  - Add connection lines (dotted or gradient)
  - Add sequential reveal animation
  - Support 3-5 steps with title + description

- [x] 5.6 Update `src/components/landing/pricing-cards.tsx` to meet LP-006 spec
  - Verify recommended plan uses `scale-105` and `ring-2 ring-primary`
  - Add "Most Popular" badge component
  - Verify enhanced shadow: `shadow-xl`
  - Add transition: `transition-[transform,box-shadow] duration-300`

- [x] 5.7 Create `src/components/landing/final-cta.tsx` for LP-007 spec
  - Implement gradient mesh background
  - Add floating animation: `animate-float`
  - Support headline + subtitle + CTA button layout
  - Add subtle texture overlay option

## 6. Accessibility Implementation

- [x] 6.1 Add semantic HTML to all landing components
  - Wrap sections in `<section>` with `aria-label`
  - Use proper heading hierarchy (h1 → h2 → h3)
  - Add `<main>` wrapper to page layouts

- [x] 6.2 Verify contrast ratios meet WCAG AA
  - Test body text: ≥4.5:1
  - Test headings: ≥3:1
  - Test UI components: ≥3:1
  - Use automated testing tool (e.g., axe-core)
  - Verified semantic token contrast via `apps/web/scripts/check-contrast.mjs`

- [x] 6.3 Add focus-visible rings to all interactive elements
  - Verify buttons have `focus-visible:ring-2 focus-visible:ring-primary`
  - Verify links have visible focus indicators
  - Verify form inputs have focus rings

- [-] 6.4 Test keyboard navigation
  - Verify tab order is logical
  - Verify all interactive elements are keyboard accessible
  - Verify no keyboard traps

## 7. Documentation

- [x] 7.1 Update `apps/web/README.md` with design system specification
  - Add "Design Language" section with micro-skeuomorphism definition
  - Add "Prohibited Patterns" section with explicit anti-patterns
  - Add "Visual Formulas" section with CSS examples
  - Add "Component Variants" section with usage examples

- [x] 7.2 Add typography scale documentation to README
  - Document all 6 levels with usage guidelines
  - Add responsive sizing examples
  - Add accessibility notes (contrast, line-height)

- [x] 7.3 Add spacing system documentation to README
  - Document section, container, and stack spacing
  - Add responsive breakpoint examples
  - Add layout composition examples

- [x] 7.4 Add motion system documentation to README
  - Document duration, easing, and stagger parameters
  - Add animation variant examples
  - Add prefers-reduced-motion guidelines

- [x] 7.5 Add landing page architecture documentation to README
  - Document all 7 section types (Hero, Logo Bar, Problem, Features, How It Works, Pricing, Final CTA)
  - Add layout pattern guidelines (F-pattern, Z-pattern)
  - Add performance requirements (LCP, CLS)

- [x] 7.6 Add accessibility documentation to README
  - Document semantic HTML requirements
  - Document contrast ratio requirements
  - Document keyboard navigation requirements
  - Document reduced-motion requirements

## 8. Testing and Validation

- [x] 8.1 Run type checking: `pnpm --filter web check-types`

- [x] 8.2 Run build: `pnpm --filter web build`

- [-] 8.3 Test prefers-reduced-motion support
  - Enable `prefers-reduced-motion` in browser
  - Verify all animations are disabled
  - Verify final states render correctly

- [x] 8.4 Test contrast ratios with automated tool
  - Run axe-core or similar accessibility testing tool
  - Fix any contrast ratio violations
  - Document results
  - Used `apps/web/scripts/check-contrast.mjs` (token contrast) and recorded output in terminal

- [-] 8.5 Performance testing
  - Measure LCP on home page (target: <2.5s)
  - Measure animation frame rates (target: 60fps)
  - Verify no layout shifts (CLS < 0.1)
  - Use Lighthouse or WebPageTest

- [-] 8.6 Cross-browser testing
  - Test in Chrome, Firefox, Safari
  - Verify CSS color-mix support (fallback if needed)
  - Verify backdrop-filter support for glass effect
  - Document any browser-specific issues

## 9. Validation and Cleanup

- [x] 9.1 Validate with `openspec validate enhance-micro-skeuomorphism-spec --strict`

- [x] 9.2 Review all spec requirements are implemented
  - Design Language: DL-001 through DL-006
  - Design Tokens: DT-001 through DT-006
  - Landing Page: LP-001 through LP-008

- [x] 9.3 Remove any unused code or dependencies

- [x] 9.4 Update `package.json` if any new dependencies were added

- [x] 9.5 Final code review and cleanup
