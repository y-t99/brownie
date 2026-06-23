import { describe, expect, it } from "vitest";

import { AuthApiError } from "./auth-api";
import {
  cancelLogout,
  completeLogout,
  failLogout,
  resolveHomeAuthState,
} from "./auth-ui-state";

describe("auth UI state", () => {
  it("resolves an authenticated homepage session", async () => {
    const state = await resolveHomeAuthState(
      Promise.resolve({
        user: {
          email: "ada@example.com",
          name: "Ada Lovelace",
          uuid: "user-1",
        },
      }),
    );

    expect(state).toEqual({
      status: "authenticated",
      user: {
        email: "ada@example.com",
        name: "Ada Lovelace",
        uuid: "user-1",
      },
    });
  });

  it("treats a 401 session response as anonymous", async () => {
    const state = await resolveHomeAuthState(
      Promise.reject(new AuthApiError("Unauthorized", 401)),
    );

    expect(state).toEqual({ status: "anonymous" });
  });

  it("keeps unexpected session errors retryable", async () => {
    const state = await resolveHomeAuthState(
      Promise.reject(new AuthApiError("Service unavailable", 503)),
    );

    expect(state).toEqual({
      error: "Service unavailable",
      status: "error",
    });
  });

  it("closes the logout dialog when cancellation is confirmed", () => {
    expect(cancelLogout()).toEqual({ status: "closed" });
  });

  it("keeps a failed logout open with a retryable error", () => {
    expect(failLogout(new AuthApiError("Logout failed", 503))).toEqual({
      error: "Logout failed",
      status: "error",
    });
  });

  it("marks a successful logout ready for redirect", () => {
    expect(completeLogout()).toEqual({ status: "success" });
  });
});
