import { User } from "@prisma/client";
import { Request } from "express";

import { Role } from "../enum";

export interface AuthPayload {
  user?: Pick<User, "uuid" | "name"> & { roles: Role[] };
}

export type AuthRequest = Request & AuthPayload;
