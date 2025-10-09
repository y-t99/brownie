import { Injectable } from '@nestjs/common';
import { PrismaService } from '../db-provider';
import { generateUUID, UUIDType } from '../util';
import { ModelMessage } from 'ai';
import { ChatMessageBlock } from '@prisma/client';
import { ChatMessageStatus } from '../enum';

@Injectable()
export class ChatService {

  constructor(private readonly prisma: PrismaService) {}

  async createChatSession(userId: string) {
    const chatSession = await this.prisma.chatSession.create({
      data: {
        uuid: generateUUID(UUIDType.CHAT_SESSION),
        created_by: userId,
        updated_by: userId,
      },
    });

    return chatSession;
  }

  async appendChatMessage(userId: string, sessionUuid: string, message: ModelMessage) {
    const chatMessage = await this.prisma.$transaction(async (tx) => {
      const chatMessage = await tx.chatMessage.create({
        data: {
          uuid: generateUUID(UUIDType.CHAT_MESSAGE),
          session_uuid: sessionUuid,
          role: message.role,
          status: ChatMessageStatus.SUCCESS,
          created_by: userId,
          updated_by: userId,
        },
      });

      if (Array.isArray(message.content)) {
        await tx.chatMessageBlock.createMany({
          data: message.content.map((content) => ({
            uuid: generateUUID(UUIDType.CHAT_MESSAGE_BLOCK),
            session_uuid: sessionUuid,
            message_uuid: chatMessage.uuid,
            content: content,
            created_by: userId,
            updated_by: userId,
          })),
        });
      } else {
        await tx.chatMessageBlock.create({
          data: {
            uuid: generateUUID(UUIDType.CHAT_MESSAGE_BLOCK),
            session_uuid: sessionUuid,
            message_uuid: chatMessage.uuid,
            content: message.content,
            created_by: userId,
            updated_by: userId,
          },
        });
      }

      return chatMessage;
    })

    return chatMessage;
  }
  
  async chatSessionMessageHistory(sessionUuid: string) {
    const chatMessage = await this.prisma.chatMessage.findMany({
      where: {
        session_uuid: sessionUuid,
      },
      orderBy: {
        created_at: 'asc',
      },
    });
    const chatMessageBlock = await this.prisma.chatMessageBlock.findMany({
      where: {
        message_uuid: {
          in: chatMessage.map((message) => message.uuid),
        },
      },
      orderBy: {
        created_at: 'asc',
      },
    });
    const history = chatMessage.map((message) => {
      return {
        ...message,
        blocks: [] as ChatMessageBlock[],
      };
    });
    chatMessageBlock.forEach((block) => {
      const message = history.find((message) => message.uuid === block.message_uuid);
      if (message) {
        message.blocks.push(block);
      }
    });
    return history;
  }

  async userChatSessionDetail(userId: string, sessionUuid: string) {
    const chatSession = await this.prisma.chatSession.findUnique({
      where: {
        uuid: sessionUuid,
        created_by: userId,
        deleted: false,
      },
    });
    if (!chatSession) {
      return null;
    }
    const chatMessages = await this.prisma.chatMessage.findMany({
      where: {
        session_uuid: sessionUuid,
        created_by: userId,
        deleted: false,
      },
      orderBy: {
        created_at: 'asc',
      },
    });
    const chatMessageBlocks = await this.prisma.chatMessageBlock.findMany({
      where: {
        session_uuid: sessionUuid,
        created_by: userId,
        deleted: false,
      },
      orderBy: {
        created_at: 'asc',
      },
    });
    return {
      chatSession,
      chatMessages,
      chatMessageBlocks,
    }
  }
}
