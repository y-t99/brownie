import { Injectable } from '@nestjs/common';

import { ChatService } from './service/chat.service';

@Injectable()
export class AppService {

  constructor(private readonly chatService: ChatService) {}

}