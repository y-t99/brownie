import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import type { Request, Response } from "express";

import { Public } from "../decorator";
import { AuthService } from "../service";
import { SigninRo, SignupRo } from "./ro";

const DEFAULT_COOKIE_NAME = "brownie_session";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Public()
  @Post("signup")
  async signup(
    @Body() body: SignupRo,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.signup(body);
    setSessionCookie(res, token);
    return token;
  }

  @Public()
  @Post("signin")
  async signin(
    @Body() body: SigninRo,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.signin(body);
    setSessionCookie(res, token);
    return token;
  }

  @Public()
  @Post("logout")
  async logout(@Res({ passthrough: true }) res: Response) {
    clearSessionCookie(res);
    return { ok: true };
  }

  @Public()
  @Get("session")
  async session(@Req() req: Request) {
    const token =
      extractCookie(req.headers.cookie, getCookieName()) ??
      extractBearerToken(req.headers.authorization);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync<{
        user: { uuid: string; name: string; email: string };
      }>(token);
      return { user: payload.user };
    } catch {
      throw new UnauthorizedException();
    }
  }
}

function getCookieName() {
  return process.env.AUTH_COOKIE_NAME || DEFAULT_COOKIE_NAME;
}

function setSessionCookie(res: Response, token: string) {
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

function clearSessionCookie(res: Response) {
  const cookieName = getCookieName();
  const domain = process.env.AUTH_COOKIE_DOMAIN || undefined;

  res.clearCookie(cookieName, { path: "/", domain });
}

function extractBearerToken(headerValue?: string) {
  const [type, token] = headerValue?.split(" ") ?? [];
  return type === "Bearer" ? token : undefined;
}

function extractCookie(cookieHeader: string | undefined, name: string) {
  if (!cookieHeader) return undefined;
  for (const part of cookieHeader.split(";")) {
    const [rawKey, ...rawValueParts] = part.trim().split("=");
    if (rawKey === name) return decodeURIComponent(rawValueParts.join("="));
  }
  return undefined;
}
