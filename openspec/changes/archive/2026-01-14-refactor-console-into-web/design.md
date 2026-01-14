# Design: Integrate Developer Console Into `apps/web`

## Goals

- Host all Developer Console pages under a single Next.js app (`apps/web`).
- Avoid route collisions with existing `apps/web` pages by mounting console routes under `/console`.
- Preserve the existing console auth flow (cookie-based session + redirect to login with `next` parameter).

## Key Decisions

### Mount point and routes

- Console base path: `/console`
- Login path: `/console/login`
- Dashboard path: `/console`
- Transactions path: `/console/transactions`

This keeps the console isolated from marketing/landing routes, while still being part of the same deployment.

### Middleware scope

`apps/web/middleware.ts` SHOULD apply auth protection only to `/console/**` routes, leaving non-console pages unaffected.

### Styling approach

`apps/web` will adopt Tailwind for the console pages. The migration will:

- Add Tailwind/PostCSS configuration under `apps/web/`
- Merge the console's Tailwind global styles into `apps/web/app/globals.css`
- Keep existing non-console styles working (landing page can continue using CSS modules)

Fonts for the console are applied via CSS variables (`--font-sans`, `--font-mono`) on the `/console` layout using self-hosted font assets already present in `apps/web`.

### Removal of `apps/console`

After confirming `apps/web` renders console routes correctly and builds successfully, the `apps/console` package will be removed from the workspace to prevent drift and duplicated maintenance.
