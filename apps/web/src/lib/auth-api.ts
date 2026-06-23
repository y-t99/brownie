export type SigninInput = {
  email: string;
  password: string;
};

export type SignupInput = SigninInput & {
  name: string;
};

export type AuthUser = {
  email: string;
  name: string;
  uuid: string;
};

export type SessionResult = {
  user: AuthUser;
};

type AuthApiOptions = {
  baseUrl?: string;
  fetcher?: typeof fetch;
};

const DEFAULT_API_BASE_URL = "http://localhost:3001/api";

export class AuthApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "AuthApiError";
  }
}

export function signin(input: SigninInput, options?: AuthApiOptions) {
  return requestAuthToken("/auth/signin", input, options);
}

export function signup(input: SignupInput, options?: AuthApiOptions) {
  return requestAuthToken("/auth/signup", input, options);
}

export function getSession(options?: AuthApiOptions) {
  return requestAuthJson<SessionResult>(
    "/auth/session",
    { credentials: "include", method: "GET" },
    options,
  );
}

export function logout(options?: AuthApiOptions) {
  return requestAuthJson<{ ok: true }>(
    "/auth/logout",
    { credentials: "include", method: "POST" },
    options,
  );
}

async function requestAuthToken(
  path: string,
  body: SigninInput | SignupInput,
  options: AuthApiOptions = {},
) {
  const baseUrl =
    options.baseUrl ??
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    DEFAULT_API_BASE_URL;
  const fetcher = options.fetcher ?? fetch;
  const response = await fetcher(`${trimTrailingSlash(baseUrl)}${path}`, {
    body: JSON.stringify(body),
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });
  const responseText = await response.text();

  if (!response.ok) {
    throw new AuthApiError(extractErrorMessage(responseText), response.status);
  }

  return responseText;
}

async function requestAuthJson<T>(
  path: string,
  init: RequestInit,
  options: AuthApiOptions = {},
) {
  const baseUrl =
    options.baseUrl ??
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    DEFAULT_API_BASE_URL;
  const fetcher = options.fetcher ?? fetch;
  const response = await fetcher(`${trimTrailingSlash(baseUrl)}${path}`, init);
  const responseText = await response.text();

  if (!response.ok) {
    throw new AuthApiError(extractErrorMessage(responseText), response.status);
  }

  return JSON.parse(responseText) as T;
}

function trimTrailingSlash(value: string) {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

function extractErrorMessage(responseText: string) {
  if (!responseText) return "Authentication failed";

  try {
    const parsed = JSON.parse(responseText) as {
      error?: string;
      message?: string | string[];
    };

    if (Array.isArray(parsed.message)) return parsed.message.join(", ");
    if (parsed.message) return parsed.message;
    if (parsed.error) return parsed.error;
  } catch {
    return responseText;
  }

  return "Authentication failed";
}
