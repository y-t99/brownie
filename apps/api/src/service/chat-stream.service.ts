import { FrontOfficeAssiant , runs } from "@brownie/task";
import { MessageEvent,NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { AssistantModelMessage, ToolModelMessage,UIMessageChunk } from "ai";
import { catchError, from, map, Observable, of } from "rxjs";
import { PrismaService } from "src/db-provider";

import { ChatMessageRole, ChatMessageStatus, EventDataType, TaskResourceType } from "../enum";
import { TaskMeta } from "../type";

export class ChatStreamService {
  constructor(private readonly prisma: PrismaService) {}

  async userChatAssistantMessageStream(userId: string, sessionUuid: string, messageUuid: string): Promise<Observable<MessageEvent>> {
    const chatMessage = await this.prisma.chatMessage.findUnique({
      where: {
        session_uuid: sessionUuid,
        uuid: messageUuid,
        role: {
          in: [ChatMessageRole.ASSISTANT, ChatMessageRole.TOOL],
        },
        created_by: userId,
        deleted: false,
      },
    });
    if (!chatMessage) {
      throw new NotFoundException();
    }
    if (chatMessage.status !== ChatMessageStatus.PROCESSING && chatMessage.status !== ChatMessageStatus.PENDING) {
      const chatMessageBlock = await this.prisma.chatMessageBlock.findMany({
        where: {
          message_uuid: messageUuid,
          deleted: false,
        },
        orderBy: {
          created_at: Prisma.SortOrder.asc,
        },
      });
      return from(chatMessageBlock.map((e) => {
        return {
          id: e.uuid,
          data: e.content as AssistantModelMessage | ToolModelMessage,
          type: EventDataType.BLOCK,
        };
      }));
    }

    const taskResourceRelation = await this.prisma.taskResourceRelation.findFirst({
      where: {
        resource_type: TaskResourceType.CHAT_MESSAGE,
        resource_uuid: chatMessage.uuid,
        created_by: userId,
        deleted: false,
      },
      orderBy: {
        created_at: Prisma.SortOrder.desc,
      },
    })

    const task = await this.prisma.task.findUnique({
      where: {
        uuid: taskResourceRelation.task_uuid,
        created_by: userId,
        deleted: false,
      },
    });

    const subscribe = runs.subscribeToRun<typeof FrontOfficeAssiant>((task.meta as unknown as TaskMeta).handle_id);

    const streamResult = subscribe.withStreams();
    
    const transformedStream = streamResult.pipeThrough(new TransformStream({
      transform(chunk, controller) {
        try {
          if (chunk.type === 'run') {
            if (!chunk.run.isExecuting && !chunk.run.isWaiting && !chunk.run.isQueued) {
              controller.terminate();
              subscribe.unsubscribe();
            }
          } else if (chunk.type === 'llm_stream') {
            const modelMessage = (chunk as { chunk: unknown }).chunk as UIMessageChunk;
            controller.enqueue({
              id: chunk.run.id,
              data: modelMessage,
            });
          }
        } catch (error) {
          controller.error(error);
        }
      },
    }));

    return from(transformedStream).pipe(
      map((value) => {
        return {
          ...value,
          type: EventDataType.CHUNK,
        };
      }),
      catchError((error) => {
        subscribe.unsubscribe();
        return of({
          type: EventDataType.CHUNK,
          data: error.message,
        });
      })
    );
  }
}