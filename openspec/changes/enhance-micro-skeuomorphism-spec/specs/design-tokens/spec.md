# Design Tokens Specification

## ADDED Requirements

### Requirement: Typography Scale System

The design system MUST implement a 6-level typography scale for responsive text sizing:

| Level    | Tailwind Classes                  | Usage                          |
|----------|-----------------------------------|--------------------------------|
| Hero     | text-5xl md:text-6xl lg:text-7xl  | Landing page main title        |
| Display  | text-4xl md:text-5xl              | Section large titles           |
| Title    | text-2xl md:text-3xl              | Card/feature titles            |
| Subtitle | text-lg md:text-xl                | Subtitles/lead paragraphs      |
| Body     | text-base                         | Body text/paragraphs           |
| Caption  | text-sm                           | Helper text/metadata           |

**Implementation:**
```ts
// design-tokens.ts
export const TYPOGRAPHY_SCALE = {
  hero: 'text-5xl md:text-6xl lg:text-7xl',
  display: 'text-4xl md:text-5xl',
  title: 'text-2xl md:text-3xl',
  subtitle: 'text-lg md:text-xl',
  body: 'text-base',
  caption: 'text-sm',
} as const;
```

#### Scenario: Applying typography to a hero title
Given a landing page hero section,
When implementing the main headline,
Then it should use `TYPOGRAPHY_SCALE.hero` classes for responsive sizing.

#### Scenario: Applying typography to a feature card title
Given a feature card component,
When implementing the card title,
Then it should use `TYPOGRAPHY_SCALE.title` classes.

### Requirement: Spacing System

The design system MUST implement a consistent spacing system for layout:

**Section Vertical Spacing:**
```
py-20 md:py-28 lg:py-32
```
- Mobile: 80px (20 * 4px)
- Tablet: 112px (28 * 4px)
- Desktop: 128px (32 * 4px)

**Container Horizontal Padding:**
```
px-4 sm:px-6 lg:px-8
```
- Mobile: 16px
- Small: 24px
- Large: 32px

**Vertical Stack Spacing:**
```
space-y-4  (16px between elements)
space-y-6  (24px between elements)
space-y-8  (32px between elements)
```

**Implementation:**
```ts
// design-tokens.ts
export const SPACING = {
  section: 'py-20 md:py-28 lg:py-32',
  container: 'px-4 sm:px-6 lg:px-8',
  stack: {
    tight: 'space-y-4',
    normal: 'space-y-6',
    loose: 'space-y-8',
  },
} as const;
```

#### Scenario: Applying section spacing to a landing page section
Given a features section on the landing page,
When implementing the section wrapper,
Then it should use `SPACING.section` for vertical padding.

#### Scenario: Applying container padding to a content wrapper
Given a content container that needs responsive horizontal padding,
When implementing the wrapper,
Then it should use `SPACING.container` classes.

### Requirement: Motion Parameters

The design system MUST implement standardized motion parameters for animations:

**Duration:**
- Fast: 200ms (micro-interactions, button hovers)
- Medium: 300ms (card transitions, dropdowns)
- Slow: 600ms (page entrance animations)

**Easing Curve:**
```
[0.22, 1, 0.36, 1]  // Exponential ease-out
```

**Stagger Delay:**
```
0.1s  // Delay between sequential animations
```

**Implementation:**
```ts
// motion-presets.ts
export const MOTION_DURATION = {
  fast: 0.2,
  medium: 0.3,
  slow: 0.6,
} as const;

export const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as const;

export const STAGGER_DELAY = 0.1;
```

**CSS Variables:**
```css
:root {
  --ms-duration-fast: 200ms;
  --ms-duration-medium: 300ms;
  --ms-duration-slow: 600ms;
  --ms-ease-out-expo: cubic-bezier(0.22, 1, 0.36, 1);
}
```

#### Scenario: Applying motion to a button hover
Given a primary button,
When implementing the hover transition,
Then it should use `MOTION_DURATION.fast` (200ms) with `EASE_OUT_EXPO` easing.

#### Scenario: Applying stagger animation to a feature grid
Given a grid of feature cards,
When implementing entrance animations,
Then it should use `STAGGER_DELAY` (0.1s) between each card.

### Requirement: Color Derivation Rules

All custom colors MUST derive from CSS variables using `color-mix()`:

