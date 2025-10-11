
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

import { PrismaService } from '../db-provider';

@Injectable()
export class UserService {

  constructor(private readonly prisma: PrismaService) {}

  async findOne(username: string): Promise<User> {
    return null;
  }
}
