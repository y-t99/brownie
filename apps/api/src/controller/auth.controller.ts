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
import {
  clearSessionCookie,
  extractBearerToken,
  extractCookie,
  getCookieName,
  setSessionCookie,
} from "../util";
import { SigninRo, SignupRo } from "./ro";

/**
 * todo: token should be stored to redis
 */
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
