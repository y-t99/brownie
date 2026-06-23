# Authenticated Home and Confirmed Logout Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the homepage login form for authenticated users and require a successful, confirmed API logout before leaving `/chat`.

**Architecture:** Add credentialed session/logout functions to the existing auth API module. Drive the homepage and logout dialog through explicit, testable UI states while preserving the current visual language and routes.

**Tech Stack:** Next.js 15, React 19, TypeScript, Vitest, existing NestJS auth endpoints

---

### Task 1: Auth API session and logout helpers

**Files:**

- Modify: `apps/web/src/lib/auth-api.test.ts`
- Modify: `apps/web/src/lib/auth-api.ts`

**Step 1: Write failing tests**

Add tests asserting that `getSession()` sends a credentialed `GET /auth/session`, parses `{ user }`, and preserves 401 status through `AuthApiError`. Add a test asserting that `logout()` sends a credentialed `POST /auth/logout` and parses `{ ok: true }`.

**Step 2: Verify RED**

Run: `pnpm exec vitest run apps/web/src/lib/auth-api.test.ts`

Expected: FAIL because `getSession` and `logout` are not exported.

**Step 3: Implement minimal helpers**

Add typed session/user results and a shared auth request function that handles JSON and existing text token responses.

**Step 4: Verify GREEN**

Run: `pnpm exec vitest run apps/web/src/lib/auth-api.test.ts`

Expected: PASS.

### Task 2: Homepage authenticated state

**Files:**

- Create: `apps/web/src/lib/auth-ui-state.test.ts`
- Create: `apps/web/src/lib/auth-ui-state.ts`
- Modify: `apps/web/src/components/stitch-dashboard/login-page.tsx`

**Step 1: Write failing state tests**

Test that a successful session becomes authenticated, a 401 becomes anonymous, and other failures become a retryable error.

**Step 2: Verify RED**

Run: `pnpm exec vitest run apps/web/src/lib/auth-ui-state.test.ts`

Expected: FAIL because the state resolver does not exist.

**Step 3: Implement state resolver and UI**

Add the resolver, call `getSession()` from a mount effect, and render loading, authenticated, anonymous, and retryable error states within the existing card.

**Step 4: Verify GREEN**

Run: `pnpm exec vitest run apps/web/src/lib/auth-ui-state.test.ts apps/web/src/lib/auth-api.test.ts`

Expected: PASS.

### Task 3: Confirmed logout

**Files:**

- Modify: `apps/web/src/lib/auth-ui-state.test.ts`
- Modify: `apps/web/src/lib/auth-ui-state.ts`
- Modify: `apps/web/src/components/stitch-dashboard/workspace.tsx`

**Step 1: Write failing logout state tests**

Test that cancellation closes the dialog, a failed logout preserves the open dialog with an error, and success permits redirect.

**Step 2: Verify RED**

Run: `pnpm exec vitest run apps/web/src/lib/auth-ui-state.test.ts`

Expected: FAIL because logout transitions do not exist.

**Step 3: Implement modal and API integration**

Replace the logout link with a button, add the confirmation dialog, call `logout()` on confirmation, and redirect only after success.

**Step 4: Verify GREEN**

Run: `pnpm exec vitest run apps/web/src/lib/auth-ui-state.test.ts apps/web/src/lib/auth-api.test.ts`

Expected: PASS.

### Task 4: Full verification

**Files:**

- Modify: `openspec/changes/add-authenticated-home-and-confirmed-logout/tasks.md`

**Step 1: Run focused tests**

Run: `pnpm exec vitest run apps/web/src/lib/auth-api.test.ts apps/web/src/lib/auth-ui-state.test.ts`

Expected: all tests pass.

**Step 2: Run type checks**

Run: `pnpm --filter web check-types`

Expected: exit code 0.

**Step 3: Run production build**

Run: `pnpm --filter web build`

Expected: exit code 0.

**Step 4: Update OpenSpec checklist**

Mark each implementation task complete only after the matching verification succeeds.
