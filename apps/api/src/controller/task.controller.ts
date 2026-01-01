import { Body, Controller, Param, Post, Req } from "@nestjs/common";
import { AuthRequest } from "src/type";

import { Roles } from "../decorator";
import { Role } from "../enum";
import { TaskService } from "../service";
import { T2MNanoBananaProRo } from "./ro/task.ro";

@Controller("task")
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Roles(Role.Admin)
  @Post("trigger/callback/:state")
  async triggerCallback(
    @Req() _req: AuthRequest,
    @Param("state") _state: string,
  ) {}

  @Post("text2image/nano-banana-pro")
  async nanoBananaPro(
    @Req() req: AuthRequest,
    @Body() body: T2MNanoBananaProRo,
  ) {
    return this.taskService.createNanoBananaProTask({
      ...body,
      created_by: req.user.uuid,
    });
  }

  @Post("image2image/nano-banana-pro")
  async nanoBananaProI2M(
    @Req() req: AuthRequest,
    @Body() body: T2MNanoBananaProRo,
  ) {
    return this.taskService.createNanoBananaProTask({
      ...body,
      created_by: req.user.uuid,
    });
  }
}
