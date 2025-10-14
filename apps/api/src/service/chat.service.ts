import { tasks } from '@brownie/task';
import { BadRequestException, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ChatMessageBlock, Prisma } from '@prisma/client';
import { AssistantContent, ModelMessage, ToolContent, UserContent } from 'ai';

import {  PrismaService } from '../db-provider';
import { Agent, ChatMessageRole, ChatMessageSpecification, ChatMessageStatus, TaskResourceType } from '../enum';
import { generateUUID, UUIDType } from '../util';

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

  async submitInstruction(userId: string, sessionUuid: string, message: UserContent) {
    await this.prisma.$transaction(async (tx) => {
      const chatMessage = await tx.chatMessage.create({
        data: {
          uuid: generateUUID(UUIDType.CHAT_MESSAGE),
          session_uuid: sessionUuid,
          role: ChatMessageRole.USER,
          status: ChatMessageStatus.EXECUTING,
          created_by: userId,
          updated_by: userId,
        },
      });

      if (Array.isArray(message)) {
        await tx.chatMessageBlock.createMany({
          data: message.map((content) => ({
            uuid: generateUUID(UUIDType.CHAT_MESSAGE_BLOCK),
            session_uuid: sessionUuid,
            message_uuid: chatMessage.uuid,
            content: content as unknown as Prisma.JsonValue,
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
            content: message as unknown as Prisma.JsonValue,
            created_by: userId,
            updated_by: userId,
          },
        });
      }

      const task = await tx.task.create({
        data: {
          uuid: generateUUID(UUIDType.TASK),
          title: Agent.FRONT_OFFICE_ASSISTANT,
          meta: { },
          payload: { },
          created_by: userId,
          updated_by: userId,
        },
      });

      tx.taskResourceRelation.create({
        data: {
          uuid: generateUUID(UUIDType.TASK_RESOURCE_RELATION),
          task_uuid: task.uuid,
          resource_type: TaskResourceType.CHAT_MESSAGE,
          resource_uuid: chatMessage.uuid,
          created_by: userId,
          updated_by: userId,
        },
      });


      const payload = {
        chat_session_uuid: sessionUuid,
        chat_message_uuid: chatMessage.uuid,
      };

      const handle = await tasks.trigger(Agent.FRONT_OFFICE_ASSISTANT, payload);

      await tx.task.update({
        where: {
          uuid: task.uuid,
        },
        data: {
          meta: { handle_id: handle.id },
          payload: payload,
        },
      });
    })

    return;
  }
  
  async chatSessionMessageHistory(sessionUuid: string) {
    const chatMessage = await this.prisma.chatMessage.findMany({
      where: {
        session_uuid: sessionUuid,
      },
      orderBy: {
        created_at: Prisma.SortOrder.asc,
      },
    });
    const chatMessageBlock = await this.prisma.chatMessageBlock.findMany({
      where: {
        message_uuid: {
          in: chatMessage.map((message) => message.uuid),
        },
      },
      orderBy: {
        created_at: Prisma.SortOrder.asc,
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
        created_at: Prisma.SortOrder.asc,
      },
    });
    const chatMessageBlocks = await this.prisma.chatMessageBlock.findMany({
      where: {
        session_uuid: sessionUuid,
        created_by: userId,
        deleted: false,
      },
      orderBy: {
        created_at: Prisma.SortOrder.asc,
      },
    });
    return {
      chatSession,
      chatMessages,
      chatMessageBlocks,
    }
  }

  async specificMessageSpecification(sessionUuid: string, messageUuid: string, specification: string) {
    const chatMessage = await this.prisma.chatMessage.findUnique({
      where: {
        session_uuid: sessionUuid,
        uuid: messageUuid,
      },
    });
    const chatMessageBlocks = await this.prisma.chatMessageBlock.findMany({
      where: {
        message_uuid: messageUuid,
      },
    });

    if (specification === ChatMessageSpecification.VERCEL) {
      let result: ModelMessage
      if (chatMessage.role === ChatMessageRole.SYSTEM) {
        result = {
          role: chatMessage.role,
          content: chatMessageBlocks.map((block) => block.content as unknown as string).join('\n'),
        }
      } else if (chatMessage.role === ChatMessageRole.USER) {
        result = {
          role: chatMessage.role,
          content: chatMessageBlocks.length === 1 && typeof chatMessageBlocks[0].content === 'string' ? chatMessageBlocks[0].content : chatMessageBlocks.map((block) => block.content) as unknown as UserContent,
        }
      } else if (chatMessage.role === ChatMessageRole.ASSISTANT) {
        result = {
          role: chatMessage.role,
          content: chatMessageBlocks.length === 1 && typeof chatMessageBlocks[0].content === 'string' ? chatMessageBlocks[0].content : chatMessageBlocks.map((block) => block.content) as unknown as AssistantContent,
        }
      } else if (chatMessage.role === ChatMessageRole.TOOL) {
        result = {
          role: chatMessage.role,
          content: chatMessageBlocks.map((block) => block.content) as unknown as ToolContent,
        }
      } else {
        throw new ServiceUnavailableException()
      }
      
      return result;
    } else {
      throw new BadRequestException()
    }
  }

  async contextCuration(filters: unknown) {
  }
}
