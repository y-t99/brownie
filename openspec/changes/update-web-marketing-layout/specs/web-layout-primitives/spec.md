# Web Layout Primitives Specification

## ADDED Requirements

### Requirement: Canonical Container Primitive

The `apps/web` application SHALL provide a canonical container primitive that centralizes the max-width and horizontal gutters used by marketing pages.

#### Scenario: Header/footer and sections align
- **WHEN** a user views a marketing page that includes the marketing header and a section rendered via `Section`
- **THEN** the left and right content edges SHALL align across the header, sections, and footer
- **AND** the max-width and gutter values SHALL be defined in one canonical place

### Requirement: Shared Container Used by `PageContainer` and `Section`

The marketing shell container (`PageContainer`) and the section container (`Section`) SHALL use the same canonical container primitive.

#### Scenario: Single change updates all gutters
- **WHEN** a contributor updates the canonical container's gutter values
- **THEN** the rendered gutters for `PageContainer` and `Section` content SHALL update consistently
- **AND** marketing pages SHALL not require one-off `max-w-* px-*` wrappers to maintain alignment

