import * as Crypto from 'node:crypto';

import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';

import { PrismaService } from '../db-provider';
import { generateUUID, UUIDType } from '../util';

const UserProfileView: Prisma.UserSelect = {
  uuid: true,
  name: true,
  email: true,
  created_at: true,
  updated_at: true,
}

@Injectable()
export class UserService {

  constructor(private readonly prisma: PrismaService) {}

  async create(user: Partial<User>) {
    const entity = {
      uuid: generateUUID(UUIDType.USER),
      name: user.name,
      email: user.email,
      password: user.password,
      salt: null,
      created_by: user.created_by,
      updated_by: user.updated_by,
    }
    if (user.password) {
      const salt = Crypto.randomBytes(16).toString('hex');
      const encryptedPassword = Crypto.createHmac('sha512', salt)
        .update(user.password)
        .digest('hex');
      entity.salt = salt;
      entity.password = encryptedPassword;
    }
    const record = await this.prisma.user.create({
      data: entity,
      select: {
        uuid: true,
      }
    });
    return record.uuid;
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
    }
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
    }
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
    const encryptedPassword = Crypto.createHmac('sha512', userRecord.salt)
        .update(password)
        .digest('hex');
    return encryptedPassword === userRecord.password;
  }
}
