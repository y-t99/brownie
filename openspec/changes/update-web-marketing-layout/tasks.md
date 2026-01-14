# Implementation Tasks

## 1. Container unification

- [x] 1.1 Add a canonical container primitive for `apps/web` layout.
- [x] 1.2 Update `PageContainer` to use the canonical container (preserve import path).
- [x] 1.3 Update `Section` to use the canonical container internally (remove hardcoded gutter drift).

## 2. Marketing layout correctness

- [x] 2.1 Update `apps/web/app/(marketing)/layout.tsx` root wrapper to be a flex column so `main` growth is reliable.
- [x] 2.2 Ensure header/footer alignment matches section content after container unification.

## 3. Home page cleanup

- [x] 3.1 Replace one-off `max-w-* px-*` wrappers on the marketing home page with `Section`/canonical container usage.
- [x] 3.2 (Optional) Adjust split hero visual constraints to avoid conflicting layout rules.

## 4. Validation

- [x] 4.1 Run `pnpm -s --filter=web lint`.
- [x] 4.2 Run `pnpm -s --filter=web check-types`.
- [x] 4.3 Run `pnpm -s --filter=web build`.
- [ ] 4.4 Manually verify `/`, `/design-system`, and one `/console/**` page across light/dark.
