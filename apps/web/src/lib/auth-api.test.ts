import { describe, expect, it, vi } from "vitest";

import { AuthApiError, getSession, logout, signin, signup } from "./auth-api";

describe("auth API", () => {
  it("signs in with credentials and includes session cookies", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      text: async () => "jwt-token",
    });

    const token = await signin(
      { email: "ada@example.com", password: "password123" },
      { baseUrl: "http://localhost:3001/api", fetcher: fetchMock },
    );

    expect(token).toBe("jwt-token");
    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:3001/api/auth/signin",
      {
        body: JSON.stringify({
          email: "ada@example.com",
          password: "password123",
        }),
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        method: "POST",
      },
    );
  });

  it("signs up with name, email, password and includes session cookies", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      text: async () => "new-jwt-token",
    });

    const token = await signup(
      {
        email: "grace@example.com",
        name: "Grace Hopper",
        password: "password123",
      },
      { baseUrl: "http://localhost:3001/api", fetcher: fetchMock },
    );

    expect(token).toBe("new-jwt-token");
    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:3001/api/auth/signup",
      {
        body: JSON.stringify({
          email: "grace@example.com",
          name: "Grace Hopper",
          password: "password123",
        }),
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        method: "POST",
      },
    );
  });

  it("surfaces API error messages", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      text: async () =>
        JSON.stringify({
          message: "Invalid credentials",
        }),
    });

    await expect(
      signin(
        { email: "ada@example.com", password: "wrongpass" },
        { baseUrl: "http://localhost:3001/api", fetcher: fetchMock },
      ),
    ).rejects.toThrow("Invalid credentials");
  });

  it("loads the current session with credentials", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      text: async () =>
        JSON.stringify({
          user: {
            email: "ada@example.com",
            name: "Ada Lovelace",
            uuid: "user-1",
          },
        }),
    });

    const session = await getSession({
      baseUrl: "http://localhost:3001/api",
      fetcher: fetchMock,
    });

    expect(session.user).toEqual({
      email: "ada@example.com",
      name: "Ada Lovelace",
      uuid: "user-1",
    });
    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:3001/api/auth/session",
      {
        credentials: "include",
        method: "GET",
      },
    );
  });

  it("preserves the session error status", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      text: async () => JSON.stringify({ message: "Unauthorized" }),
    });

    const request = getSession({
      baseUrl: "http://localhost:3001/api",
      fetcher: fetchMock,
    });

    await expect(request).rejects.toMatchObject({
      message: "Unauthorized",
      status: 401,
    } satisfies Partial<AuthApiError>);
  });

  it("logs out with credentials", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      text: async () => JSON.stringify({ ok: true }),
    });

    const result = await logout({
      baseUrl: "http://localhost:3001/api",
      fetcher: fetchMock,
    });

    expect(result).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:3001/api/auth/logout",
      {
        credentials: "include",
        method: "POST",
      },
    );
  });
});
