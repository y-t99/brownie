import { Controller, Param, Post, Req } from "@nestjs/common";
import { AuthRequest } from "src/type";

import { Roles } from "../decorator";
import { Role } from "../enum";
import { TaskService } from "../service";

@Controller('task')
export class TaskController {

  constructor(private readonly taskService: TaskService) {}

  @Roles(Role.Admin)
  @Post('trigger/callback/:state')
  async triggerCallback(@Req() req: AuthRequest, @Param('state') state: string) {

  }
}