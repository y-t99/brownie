# Change: Refactor Web Home Page and Unify Web Theme

## Why

`apps/web` currently ships with the default Turborepo landing page and does not provide a cohesive, product-oriented marketing home experience. In addition, UI theming conventions are not formally documented for the web app, which increases the likelihood of inconsistent styling and one-off color usage as the UI grows.

This change refactors the `/` home page into a polished marketing page, adds a `/design-system` showcase route for component reference, and unifies the theme system across the entire `apps/web` app (including `/console`) using semantic tokens and consistent motion primitives.

## What Changes

- **NEW**: Marketing layout for web pages (header, footer) and a refactored Home page at `/` in `apps/web`.
- **NEW**: Design System showcase page at `/design-system` in `apps/web`.
- **NEW**: Motion primitives for consistent animations (Framer Motion) and icon usage (Lucide + optional React Icons).
- **NEW**: Documented UI guardrails added to `apps/web/README.md`:
  - **Design System Mandate**
  - **No Hardcoded Colors** (prohibit Tailwind arbitrary color values like `bg-[#123456]`)
  - **Component First** (prefer `@/components/ui` components)
  - **Consistent Motion** (Framer Motion + shared easing)
- **MODIFIED**: Theme system for `apps/web` to be applied consistently across marketing pages and the developer console (`/console/**`), without changing console routing or functionality.

### Technology Additions (apps/web)

- `framer-motion` for animations
- `lucide-react` for icons
- `react-icons` (optional) for brand/social icons
- `tailwind-variants` (optional) for class composition in new UI surfaces
- `clsx` is already present in `apps/web` and will remain the standard utility (alongside existing `cn` helpers)

## Impact

- **Affected apps**: `apps/web` (marketing pages + global theming), `/console/**` pages inherit the unified theme.
- **Affected specs**: Adds `web-theme-system` and `web-marketing-pages` capabilities (delta specs in this change).
- **Risk**: Global theme/token changes could visually regress `/console` UI; mitigated by preserving existing semantic token names and validating console pages after theme changes.
- **Non-Goals**:
  - No change to `/console` routing, authentication, or data flows.
  - No redesign of console UX beyond inheriting the unified theme tokens.

