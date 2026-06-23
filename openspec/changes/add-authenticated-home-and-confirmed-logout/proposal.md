# Change: Add authenticated homepage and confirmed logout

## Why

Authenticated users currently see authentication forms on the homepage, while the chat logout control only navigates away without clearing the session cookie.

## What Changes

- Detect the current session on the homepage.
- Replace authentication forms with user context and a `/chat` call to action when authenticated.
- Add a confirmation dialog to the `/chat` logout action.
- Call the existing logout API and redirect only after success.
- Keep failed logout attempts on `/chat` with retryable feedback.

## Impact

- Affected specs: web-authentication
- Affected code: `apps/web/src/lib/auth-api.ts`, homepage login UI, chat workspace UI
