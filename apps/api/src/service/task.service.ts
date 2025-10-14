import { Injectable } from "@nestjs/common";

import { PrismaService } from "../db-provider";

@Injectable()
export class TaskService {

  constructor(private readonly prisma: PrismaService) {}

  
}