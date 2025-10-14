import { Body, Controller, Get, Param, Post } from "@nestjs/common";

import { Roles } from "../decorator";
import { Role } from "../enum";
import { ChatService } from "../service";

@Controller('internal')
@Roles(Role.Admin)
export class InternalController {
  constructor(private readonly chatService: ChatService) {}

  @Get('session/:sessionUuid/message/:messageUuid/specification/:specification')
  async specificMessageSpecification(@Param('sessionUuid') sessionUuid: string, @Param('messageUuid') messageUuid: string, @Param('specification') specification: string) {
    return this.chatService.specificMessageSpecification(sessionUuid, messageUuid, specification);
  }

  @Post('context/curation')
  async contextCuration(@Body() body: { 
    userUuid: string, 
    sessionUuid?: string,
    messageUuid?: string,
    memoryType?: string,
    queries?: string[],
  }) {
    return this.chatService.contextCuration(body);
  }
}