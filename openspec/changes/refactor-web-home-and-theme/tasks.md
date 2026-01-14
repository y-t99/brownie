# Implementation Tasks

## 1. Dependencies and UI tooling

- [x] Add web dependencies: `framer-motion`, `lucide-react`, `react-icons`, `tailwind-variants` (if used) to `apps/web/package.json`.
- [x] (Optional) Initialize shadcn tooling for `apps/web` if needed to source components consistently (e.g., create `components.json` and adopt shadcn conventions). (Not needed for this change.)

## 2. Theme unification (applies to all routes including `/console`)

- [x] Define CSS variables for the unified theme (light/dark) in `apps/web/app/globals.css` (or a dedicated imported stylesheet).
- [x] Update `apps/web/tailwind.config.ts` to reference CSS variables for semantic tokens while preserving existing semantic class names used by console pages.
- [x] Validate that `/console/login` and `/console/transactions` remain visually readable and functional in both light and dark modes.

## 3. Marketing layout and home page

- [x] Add a marketing layout segment providing header/footer shell for non-console pages.
- [x] Refactor the home page (`/`) to a hero-led marketing page using existing UI primitives and the unified theme tokens.
- [x] Add Framer Motion slide-in/fade-in animations for the hero content and primary CTAs, using shared motion constants.

## 4. Design System page

- [x] Add `/design-system` route to showcase key UI primitives (`Button`, `Card`, `Badge`, `Tooltip`, etc.) and typography.
- [x] Keep showcase content lightweight and aligned to the theme tokens.

## 5. Documentation guardrails

- [x] Update `apps/web/README.md` with a pinned “Design System Mandate” section including:
  - **No Hardcoded Colors** (no Tailwind arbitrary color values)
  - **Component First** (check `@/components/ui` before building custom primitives)
  - **Consistent Motion** (Framer Motion only + shared easing)

## 6. Validation

- [x] Run `pnpm -s --filter=web lint`
- [x] Run `pnpm -s --filter=web check-types`
- [x] Run `pnpm -s --filter=web build`
