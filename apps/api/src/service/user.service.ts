import * as Crypto from "node:crypto";

import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { Prisma, User } from "@prisma/client";

import { PrismaService } from "../db-provider";
import { generateUUID, UUIDType } from "../util";
import { ERROR_MESSAGE } from "../exception";

const UserProfileView: Prisma.UserSelect = {
  uuid: true,
  name: true,
  email: true,
  created_at: true,
  updated_at: true,
};

@Injectable()
export class UserService {

  private readonly logger = new Logger(UserService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(user: Partial<User>) {
    const uuid = generateUUID(UUIDType.USER)
    const entity = {
      uuid,
      name: user.name,
      email: user.email,
      password: user.password,
      salt: null,
      created_by: user.created_by || uuid,
      updated_by: user.updated_by || uuid,
    };
    if (user.password) {
      const salt = Crypto.randomBytes(16).toString("hex");
      const encryptedPassword = Crypto.createHmac("sha512", salt)
        .update(user.password)
        .digest("hex");
      entity.salt = salt;
      entity.password = encryptedPassword;
    }
    try {
      const record = await this.prisma.user.create({
        data: entity,
        select: {
          uuid: true,
        },
      });
      return record.uuid;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new HttpException(ERROR_MESSAGE.ResourceConflict, HttpStatus.BAD_REQUEST);
        }
      }
      this.logger.error(error);
      throw new HttpException(ERROR_MESSAGE.InternalServerError, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async retrieveUserProfileByUuid(uuid: string) {
    const userRecord = await this.prisma.user.findUnique({
      where: {
        uuid,
      },
      select: UserProfileView,
    });
    if (!userRecord) {
      return null;
    }
    return {
      ...userRecord,
    };
  }

  async retrieveUserProfileByEmail(email: string) {
    const userRecord = await this.prisma.user.findUnique({
      where: {
        email,
      },
      select: UserProfileView,
    });
    if (!userRecord) {
      return null;
    }
    return {
      ...userRecord,
    };
  }

  async comparePassword(uuid: string, password: string) {
    const userRecord = await this.prisma.user.findUnique({
      where: {
        uuid,
      },
      select: {
        password: true,
        salt: true,
      },
    });
    if (!userRecord) {
      return false;
    }
    const encryptedPassword = Crypto.createHmac("sha512", userRecord.salt.trim())
      .update(password)
      .digest("hex");
    return encryptedPassword === userRecord.password.trim();
  }
}
