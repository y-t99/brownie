import { Body, Controller, Get, Param, Post, Req, Sse } from "@nestjs/common";
import { UserContent } from "ai";

import { ChatService, ChatStreamService } from "../service";
import { AuthRequest } from "../type";

@Controller('chat')
export class ChatController {

  constructor(private readonly chatService: ChatService, private readonly chatStreamService: ChatStreamService) {}

  @Get('session/:sessionUuid')
  async userChatSessionDetail(@Req() req: AuthRequest, @Param('sessionUuid') sessionUuid: string) {
    return this.chatService.userChatSessionDetail(req.user.uuid, sessionUuid);
  }

  @Post('session/:sessionUuid/message')
  async submitInstruction(@Req() req: AuthRequest, @Param('sessionUuid') sessionUuid: string, @Body() body: { message: UserContent }) {
    return this.chatService.submitInstruction(req.user.uuid, sessionUuid, body.message);
  }

  @Sse('session/:sessionUuid/message/:messageUuid/assistant/stream')
  async userChatAssistantMessageStream(@Req() req: AuthRequest, @Param('sessionUuid') sessionUuid: string, @Param('messageUuid') messageUuid: string) {
    return this.chatStreamService.userChatAssistantMessageStream(req.user.uuid, sessionUuid, messageUuid);
  }
}