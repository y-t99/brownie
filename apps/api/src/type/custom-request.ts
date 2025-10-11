import { User } from "@prisma/client";

import { Role } from "../enum";

export interface AuthRequest extends Request {
  user: User;
  roles: Role[];
}