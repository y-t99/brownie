
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../db-provider';
import { User } from '@prisma/client';

@Injectable()
export class UserService {

  constructor(private readonly prisma: PrismaService) {}

  async findOne(username: string): Promise<User> {
    return null;
  }
}
