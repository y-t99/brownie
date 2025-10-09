import { Injectable } from '@nestjs/common';
import { PrismaService } from './db-provider';
import { generateUUID, UUIDType } from './util/uuid-helper';
import { ChatService } from './service/chat.service';

@Injectable()
export class AppService {

  constructor(private readonly chatService: ChatService) {}

}