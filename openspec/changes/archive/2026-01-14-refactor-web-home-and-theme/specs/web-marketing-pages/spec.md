# Web Marketing Pages Specification

## ADDED Requirements

### Requirement: Marketing Home Page

The `apps/web` application SHALL provide a marketing home page at `/` suitable for product introduction and navigation.

#### Scenario: Header navigation
- **WHEN** the user visits `/`
- **THEN** a header SHALL be displayed
- **AND** the header SHALL include a link to `/design-system`

#### Scenario: Hero content and CTAs
- **WHEN** the user views the home page hero section
- **THEN** the page SHALL display:
  - A primary headline describing the product
  - Supporting copy
  - Primary and secondary call-to-action buttons

#### Scenario: Motion on hero content
- **WHEN** the home page renders
- **THEN** hero content and CTAs SHALL animate in using Framer Motion
- **AND** the animation easing/duration SHALL be sourced from shared motion defaults

### Requirement: Design System Showcase Page

The `apps/web` application SHALL provide a `/design-system` page that showcases key UI primitives and typography.

#### Scenario: Showcase key primitives
- **WHEN** the user visits `/design-system`
- **THEN** the page SHALL render examples of core UI primitives used in the app
- **AND** the examples SHALL use semantic theme tokens (no hardcoded colors)

### Requirement: Web README Documents UI Guardrails

The `apps/web/README.md` documentation SHALL include pinned UI guardrails for contributors.

#### Scenario: Document design system mandate
- **WHEN** a contributor reads `apps/web/README.md`
- **THEN** the documentation SHALL include a “Design System Mandate” section that states:
  - No hardcoded colors (no arbitrary Tailwind values)
  - Component-first development using `@/components/ui`
  - Framer Motion-only animations using shared easing curves
