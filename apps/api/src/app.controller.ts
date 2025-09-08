import { Controller, Sse, MessageEvent, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { from, map, Observable } from 'rxjs';
import { runs, tasks, FrontOfficeAssiant } from '@brownie/task';
import { UIMessageChunk } from 'ai';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Sse('sse')
  async sse(@Body() body: { message: string }): Promise<Observable<MessageEvent>> {
    const { message } = body;
    const handle = await tasks.trigger("front-office-assiant", { message });

    const streamResult = runs.subscribeToRun<typeof FrontOfficeAssiant>(handle.id).withStreams();
    
    const transformedStream = streamResult.pipeThrough(new TransformStream({
      transform(chunk, controller) {
        if (chunk.type === 'run') {
          if (!chunk.run.isExecuting && !chunk.run.isWaiting && !chunk.run.isQueued) {
            controller.terminate();
          }
        } else if (chunk.type.startsWith('session_')) {
          const modelMessage = (chunk as { chunk: unknown }).chunk as UIMessageChunk;
          controller.enqueue({
            id: chunk.run.id,
            data: modelMessage,
          });
        }
      }
    }));

    return from(transformedStream).pipe(map((value) => {
      return value
    }));
  }
}