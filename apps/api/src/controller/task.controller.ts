import { Controller } from "@nestjs/common";

import { TaskService } from "../service";

@Controller("task")
export class TaskController {
  constructor(private readonly taskService: TaskService) {}
}