**Prohibited:**
```css
/* ❌ WRONG: Hardcoded color */
background: #8b5cf6;
box-shadow: 0 4px 12px rgba(139, 92, 246, 0.35);
```

**Required:**
```css
/* ✅ CORRECT: CSS variable with color-mix */
background: var(--primary);
box-shadow: 0 4px 12px color-mix(in srgb, var(--primary) 35%, transparent);
```

**Common Derivations:**
- Lighter: `color-mix(in srgb, var(--color) 85%, white)`
- Darker: `color-mix(in srgb, var(--color) 85%, black)`
- Transparent: `color-mix(in srgb, var(--color) 35%, transparent)`
- Muted: `color-mix(in srgb, var(--color) 60%, var(--muted))`

#### Scenario: Creating a hover background color
Given a button that needs a lighter hover background,
When implementing the hover state,
Then it should use `color-mix(in srgb, var(--primary) 85%, white)`.

#### Scenario: Creating a shadow with brand color
Given a card that needs a colored shadow,
When implementing the shadow,
Then it should use `color-mix(in srgb, var(--primary) 35%, transparent)`.

### Requirement: Rounded Corner Utilities

The design system MUST extend Tailwind with custom rounded corner utilities:

**Tailwind Config Extension:**
```ts
// tailwind.config.ts
export default {
  theme: {
    extend: {
      borderRadius: {
        'card-sm': '16px',
        'card': '20px',
        'card-lg': '24px',
        'card-xl': '32px',
      },
    },
  },
};
```

**Usage:**
```tsx
<div className="rounded-card">      {/* 20px */}
<div className="rounded-card-sm">   {/* 16px */}
<div className="rounded-card-lg">   {/* 24px */}
<div className="rounded-card-xl">   {/* 32px */}
```

**Design Token Export:**
```ts
// design-tokens.ts
export const ROUNDED_CORNERS = {
  small: '16px',
  default: '20px',
  large: '24px',
  xl: '32px',
} as const;
```

#### Scenario: Applying rounded corners to a card
Given a feature card component,
When implementing the border-radius,
Then it should use `rounded-card` (20px) class.

#### Scenario: Applying rounded corners to an input
Given a text input field,
When implementing the border-radius,
Then it should use `rounded-card-sm` (16px) class.

### Requirement: CSS Formula Constants

The design system MUST provide CSS custom properties for visual formulas:

**Gradient Formulas:**
```css
--ms-gradient-primary: linear-gradient(
  135deg,
  var(--primary) 0%,
  color-mix(in srgb, var(--primary) 85%, black) 50%,
  color-mix(in srgb, var(--primary) 70%, black) 100%
);

--ms-gradient-accent: linear-gradient(
  135deg,
  var(--accent) 0%,
  color-mix(in srgb, var(--accent) 85%, black) 50%,
  color-mix(in srgb, var(--accent) 70%, black) 100%
);
```

**Shadow Formulas:**
```css
--ms-shadow-elevated:
  0 4px 12px color-mix(in srgb, var(--primary) 35%, transparent),
  inset 0 1px 0 rgba(255, 255, 255, 0.2),
  inset 0 -1px 0 rgba(0, 0, 0, 0.1);

--ms-shadow-elevated-hover:
  0 6px 20px color-mix(in srgb, var(--primary) 45%, transparent),
  inset 0 1px 0 rgba(255, 255, 255, 0.25),
  inset 0 -1px 0 rgba(0, 0, 0, 0.12);

--ms-shadow-inset:
  inset 0 2px 4px rgba(0, 0, 0, 0.06);

--ms-shadow-glow:
  0 0 20px color-mix(in srgb, var(--primary) 50%, transparent);
```

#### Scenario: Using gradient formula in a button
Given a primary button component,
When implementing the background,
Then it should use `background-image: var(--ms-gradient-primary)`.

#### Scenario: Using shadow formula in a card
Given an elevated card component,
When implementing the shadow,
Then it should use `box-shadow: var(--ms-shadow-elevated)`.

## CROSS-REFERENCE

- **Related to Design Language**: Typography and spacing tokens support DL-001 micro-skeuomorphism
- **Related to Landing Page**: Section spacing (DT-002) applies to all landing page sections
- **Related to Accessibility**: Motion parameters (DT-003) must respect prefers-reduced-motion
