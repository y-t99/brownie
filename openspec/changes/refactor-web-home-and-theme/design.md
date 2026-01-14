# Design: Refactor Web Home Page and Unify Web Theme

## Context

The repository already contains a Next.js App Router app at `apps/web` with a developer console under `/console/**`, and a minimal starter landing page at `/` (`apps/web/app/page.tsx`). The console UI currently uses semantic Tailwind classes such as `bg-canvas`, `text-text-primary`, and component primitives under `apps/web/src/components/ui`.

This change introduces marketing pages and a design system showcase, while unifying a single theme system across the entire `apps/web` app, including `/console`.

## Goals / Non-Goals

**Goals**
- Replace the starter home page with a marketing-quality home page.
- Add a `/design-system` page to quickly reference UI primitives and patterns.
- Apply a single, consistent theme system across all `apps/web` routes, including `/console`.
- Codify UI guardrails in `apps/web/README.md` to prevent styling drift.

**Non-Goals**
- Rebuild or re-architect the developer console.
- Introduce a full design token pipeline or multi-theme switcher beyond CSS variables.
- Add complex animations everywhere; use motion sparingly and consistently.

## Decisions

### 1. Routing and Layout: Next.js App Router

**Decision:** Implement marketing layout and routes using Next.js App Router conventions (not `react-router-dom`).

**Rationale:**
- `apps/web` is already a Next.js App Router project.
- Marketing pages can use their own layout segment without impacting `/console/**` layouts.

**Proposed structure:**
- `apps/web/app/(marketing)/layout.tsx` for the marketing header/footer shell
- `apps/web/app/(marketing)/page.tsx` for `/`
- `apps/web/app/(marketing)/design-system/page.tsx` for `/design-system`
- `/console/**` remains under `apps/web/app/console/**` and keeps its layout separation

### 2. Theme System: CSS Variable-driven semantic tokens

**Decision:** Move `apps/web` color tokens to be CSS-variable-driven and consumed via semantic Tailwind classes.

**Rationale:**
- Allows a cohesive theme to apply across both marketing and console surfaces.
- Enforces the “No Hardcoded Colors” rule in component code by using semantic classes.
- Minimizes churn by preserving existing semantic class names where feasible (e.g., `bg-canvas`, `text-text-primary`).

**Approach:**
- Define a set of CSS variables (including dark mode values) in a global stylesheet.
- Map Tailwind color tokens to those variables so components use semantic classes, not arbitrary values.
- Optionally include shadcn-compatible variable names (`--background`, `--foreground`, etc.) to ease component sourcing.

### 3. Component Library Strategy: Build on existing `@/components/ui`

**Decision:** Continue using `apps/web/src/components/ui/*` as the canonical local UI primitives for `apps/web`.

**Rationale:**
- The developer console already imports from `@/components/ui/*`.
- Avoids a disruptive component rehome to `packages/ui` for this change.

### 4. Motion: Framer Motion with shared easing constants

**Decision:** Use Framer Motion for interactive/hero animations and centralize easing/duration defaults.

**Rationale:**
- Meets the “Consistent Motion” principle with a single source of truth for animation curves.
- Avoids ad-hoc transition tuning across components.

## Risks / Trade-offs

- **Theme regressions in `/console`**: Changing token sources can alter contrast or borders; mitigate with manual smoke tests of `/console/login` and `/console/transactions` plus visual checks in light/dark.
- **Partial Shadcn adoption**: Using shadcn tooling is optional; the priority is semantic theming and consistency over strict tooling compliance.

