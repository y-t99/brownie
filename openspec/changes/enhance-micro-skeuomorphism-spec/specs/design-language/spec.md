# Design Language Specification

## ADDED Requirements

### Requirement: Micro-Skeuomorphism Style Definition

The design system MUST implement a "Micro-Skeuomorphism" visual language characterized by:
- Gradient backgrounds that create depth and dimension
- Layered shadow systems that simulate physical thickness
- Subtle micro-interactions that provide tactile feedback

**Prohibited Patterns:**
- Plain `backdrop-blur` as primary visual element (must be combined with color-mix)
- Flat `0 0 Npx` diffuse glow shadows (must use layered 3-shadow system)
- Hardcoded color values (must use CSS variables)

**Implementation:**
- All colors must derive from CSS variables via `color-mix()`
- All shadows must use the 3-layer structure (outer glow + top highlight + bottom edge)
- All interactive elements must have hover/active states

#### Scenario: Applying micro-skeuomorphism to a new component
Given a new Card component,
When implementing the default visual style,
Then it must use `rounded-[20px]`, `background: linear-gradient(...)` with color-mix, and `box-shadow: var(--ms-shadow-elevated)`.

#### Scenario: Violating micro-skeuomorphism constraints
Given a developer applies a flat white background with plain backdrop-blur,
When the component is reviewed,
Then it should be flagged for not meeting micro-skeuomorphism standards.

### Requirement: Three-Stop Gradient Formula

All gradient backgrounds for emphasis areas (buttons, cards, hero sections) MUST use the 3-stop formula:

```css
background: linear-gradient(
  135deg,
  var(--color) 0%,
  color-mix(in srgb, var(--color) 85%, black) 50%,
  color-mix(in srgb, var(--color) 70%, black) 100%
);
```

**Rationale:**
- First stop (0%): Full primary color for brand recognition
- Second stop (50%): 85% color + 15% black for subtle darkening
- Third stop (100%): 70% color + 30% black for accent shadow

**CSS Variable:**
```css
--ms-gradient-primary: linear-gradient(
  135deg,
  var(--primary) 0%,
  color-mix(in srgb, var(--primary) 85%, black) 50%,
  color-mix(in srgb, var(--primary) 70%, black) 100%
);
```

#### Scenario: Creating a gradient for a CTA button
Given a button with `--primary` color variable,
When applying the gradient formula,
Then it should use the exact 3-stop structure with 135deg angle.

#### Scenario: Applying gradient to a card background
Given a feature card that needs emphasis,
When implementing the background,
Then it should apply `--ms-gradient-primary` via `background-image` property.

### Requirement: Three-Layer Shadow Structure

All elevated surfaces MUST use the 3-layer shadow system to simulate physical thickness:

```css
box-shadow:
  0 4px 12px color-mix(in srgb, var(--primary) 35%, transparent),  /* Outer glow */
  inset 0 1px 0 rgba(255, 255, 255, 0.2),                          /* Top highlight */
  inset 0 -1px 0 rgba(0, 0, 0, 0.1);                               /* Bottom edge */
```

**Layer Definitions:**
1. **Outer Glow**: Creates ambient light effect around the element
2. **Top Highlight**: Simulates light reflecting off the top surface
3. **Bottom Edge**: Adds depth by darkening the bottom edge

**CSS Variable:**
```css
--ms-shadow-elevated: 0 4px 12px color-mix(in srgb, var(--primary) 35%, transparent),
  inset 0 1px 0 rgba(255, 255, 255, 0.2),
  inset 0 -1px 0 rgba(0, 0, 0, 0.1);
```

#### Scenario: Adding depth to a pricing card
Given a pricing card that should appear elevated,
When implementing the shadow,
Then it should use `--ms-shadow-elevated` for the default state.

#### Scenario: Enhancing shadow on hover
Given an elevated card on hover state,
When implementing the enhanced shadow,
Then it should use `--ms-shadow-elevated-hover` with 0 6px 20px outer glow.

### Requirement: Rounded Corner System

The design system MUST use a 4-level rounded corner system:

| Level     | Value  | Usage                                    |
|-----------|--------|------------------------------------------|
| Small     | 16px   | Inputs, badges, small buttons            |
| Default   | 20px   | Cards, containers, medium buttons        |
| Large     | 24px   | Modals, dialogs, large containers        |
| XL        | 32px   | Hero sections, full-width containers     |

**Tailwind Extensions:**
```ts
// tailwind.config.ts
borderRadius: {
  'card-sm': '16px',
  'card': '20px',
  'card-lg': '24px',
  'card-xl': '32px',
}
```

#### Scenario: Setting button border-radius
Given a primary action button,
When applying the border-radius,
Then it should use `rounded-[20px]` (Default).

#### Scenario: Setting input border-radius
Given a text input field,
When applying the border-radius,
Then it should use `rounded-[16px]` (Small).

### Requirement: Interactive Element States

All interactive elements MUST implement the following state transitions:

| State    | Transform     | Shadow                    | Opacity/Other            |
|----------|---------------|---------------------------|--------------------------|
| Default  | scale(1)      | --ms-shadow-elevated      | Full opacity             |
| Hover    | scale(1.02)   | --ms-shadow-elevated-hover| Highlight: 0.25          |
| Active   | scale(0.97)   | --ms-shadow-elevated      | Slight compression       |
| Focus    | scale(1)      | --ms-shadow-elevated      | focus-visible: ring-2    |

**Transition Duration:**
- Fast interactions (buttons): 200ms
- Medium interactions (cards): 300ms
- Slow interactions (sections): 600ms

#### Scenario: Button hover transition
Given a primary button,
When user hovers over it,
Then it should smoothly transition over 200ms with scale(1.02) and enhanced shadow.

#### Scenario: Button active press
Given a primary button,
When user presses and holds,
Then it should quickly transition to scale(0.97) over 100ms.

### Requirement: Inner Shadow for Input Elements

Input elements MUST use inset shadows to create a concave effect:

```css
box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.06);
```

**Rationale:**
- Inputs should appear recessed into the page, not floating above
- The inset shadow creates depth perception without using borders

**CSS Variable:**
```css
--ms-shadow-inset: inset 0 2px 4px rgba(0, 0, 0, 0.06);
```

#### Scenario: Styling a text input field
Given a text input for user data entry,
When implementing the visual style,
Then it should use `--ms-shadow-inset` instead of border-based styling.

#### Scenario: Input focus state
Given a focused text input,
When implementing the focus style,
Then it should combine inset shadow with a ring-based focus indicator.

## CROSS-REFERENCE

- **Related to Design Tokens**: The color variables referenced here are defined in `specs/design-tokens/spec.md`
- **Related to Landing Page**: Hero section gradients use DL-002; pricing cards use DL-003
- **Related to Accessibility**: Focus states must meet WCAG requirements (DL-005)
