# Change: Enhance Micro-Skeuomorphism Design System Specification

## Why

The existing `add-micro-skeuomorphism-design-system` change (37/44 tasks complete) established foundational components and basic design patterns. However, it lacks comprehensive formal specifications for:

1. **Strict Visual Formulas**: Current implementation has basic gradients and shadows, but needs mathematically precise CSS formulas with explicit constraints (e.g., no plain backdrop-blur, no flat diffuse glows)
2. **Complete Design Token System**: Missing comprehensive typography scale, spacing system, and motion parameters as formal design tokens
3. **Component Variant Standards**: Need explicit specifications for all component states (hover, active, focus) with precise visual formulas
4. **Landing Page Architecture**: Missing formal standards for F-pattern/Z-pattern layouts, section structure, and performance requirements
5. **Accessibility Specifications**: Need formal WCAG compliance requirements, semantic HTML standards, and reduced-motion support
6. **Motion Preset Library**: Need complete animation variant library (FadeInUp, ScaleIn, SlideInLeft/Right, StaggerContainer) with precise timing

This change creates a comprehensive, enforceable design system specification that ensures consistency, maintainability, and professional quality across all web application interfaces.

## What Changes

### Design Language Formalization
- **NEW**: Formal "Micro-Skeuomorphism" style definition with explicit prohibitions (no plain backdrop-blur, no flat glows, no hardcoded colors)
- **NEW**: Mandatory three-layer shadow structure specification (outer glow, top highlight, bottom edge)
- **NEW**: Strict color-mix derivation requirement for all custom styles
- **NEW**: Rounded corner system (Small: 16px, Default: 20px, Large: 24px, Extra Large: 32px)
- **MODIFIED**: Enhance existing CSS formulas in `globals.css` with additional variants (hover states, glow effects)

### Design Token System
- **NEW**: Typography scale specification (Hero, Display, Title, Subtitle, Body, Caption) with responsive classes
- **NEW**: Spacing system specification (Section: py-20 md:py-28 lg:py-32, Container: px-4 sm:px-6 lg:px-8)
- **NEW**: Motion parameters (Duration: 0.6s, Easing: [0.22, 1, 0.36, 1], Stagger: 0.1s)
- **MODIFIED**: Extend `design-tokens.ts` with typography and spacing utilities
- **MODIFIED**: Add motion timing constants to `motion-presets.ts`

### Component Upgrade Specifications
- **NEW**: Button state specifications (default, hover with scale(1.02), active with scale(0.97))
- **NEW**: Card variant specifications (Glass, Elevated, Glow) with precise visual formulas
- **NEW**: Input inner-shadow specification for concave effect
- **NEW**: Badge/Tag micro-skeuomorphism specifications
- **MODIFIED**: Enhance existing Button component with all state transitions
- **MODIFIED**: Add Glow variant to Card component
- **MODIFIED**: Update Input component with inner-shadow formula

### Landing Page Architecture Standards
- **NEW**: Hero Section specification (min-h-screen, 12-word max title, priority image loading)
- **NEW**: Logo Bar specification (grayscale + 60% opacity default, hover color restoration)
- **NEW**: Problem Section specification (destructive color icons, fade-up animations)
- **NEW**: Features Section specification (Bento Grid support, hover:shadow-lg + scale)
- **NEW**: How It Works specification (step indicators, path drawing animations)
- **NEW**: Pricing Section specification (scale-105 highlight, "Most Popular" badge)
- **NEW**: Final CTA specification (gradient mesh background, floating effect)
- **MODIFIED**: Update existing landing components to meet formal specifications

### Motion Preset Library
- **NEW**: ScaleIn variant (opacity 0->1, scale 0.95->1)
- **NEW**: SlideInLeft variant (X-axis -30px->0)
- **NEW**: SlideInRight variant (X-axis 30px->0)
- **NEW**: StaggerContainer variant (0.1s delay between children)
- **MODIFIED**: Enhance existing fadeInUp with precise timing parameters
- **NEW**: Floating animation keyframes for CTA sections

### Accessibility Standards
- **NEW**: HTML semantic requirements (<section>, <nav>, <main>, <footer>)
- **NEW**: Contrast ratio requirements (Body: ≥4.5:1, Headings: ≥3:1)
- **NEW**: prefers-reduced-motion support specification
- **NEW**: Focus ring specification (focus-visible:ring-2)
- **NEW**: Keyboard navigation requirements for all interactive elements

## Impact

### Affected Areas
- **apps/web/app/globals.css**: Add new CSS formula variants and motion keyframes
- **apps/web/src/lib/design-tokens.ts**: Add typography and spacing utilities
- **apps/web/src/lib/motion-presets.ts**: Add new animation variants
- **apps/web/src/components/ui/**: Enhance Button, Card, Input, Badge components
- **apps/web/src/components/landing/**: Update all landing components to meet specifications
- **apps/web/tailwind.config.ts**: Add typography scale and spacing utilities
- **apps/web/README.md**: Add comprehensive design system documentation

### Breaking Changes
- **NONE**: This is a specification enhancement that formalizes and extends existing patterns
- **Visual Changes**: Components will have more refined animations and visual states
- **API Additions**: New component variants (Card Glow, Button states) are additive

### Risks & Mitigation
- **Risk**: Additional CSS formulas may increase bundle size
  - **Mitigation**: Use CSS custom properties (already in place); minimal impact (~2KB)
- **Risk**: More complex animations may impact performance on low-end devices
  - **Mitigation**: Mandatory prefers-reduced-motion support; animations are GPU-accelerated
- **Risk**: Strict specifications may slow down development
  - **Mitigation**: Comprehensive documentation and reusable utilities accelerate implementation

### Dependencies
- Requires: Existing `add-micro-skeuomorphism-design-system` implementation (37/44 tasks complete)
- Requires: TailwindCSS v4 (already installed)
- Requires: Framer Motion (already installed)
- Requires: Shadcn/ui components (already installed)
- No new dependencies required

### Non-Goals
- No new component library (using existing Shadcn/ui)
- No framework changes (staying with Next.js + TailwindCSS)
- No backend modifications
- No routing or authentication changes
- No data model changes
