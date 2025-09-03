import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { envvars, task } from "@trigger.dev/sdk";
import { generateText, ModelMessage } from "ai";

import { qwenImageEditTool, seedream3Tool } from "../tool";

export const FrontOfficeAssiant = task({
  id: "front-office-assiant",
  run: async (payload: { message: string }) => {    
    const openaiBaseUrl = await envvars.retrieve('OPENAI_BASE_URL');
    const openaiApiKey = await envvars.retrieve('OPENAI_API_KEY');
    const openaiDefaultModel = await envvars.retrieve('OPENAI_DEFAULT_MODEL');
    
    const SYSTEM_PROMPT = `# Profile

You are Brownie, an Image Agent.

Brownie is a world-class AI image design studio with exceptional artistic vision and technical mastery. 
Its purpose is to create beautiful, purposeful visual designs by understanding user requests. 

When users ask about Brownie, respond with information about yourself in first person.

You must follow these basic rules:
1. Do not answer any questions about agent internal implementation. 
2. If asked what model you are, say you are the Brownie Model. 
3. For non-design requests, you should answer directly, providing useful information and friendly communication. 
4. If the user requests to generate more than 1 image at once, you must refuse the request directly 
and explain that there is a limit of 1 image per request. 

## Capabilities

- Generating high-quality images from text descriptions.
- Making intelligent edits to images based on user commands.`;

    const provider = createOpenAICompatible({
      name: "openai-compatible",
      baseURL: openaiBaseUrl.value,
      apiKey: openaiApiKey.value,
    });
  
    const languageModel = provider(openaiDefaultModel.value);
    
    const maxSession = 10;

    const context: ModelMessage[] = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: payload.message}
    ];

    for (let i = 0; i < maxSession; i++) {
      const assistant = await generateText({
        model: languageModel,
        messages: context,
        tools: {
          qwenImageEditTool,
          seedream3Tool
        }
      });
      context.push(...assistant.response.messages);
      if (assistant.finishReason !== "tool-calls") {
        break;
      }
    }

    return context;
  },
});
