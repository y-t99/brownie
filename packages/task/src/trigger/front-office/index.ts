import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { envvars, metadata, task } from "@trigger.dev/sdk";
import { ModelMessage, streamText } from "ai";

import { qwenImageEditTool, seedream3Tool } from "../tool";

export const FrontOfficeAssiant = task({
  id: "front-office-assiant",
  run: async (payload: { chat_session_uuid: string }) => {    
    const openaiBaseUrl = await envvars.retrieve('OPENAI_BASE_URL');
    const openaiApiKey = await envvars.retrieve('OPENAI_API_KEY');
    const openaiDefaultModel = await envvars.retrieve('OPENAI_DEFAULT_MODEL');

    const provider = createOpenAICompatible({
      name: "openai-compatible",
      baseURL: openaiBaseUrl.value,
      apiKey: openaiApiKey.value,
    });
  
    const languageModel = provider(openaiDefaultModel.value);

    const context: ModelMessage[] = [];
    const message: ModelMessage[] = [];
    const assistant = await streamText({
      model: languageModel,
      messages: context,
      tools: {
        qwenImageEditTool,
        seedream3Tool
      },
      onFinish: (response) => {
        message.push(...response.response.messages);
      }
    });
    const stream = await metadata.stream(`llm_stream`, assistant.fullStream);
    // eslint-disable-next-line no-empty
    for await (const _ of stream) { }

    return message;
  },
});
