# Change: Add Micro-Skeuomorphism Design System with Shadcn/ui

## Why

The web app currently has a basic theme system but lacks a comprehensive component library and cohesive visual design language. To create a modern, polished user experience across both marketing pages and the developer console, we need:

1. **Component Library**: Shadcn/ui provides accessible, customizable components that integrate seamlessly with TailwindCSS
2. **Visual Identity**: Micro-skeuomorphism design language (subtle gradients, layered shadows, tactile interactions) creates depth and premium feel
3. **Design Consistency**: Formal design tokens, motion primitives, and component standards prevent ad-hoc styling and ensure maintainability
4. **Developer Experience**: Clear guidelines and reusable patterns accelerate feature development

This change establishes a production-ready design system that scales across the entire web application.

## What Changes

### Component Library Integration
- **NEW**: Shadcn/ui component library with Amethyst Haze theme
- **NEW**: 25+ UI components (Button, Card, Input, Dialog, Table, etc.) installed in batches
- **NEW**: Component configuration in `components.json` with path aliases

### Micro-Skeuomorphism Design Language
- **NEW**: CSS design formulas for gradients, shadows, and depth effects
- **NEW**: Three-tier shadow system (outer glow, top highlight, bottom edge)
- **NEW**: Color-mix based styling (no hardcoded colors)
- **NEW**: Rounded corner standards (20px default, 16px small)
- **NEW**: Motion presets (FadeInUp, Stagger, custom easing curves)

### Design System Documentation
- **NEW**: Visual design tokens (typography scale, spacing system, color semantics)
- **NEW**: Component upgrade specifications (Button variants, Card styles, Input states)
- **NEW**: Landing page architecture standards (Hero, Features, Pricing, Testimonials)
- **NEW**: Animation guidelines (Framer Motion patterns, timing functions)

### Theme System Enhancement
- **MODIFIED**: Extend existing TailwindCSS v4 configuration with Shadcn/ui color variables
- **MODIFIED**: Update `globals.css` with micro-skeuomorphism CSS formulas
- **MODIFIED**: Integrate design tokens with existing semantic color system

### Application Scope
- **Marketing Pages**: Apply design system to `/` (home), `/design-system` (showcase)
- **Console Pages**: Apply design system to `/console/**` (dashboard, transactions, auth)
- **Global**: Unified theme and component standards across entire web app

## Impact

### Affected Areas
- **apps/web**: All pages receive new design system
- **Dependencies**: Add Shadcn/ui CLI and component dependencies
- **Build**: No build process changes (TailwindCSS v4 already configured)

### Breaking Changes
- **NONE**: Additive change that enhances existing UI without breaking functionality
- **Visual Changes**: Existing components will be gradually migrated to new design patterns

### Risks & Mitigation
- **Risk**: Shadcn/ui installation may timeout with large component batches
  - **Mitigation**: Install components in 6 batches (documented in tasks)
- **Risk**: Design system may conflict with existing console styles
  - **Mitigation**: Use CSS variables and progressive enhancement; test all console pages
- **Risk**: Motion effects may impact performance on low-end devices
  - **Mitigation**: Use `prefers-reduced-motion` media query; optimize animations

### Dependencies
- Requires: TailwindCSS v4 (already installed)
- Requires: Framer Motion (already installed)
- Requires: Lucide React (already installed)
- Adds: Shadcn/ui CLI and Radix UI primitives
- Adds: `tailwind-variants` for component styling (optional)

### Non-Goals
- No framework migration (staying with Next.js)
- No routing or authentication changes
- No backend API modifications
- No data model changes
