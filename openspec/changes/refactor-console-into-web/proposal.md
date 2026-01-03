# Change: Refactor Developer Console Into Web App

## Why

The Developer Console currently exists as a separate Next.js application in `apps/console` (served on a separate port during development). Maintaining multiple Next.js apps increases operational overhead (duplicated config, deploy targets, auth routing, and styling concerns).

Integrating the Developer Console into `apps/web` reduces deployment surface area, enables shared routing and infrastructure, and keeps user-facing pages in a single application.

## What Changes

- **BREAKING**: Serve the Developer Console from `apps/web` under `/console` (e.g. `/console`, `/console/transactions`, `/console/login`) instead of a standalone app in `apps/console`.
- Move the existing console routes, middleware, and supporting modules into `apps/web`.
- Add Tailwind/PostCSS configuration to `apps/web` to support console UI styling.
- Deprecate and remove the standalone `apps/console` package after the migration is verified.

## Impact

- **Affected capability**: `developer-console` (routing + packaging/deployment)
- **Affected code**:
  - `apps/console/**` (source of truth to migrate)
  - `apps/web/**` (new console location)
  - `pnpm-workspace.yaml` (workspace membership)
  - Root documentation/scripts referencing console dev/build (if any)
- **Deployment**: Console and web pages deploy as a single Next.js application (`apps/web`).

## Open Questions

1. Should the existing `apps/web` landing page remain at `/`, with the console at `/console`, or should `/` redirect to `/console`?
2. After migration, should `apps/console` be deleted immediately, or moved to an archive location for reference?

