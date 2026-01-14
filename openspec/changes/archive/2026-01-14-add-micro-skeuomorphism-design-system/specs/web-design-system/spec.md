## ADDED Requirements

### Requirement: Shadcn/ui Component Library Integration

The web app SHALL integrate Shadcn/ui component library with Amethyst Haze theme to provide accessible, customizable UI components.

#### Scenario: Initialize Shadcn/ui configuration
- **WHEN** running `npx shadcn@latest init`
- **THEN** create `components.json` with configuration:
  - Style: Default
  - Base color: User-selected
  - CSS variables: Yes
  - Path aliases: `@/components`, `@/lib`

#### Scenario: Install Amethyst Haze theme
- **WHEN** running `npx shadcn@latest add https://tweakcn.com/r/themes/amethyst-haze.json`
- **THEN** apply Amethyst Haze color palette to CSS variables in `globals.css`

#### Scenario: Install core components in batches
- **WHEN** installing components to prevent timeout
- **THEN** execute 6 sequential batches:
  1. Core interaction: button, input, label, card, dialog, sheet
  2. Form controls: form, select, checkbox, radio-group, switch, textarea
  3. Feedback: alert, sonner, badge, skeleton, progress
  4. Navigation: tabs, accordion, dropdown-menu, navigation-menu
  5. Data display: avatar, table, popover, tooltip, hover-card
  6. Utilities: scroll-area, separator, command, collapsible

#### Scenario: Component files created
- **WHEN** components are installed
- **THEN** create files in `src/components/ui/` directory
- **AND** each component exports React component with Radix UI primitives
- **AND** components use `cn()` utility for class merging

### Requirement: Micro-Skeuomorphism Visual Design Language

The design system SHALL implement micro-skeuomorphism patterns using CSS variables and color-mix functions to create depth and tactile visual effects.

#### Scenario: Three-stage gradient backgrounds
- **WHEN** applying gradient to Button or Card components
- **THEN** use formula:
  ```css
  background: linear-gradient(
    135deg,
    var(--primary) 0%,
    color-mix(in srgb, var(--primary) 85%, black) 50%,
    color-mix(in srgb, var(--primary) 70%, black) 100%
  );
  ```
- **AND** MUST NOT use hardcoded color values

#### Scenario: Layered shadow system
- **WHEN** applying elevation to components
- **THEN** use three-tier shadow formula:
  ```css
  box-shadow:
    0 4px 12px color-mix(in srgb, var(--primary) 35%, transparent), /* outer glow */
    inset 0 1px 0 rgba(255,255,255,0.2),                             /* top highlight */
    inset 0 -1px 0 rgba(0,0,0,0.1);                                  /* bottom edge */
  ```

#### Scenario: Rounded corner standards
- **WHEN** styling cards, buttons, or containers
- **THEN** use `rounded-[20px]` as default
- **OR** use `rounded-[16px]` for small components

#### Scenario: Button micro-interactions
- **WHEN** user hovers over button
- **THEN** apply `scale(1.02)` transform
- **AND** increase shadow spread
- **AND** transition duration 200ms with ease-out

#### Scenario: Card elevation variants
- **WHEN** rendering Card component
- **THEN** support variants:
  - `glass`: Backdrop blur with semi-transparent background
  - `elevated`: Apply layered shadow system
  - `flat`: No shadow (default)

#### Scenario: Input inset styling
- **WHEN** rendering Input component
- **THEN** use inset shadow to simulate depth:
  ```css
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.06);
  ```
- **AND** remove default border styling

### Requirement: Design Token System

The design system SHALL define comprehensive design tokens for typography, spacing, colors, and motion.

#### Scenario: Typography scale
- **WHEN** rendering hero headings
- **THEN** use responsive classes:
  - H1: `text-5xl md:text-6xl lg:text-7xl`
  - H2: `text-4xl md:text-5xl`

#### Scenario: Section spacing
- **WHEN** laying out page sections
- **THEN** use vertical padding: `py-20 md:py-28 lg:py-32`
- **AND** use container: `max-w-7xl mx-auto px-4`

