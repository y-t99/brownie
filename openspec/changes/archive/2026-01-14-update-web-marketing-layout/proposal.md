# Change: Update Web Marketing Layout Alignment

## Why

The marketing site layout in `apps/web` is currently hard to iterate on because it mixes multiple container definitions and spacing rules across:
- `PageContainer` (used by the marketing header/footer)
- `Section` (used by most landing-page sections)
- One-off, inline containers (e.g., the logo bar wrapper)

This causes common “I changed it but nothing lines up” failure modes: header gutters do not match section gutters, and changes to one container do not propagate to the others.

Additionally, the marketing root layout uses `flex-1` on `<main>` without a flex column parent, so the intended “header + content + footer” vertical layout behavior is not reliably achieved.

## What Changes

- **NEW**: A single canonical container primitive for marketing pages (max width + horizontal gutters) so all sections and shells align by default.
- **MODIFIED**: `Section` and marketing shell layout to use the canonical container (eliminate drift between header/footer and section content).
- **MODIFIED**: Marketing root layout to be a proper flex column so `main` can grow and the footer placement is predictable.
- **MODIFIED**: Remove/replace inline container usage on the home page (e.g., logo bar wrapper) in favor of the shared primitives.
- **OPTIONAL**: Refine hero split layout constraints so the visual column sizing does not conflict with `max-w-*` + `ml-auto` usage.

## Impact

- **Affected app**: `apps/web` (marketing route group primarily).
- **Affected areas**:
  - Container primitives: `apps/web/src/components/layout/page-container.tsx`, `apps/web/src/components/ui/section.tsx`
  - Marketing shell: `apps/web/app/(marketing)/layout.tsx`
  - Marketing home: `apps/web/app/(marketing)/page.tsx` and `apps/web/src/components/landing/*`
- **Risk**: Adjusting container gutters can shift horizontal spacing across pages. Mitigation: keep the canonical container values stable, and verify `/`, `/design-system`, and a representative `/console/**` page for accidental regressions.

## Non-Goals

- Redesigning the visual system, tokens, or typography.
- Reworking console navigation layout beyond accidental changes caused by shared primitives.
- Introducing a complex layout system (CSS grid framework, new dependency, etc.).

