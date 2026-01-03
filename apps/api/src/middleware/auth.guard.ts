import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

import { IS_PUBLIC_KEY } from "../decorator";
import { AuthPayload } from "../type";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      return false;
    }
    try {
      const payload = await this.jwtService.verifyAsync<AuthPayload>(token);
      for (const key in payload) {
        request[key] = payload[key];
      }
    } catch {
      return false;
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    if (type === "Bearer") return token;

    const cookieHeader = request.headers.cookie;
    if (!cookieHeader) return undefined;

    const cookieName = process.env.AUTH_COOKIE_NAME || "brownie_session";
    for (const part of cookieHeader.split(";")) {
      const [rawKey, ...rawValueParts] = part.trim().split("=");
      if (rawKey !== cookieName) continue;
      return decodeURIComponent(rawValueParts.join("="));
    }

    return undefined;
  }
}
