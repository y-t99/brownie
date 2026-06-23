# Authenticated Home and Confirmed Logout Design

## Context

The web homepage currently always renders sign-in and account-creation forms. The API already establishes an HTTP-only session cookie and exposes `GET /api/auth/session` and `POST /api/auth/logout`. The chat sidebar currently treats logout as a plain link to `/`, so it neither confirms intent nor invalidates the server-managed cookie.

## Goals

- Detect the existing session before showing homepage authentication controls.
- Show the authenticated user's name and email with a direct link to `/chat`.
- Confirm logout from `/chat` before calling the existing API.
- Redirect to `/` only after logout succeeds.
- Keep the user on `/chat` and allow retry when logout fails.

## Decisions

### Client-side session check

`LoginPage` will call a typed `getSession()` helper on mount. While the request is pending, the authentication card will show a stable loading state so the sign-in form does not flash. A 401 response means the visitor is unauthenticated and reveals the existing forms. Other failures produce a retryable error state instead of incorrectly presenting the visitor as logged out.

This approach reuses the existing API and HTTP-only cookie model without adding server-to-server cookie forwarding or deployment-specific API configuration to the Next.js server.

### Shared auth API helpers

`apps/web/src/lib/auth-api.ts` will expose:

- `getSession()` for `GET /auth/session`
- `logout()` for `POST /auth/logout`

Both requests include credentials. Error parsing remains centralized in `AuthApiError`.

### Logout confirmation

The chat sidebar logout action will open an accessible modal. Cancel closes it. Confirm calls `logout()`, disables controls while pending, and redirects with a route refresh only on success. A failed request leaves the dialog open and displays the API error with a retry option.

## Testing

- Extend the auth API unit tests to verify session and logout request shape, response parsing, and errors.
- Extract small state-transition helpers for homepage session resolution and logout outcomes so the key UI behavior can be tested without introducing a new DOM testing dependency.
- Run the focused Vitest suite, TypeScript checks, and the web build.

## Non-goals

- Protecting `/chat` with middleware or redirecting unauthenticated visitors.
- Token revocation or server-side session storage.
- Redesigning the existing homepage or chat workspace.
