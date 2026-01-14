## 1. Shadcn/ui Setup and Component Installation

- [x] 1.1 Initialize Shadcn/ui configuration with `npx shadcn@latest init`
  - Select: Style: Default, Base color: (user choice), CSS variables: Yes
  - Verify `components.json` created with correct path aliases
- [x] 1.2 Install Amethyst Haze theme with `npx shadcn@latest add https://tweakcn.com/r/themes/amethyst-haze.json`
  - Verify theme colors added to `globals.css`
- [x] 1.3 Install Batch 1 components: `npx shadcn@latest add button input label card dialog sheet`
- [x] 1.4 Install Batch 2 components: `npx shadcn@latest add form select checkbox radio-group switch textarea`
- [x] 1.5 Install Batch 3 components: `npx shadcn@latest add alert sonner badge skeleton progress`
- [x] 1.6 Install Batch 4 components: `npx shadcn@latest add tabs accordion dropdown-menu navigation-menu`
- [x] 1.7 Install Batch 5 components: `npx shadcn@latest add avatar table popover tooltip hover-card`
- [x] 1.8 Install Batch 6 components: `npx shadcn@latest add scroll-area separator command collapsible`
- [x] 1.9 Verify all components created in `src/components/ui/` directory

## 2. Micro-Skeuomorphism Design System Implementation

- [x] 2.1 Create `src/lib/design-tokens.ts` with CSS formula constants
  - Export gradient formula function
  - Export shadow formula function
  - Export rounded corner constants
- [x] 2.2 Update `app/globals.css` with micro-skeuomorphism CSS custom properties
  - Add gradient mixins
  - Add shadow layer utilities
  - Add motion easing variables
- [x] 2.3 Create `src/lib/motion-presets.ts` with Framer Motion animation variants
  - Export `fadeInUp` variant
  - Export `staggerChildren` variant
  - Export custom easing curve `[0.22, 1, 0.36, 1]`
- [x] 2.4 Update `tailwind.config.ts` to extend with design tokens
  - Add rounded corner utilities: `rounded-card: 20px`, `rounded-card-sm: 16px`
  - Verify existing color variables preserved

## 3. Component Upgrades with Micro-Skeuomorphism

- [x] 3.1 Upgrade `src/components/ui/button.tsx`
  - Add gradient background to default variant
  - Add layered shadow system
  - Add hover scale animation (1.02)
  - Add transition timing
- [x] 3.2 Upgrade `src/components/ui/card.tsx`
  - Add `elevated` variant with layered shadows
  - Add `glass` variant with backdrop blur
  - Update default rounded corners to `rounded-[20px]`
- [x] 3.3 Upgrade `src/components/ui/input.tsx`
  - Add inset shadow for depth effect
  - Update focus ring styling
  - Add smooth state transitions
- [x] 3.4 Create `src/components/ui/section.tsx` wrapper component
  - Implement standard section padding: `py-20 md:py-28 lg:py-32`
  - Implement container: `max-w-7xl mx-auto px-4`

## 4. Landing Page Section Components

- [x] 4.1 Create `src/components/landing/hero-section.tsx`
  - Implement `min-h-[90vh]` layout
  - Support left-text-right-image and centered layouts
  - Add FadeInUp animations
  - Optimize LCP with priority image loading
- [x] 4.2 Create `src/components/landing/logo-bar.tsx`
  - Implement Flex layout with responsive gaps
  - Add grayscale + opacity default state
  - Add hover color restoration
- [x] 4.3 Create `src/components/landing/features-grid.tsx`
  - Implement responsive grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
  - Add hover shadow effects
  - Add stagger animations
- [x] 4.4 Create `src/components/landing/pricing-cards.tsx`
  - Implement card grid layout
  - Add recommended plan highlighting (scale-105, ring)
  - Add "Most Popular" badge component
  - Use elevated card variant
- [x] 4.5 Create `src/components/landing/testimonial-carousel.tsx`
  - Implement carousel or masonry layout
  - Add circular avatar styling
  - Add quote decoration elements

## 5. Design System Documentation

- [x] 5.1 Update `apps/web/README.md` with design system section
  - Document component-first mandate
  - Document no-hardcoded-colors rule
  - Document CSS variable usage requirements
  - Document motion consistency guidelines
- [x] 5.2 Add component usage examples to README
  - Button variants with code examples
  - Card variants with code examples
  - CSS formula reference
  - Motion preset examples
- [x] 5.3 Update `/design-system` page to showcase new components
  - Add Shadcn/ui component gallery
  - Add micro-skeuomorphism examples
  - Add interactive variant switchers
  - Add copy-paste code snippets
- [x] 5.4 Create `src/lib/design-system-docs.ts` with component metadata
  - Export component descriptions
  - Export variant options
  - Export usage guidelines

## 6. Marketing Page Updates

- [x] 6.1 Update `app/(marketing)/page.tsx` home page
  - Replace existing sections with new landing components
  - Apply hero section with FadeInUp animations
  - Add features grid with micro-skeuomorphism cards
  - Add pricing section with elevated cards
- [x] 6.2 Update `app/(marketing)/layout.tsx`
  - Ensure theme variables applied
  - Verify motion presets available
- [ ] 6.3 Test responsive layouts on mobile, tablet, desktop
  - Verify typography scales correctly
  - Verify spacing adapts to breakpoints
  - Verify animations perform smoothly

## 7. Console Page Updates

- [x] 7.1 Update `app/console/(dashboard)/page.tsx`
  - Replace existing cards with upgraded Card component
  - Apply elevated variant where appropriate
  - Verify theme consistency
- [x] 7.2 Update `app/console/(dashboard)/transactions/page.tsx`
  - Update table styling with new Table component
  - Apply badge component for status indicators
  - Verify micro-interactions work
- [x] 7.3 Update `app/console/(auth)/login/page.tsx`
  - Update form with new Input components
  - Update button with gradient variant
  - Add form validation states
- [ ] 7.4 Test all console pages for visual consistency
  - Verify no style regressions
  - Verify theme variables applied correctly
  - Verify accessibility maintained

## 8. Testing and Validation

- [x] 8.1 Run type checking: `pnpm --filter web check-types`
- [x] 8.2 Run build: `pnpm --filter web build`
- [ ] 8.3 Test reduced motion support
  - Enable `prefers-reduced-motion` in browser
  - Verify animations disabled
  - Verify final states render correctly
- [ ] 8.4 Test color contrast ratios
  - Verify WCAG AA compliance for text
  - Verify button states meet accessibility standards
- [ ] 8.5 Performance testing
  - Measure LCP on home page (target: <2.5s)
  - Measure animation frame rates (target: 60fps)
  - Verify no layout shifts (CLS < 0.1)
- [ ] 8.6 Cross-browser testing
  - Test in Chrome, Firefox, Safari
  - Verify CSS color-mix support (fallback if needed)
  - Verify backdrop-filter support for glass effect

## 9. Documentation and Cleanup

- [x] 9.1 Add JSDoc comments to design token utilities
- [x] 9.2 Add JSDoc comments to motion preset functions
- [ ] 9.3 Update component prop types with TypeScript documentation
- [x] 9.4 Remove any unused dependencies
- [x] 9.5 Update `package.json` with any new dependencies added during implementation
