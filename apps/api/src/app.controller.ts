import { FrontOfficeAssiant,runs, tasks } from '@brownie/task';
import { Body,Controller, MessageEvent, Sse } from '@nestjs/common';
import { UIMessageChunk } from 'ai';
import { catchError, from, map, Observable, of } from 'rxjs';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Sse('sse')
  async sse(@Body() body: { message: string }): Promise<Observable<MessageEvent>> {
    const { message } = body;
    const handle = await tasks.trigger("front-office-assiant", { message });

    const subscribe = runs.subscribeToRun<typeof FrontOfficeAssiant>(handle.id);

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
        return value;
      }),
      catchError((error) => {
        subscribe.unsubscribe();
        return of({
          id: '',
          data: null,
        });
      })
    );
  }
}