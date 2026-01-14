# Design: Update Web Marketing Layout Alignment

## Context

The marketing route group (`apps/web/app/(marketing)/**`) is intended to share a consistent shell (sticky header + footer) and a consistent horizontal rhythm across sections.

Current implementation mixes multiple container definitions:
- `PageContainer` uses one set of gutters.
- `Section` hardcodes a different set of gutters.
- Some pages add additional one-off containers.

This produces horizontal misalignment and makes iterative layout tuning unreliable because changes do not propagate consistently.

## Goals / Non-Goals

**Goals**
- Establish one canonical container primitive for marketing pages (max width + gutters).
- Ensure marketing header/footer and all landing-page sections align to that container.
- Ensure marketing layout has predictable vertical behavior (`header` + `main` grows + `footer`).

**Non-Goals**
- Overhauling the console layout system.
- Introducing multiple container variants unless required by an explicit design need.

## Decisions

### 1. Canonical container primitive

**Decision:** Introduce a single canonical container primitive and have both `PageContainer` and `Section` use it (either by composition or replacement).

**Rationale:**
- Eliminates container drift and “fix one spot, break another” issues.
- Keeps future changes localized to one file.
- Avoids sprinkling `mx-auto max-w-* px-*` across pages.

**Implementation approach (apply stage):**
- Create `Container` (name TBD) under `apps/web/src/components/layout/`.
- Make `PageContainer` a wrapper/alias around it to preserve existing imports.
- Update `Section` to use the same primitive internally.

### 2. Marketing layout flex column correctness

**Decision:** Ensure the marketing root wrapper is `flex flex-col` so `main` can reliably use `flex-1`.

**Rationale:**
- Current `flex-1` on `<main>` is a no-op without a flex parent, so the intended layout behavior depends on incidental content height.

### 3. Remove one-off container wrappers on the home page

**Decision:** Replace inline `max-w-* px-*` wrappers in the marketing home page with the canonical container primitive or `Section`.

**Rationale:**
- One-off containers reintroduce drift and force manual re-alignment on every new section.

### 4. Hero split layout sizing (optional)

**Decision:** If the split hero visual uses `max-w-*` and alignment utilities that fight the grid column sizing, prefer one source of truth:
- Either the grid defines column sizing and the visual is `w-full`,
- Or the visual is intentionally constrained and the grid columns are adjusted accordingly.

**Rationale:**
- Mixed constraints (grid ratio + `max-w-*` + `ml-auto`) can create unused whitespace and make the left column feel artificially narrow.

## Validation Strategy

- Manual visual checks for `/` at common breakpoints (mobile, tablet, desktop) focusing on header/section alignment.
- Manual check for `/design-system` to confirm consistent gutters.
- Quick smoke check of a console route to ensure shared primitives did not introduce unintended layout regressions.
- Run `pnpm -s --filter=web lint`, `pnpm -s --filter=web check-types`, `pnpm -s --filter=web build`.

