# Web Theme System Specification

## ADDED Requirements

### Requirement: Unified Theme Tokens Across `apps/web`

The `apps/web` application SHALL use a unified theme system (light and dark) across all routes, including `/console/**`.

#### Scenario: Marketing and console share the same theme tokens
- **WHEN** a user visits `/` and `/console/transactions`
- **THEN** both surfaces SHALL use the same semantic theme tokens for background, text, borders, and accent
- **AND** tokens SHALL be sourced from CSS variables to enable consistent light/dark behavior

#### Scenario: Preserve existing semantic class usage for console
- **WHEN** console pages use existing semantic classes (e.g., `bg-canvas`, `text-text-primary`, `border-surface-border`)
- **THEN** those classes SHALL continue to resolve to valid theme colors under the unified theme system

### Requirement: No Hardcoded Color Values in Component Code

The web UI codebase SHALL prohibit ad-hoc, per-element color values in Tailwind classes.

#### Scenario: Reject Tailwind arbitrary color values
- **WHEN** a contributor authors UI styles
- **THEN** the contributor SHALL NOT use Tailwind arbitrary color values such as `bg-[#123456]`, `text-[rgb(1,2,3)]`, or similar one-off colors
- **AND** the contributor SHALL use semantic Tailwind classes backed by theme tokens (e.g., `bg-canvas`, `text-text-primary`, `bg-background`, `text-muted-foreground`)

## MODIFIED Requirements

### Requirement: Global Styles Apply Theme System

The global stylesheet for `apps/web` SHALL apply the unified theme variables without breaking existing route layouts.

#### Scenario: Console layouts remain isolated
- **WHEN** a user visits any `/console/**` route
- **THEN** the console route group SHALL continue to control its own layout structure
- **AND** only the shared theme tokens (colors/typography primitives) SHALL be applied globally

