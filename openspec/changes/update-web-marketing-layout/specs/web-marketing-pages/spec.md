# Web Marketing Pages Specification

## MODIFIED Requirements

### Requirement: Marketing Layout Provides Predictable Vertical Structure

The marketing route group in `apps/web` SHALL implement a predictable vertical layout structure: header, main content, and footer.

#### Scenario: Main grows and footer placement is stable
- **WHEN** a marketing page has short content
- **THEN** the main content area SHALL be able to grow to fill the remaining viewport height
- **AND** the footer SHALL remain at the bottom of the page without relying on incidental content height

## ADDED Requirements

### Requirement: Marketing Home Page Uses Shared Layout Primitives

Marketing pages (including `/`) SHALL use shared layout primitives for horizontal gutters and avoid one-off inline container wrappers.

#### Scenario: No inline container drift on home page
- **WHEN** a contributor adds or edits sections on the marketing home page (`/`)
- **THEN** the page SHALL use `Section` and/or the canonical container primitive for horizontal layout
- **AND** the page SHALL NOT introduce bespoke wrappers that redefine `max-w-* px-*` in-line

### Requirement: Split Hero Layout Avoids Conflicting Width Constraints (Optional)

When the marketing home page uses the split hero layout, the text and visual columns SHALL not be constrained by conflicting layout rules that create unused whitespace.

#### Scenario: Hero visual fills its grid column
- **WHEN** the viewport is at or above the `lg` breakpoint
- **THEN** the hero visual container SHALL size consistently with the grid column sizing rules
- **AND** the visual SHALL not require `ml-auto` + `max-w-*` constraints that fight the grid layout