#### Scenario: Color semantic tokens
- **WHEN** styling components
- **THEN** use CSS variables from existing theme system:
  - `var(--primary)`, `var(--background)`, `var(--foreground)`
  - `var(--canvas)`, `var(--surface)`, `var(--text-primary)`
- **AND** MUST NOT use arbitrary Tailwind colors like `bg-[#123456]`

### Requirement: Motion and Animation System

The design system SHALL provide consistent animation patterns using Framer Motion with predefined easing curves.

#### Scenario: FadeInUp entrance animation
- **WHEN** component enters viewport
- **THEN** animate from `{ y: 20, opacity: 0 }` to `{ y: 0, opacity: 1 }`
- **AND** use duration 0.6s
- **AND** use easing `[0.22, 1, 0.36, 1]` (ease-out-expo)

#### Scenario: Stagger children animation
- **WHEN** rendering list of items
- **THEN** delay each child by 0.1s
- **AND** use `staggerChildren` in Framer Motion parent

#### Scenario: Reduced motion support
- **WHEN** user has `prefers-reduced-motion` enabled
- **THEN** disable all animations
- **AND** show final state immediately

### Requirement: Landing Page Architecture Standards

The design system SHALL define standard patterns for landing page sections with responsive layouts.

#### Scenario: Hero section layout
- **WHEN** rendering hero section
- **THEN** use `min-h-[90vh]` for viewport height
- **AND** support layouts: left-text-right-image OR centered
- **AND** optimize largest contentful paint (LCP) with priority image loading

#### Scenario: Logo bar section
- **WHEN** rendering partner/client logos
- **THEN** use Flex layout with `gap-8 md:gap-12`
- **AND** apply `grayscale opacity-60` by default
- **AND** restore color on hover

#### Scenario: Features grid
- **WHEN** rendering features section
- **THEN** use `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- **AND** apply `hover:shadow-lg` to feature cards
- **AND** use micro-animations on hover

#### Scenario: Pricing cards
- **WHEN** rendering pricing section
- **THEN** highlight recommended plan with `scale-105` and `ring-primary`
- **AND** include "Most Popular" badge
- **AND** use elevated card variant

#### Scenario: Testimonial carousel
- **WHEN** rendering testimonials
- **THEN** use Embla Carousel or Masonry Grid layout
- **AND** show circular avatars
- **AND** include quote decoration

### Requirement: Component Upgrade Specifications

The design system SHALL provide upgrade paths for existing components to adopt micro-skeuomorphism patterns.

#### Scenario: Button component variants
- **WHEN** rendering Button component
- **THEN** support variants:
  - `default`: Gradient background with layered shadows
  - `outline`: Border with hover fill
  - `ghost`: Transparent with hover background
  - `link`: Text-only with underline
- **AND** all variants use micro-interaction animations

#### Scenario: Card component variants
- **WHEN** rendering Card component
- **THEN** support variants:
  - `elevated`: Layered shadow system
  - `glass`: Backdrop blur effect
  - `flat`: No elevation
- **AND** use `rounded-[20px]` corners

#### Scenario: Input component states
- **WHEN** rendering Input component
- **THEN** support states:
  - Default: Inset shadow
  - Focus: Ring with primary color
  - Error: Red ring with error message
  - Disabled: Reduced opacity
- **AND** use smooth transitions between states

### Requirement: Design System Documentation

The design system SHALL provide comprehensive documentation in `apps/web/README.md` with guardrails and usage examples.

#### Scenario: Design system mandate
- **WHEN** developers add new UI components
- **THEN** README.md SHALL document:
  - Requirement to use `@/components/ui` components
  - Prohibition of hardcoded colors (no `bg-[#123456]`)
  - Requirement to use CSS variables and color-mix
  - Motion consistency guidelines

#### Scenario: Component usage examples
- **WHEN** developers reference documentation
- **THEN** README.md SHALL include:
  - Code examples for each component variant
  - CSS formula reference for gradients and shadows
  - Motion preset examples with Framer Motion
  - Landing page section templates

#### Scenario: Design system showcase page
- **WHEN** navigating to `/design-system`
- **THEN** display interactive component gallery
- **AND** show all component variants with code examples
- **AND** demonstrate motion patterns
- **AND** provide copy-paste code snippets
