# Implementation Tasks

## 1. Routing & App Integration

- [x] 1.1 Add console routes under `apps/web/app/console/*` (`/console`, `/console/transactions`, `/console/login`)
- [x] 1.2 Add `apps/web/middleware.ts` to protect `/console/**` routes and preserve `next` redirect behavior
- [x] 1.3 Update console navigation links to use `/console/*` URLs

## 2. Code Migration

- [x] 2.1 Move console components into `apps/web` (e.g. `apps/web/src/console/**`) and update imports
- [x] 2.2 Move console API client, hooks, and types into `apps/web` and update references
- [x] 2.3 Add a stable import alias in `apps/web/tsconfig.json` (e.g. `@/*`) for migrated modules

## 3. Styling & Fonts

- [x] 3.1 Add Tailwind + PostCSS config to `apps/web` (matching console theme tokens)
- [x] 3.2 Merge console Tailwind globals into `apps/web/app/globals.css` without breaking existing landing page styling
- [x] 3.3 Ensure console font variables (`--font-sans`, `--font-mono`) are applied for `/console/*` pages (self-hosted)

## 4. Workspace Cleanup

- [x] 4.1 Remove the standalone `apps/console` package from the workspace after migration is verified
- [x] 4.2 Update docs/scripts that reference `pnpm dev --filter=console` to use `pnpm dev --filter=web`

## 5. Verification

- [x] 5.1 Run `pnpm -s --filter=web lint`
- [x] 5.2 Run `pnpm -s --filter=web check-types`
- [x] 5.3 Run `pnpm -s --filter=web build`
