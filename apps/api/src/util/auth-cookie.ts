import type { Response } from "express";

const DEFAULT_COOKIE_NAME = "brownie_session";

export function getCookieName() {
  return process.env.AUTH_COOKIE_NAME || DEFAULT_COOKIE_NAME;
}

export function setSessionCookie(res: Response, token: string) {
  const isProd = process.env.NODE_ENV === "production";
  const cookieName = getCookieName();
  const domain = process.env.AUTH_COOKIE_DOMAIN || undefined;
  const sameSite =
    (process.env.AUTH_COOKIE_SAMESITE as "lax" | "none" | "strict") || "lax";

  res.cookie(cookieName, token, {
    httpOnly: true,
    secure: isProd,
    sameSite,
    domain,
    path: "/",
  });
}

export function clearSessionCookie(res: Response) {
  const cookieName = getCookieName();
  const domain = process.env.AUTH_COOKIE_DOMAIN || undefined;

  res.clearCookie(cookieName, { path: "/", domain });
}

export function extractBearerToken(headerValue?: string) {
  const [type, token] = headerValue?.split(" ") ?? [];
  return type === "Bearer" ? token : undefined;
}

export function extractCookie(cookieHeader: string | undefined, name: string) {
  if (!cookieHeader) return undefined;
  for (const part of cookieHeader.split(";")) {
    const [rawKey, ...rawValueParts] = part.trim().split("=");
    if (rawKey === name) return decodeURIComponent(rawValueParts.join("="));
  }
  return undefined;
}
