import { AuthApiError, type SessionResult } from "./auth-api";

export type HomeAuthState =
  | { status: "loading" }
  | { status: "anonymous" }
  | { status: "authenticated"; user: SessionResult["user"] }
  | { status: "error"; error: string };

export type LogoutState =
  | { status: "closed" }
  | { status: "confirming" }
  | { status: "submitting" }
  | { status: "error"; error: string }
  | { status: "success" };

export async function resolveHomeAuthState(
  sessionRequest: Promise<SessionResult>,
): Promise<HomeAuthState> {
  try {
    const session = await sessionRequest;
    return { status: "authenticated", user: session.user };
  } catch (error) {
    if (error instanceof AuthApiError && error.status === 401) {
      return { status: "anonymous" };
    }

    return {
      error: error instanceof Error ? error.message : "Unable to check session",
      status: "error",
    };
  }
}

export function cancelLogout(): LogoutState {
  return { status: "closed" };
}

export function failLogout(error: unknown): LogoutState {
  return {
    error: error instanceof Error ? error.message : "Logout failed",
    status: "error",
  };
}

export function completeLogout(): LogoutState {
  return { status: "success" };
}
