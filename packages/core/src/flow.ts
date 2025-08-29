import { LanguageModelV2 } from "@ai-sdk/provider";
import {
  generateText,
  ModelMessage,
  ToolSet,
} from "ai";

export async function run(
  model: LanguageModelV2,
  messages: ModelMessage[],
  optional: {
    maxSession?: number;
    tools?: ToolSet;
  }
) {
  const { maxSession = 10, tools } = optional;
  const context = [...messages];
  for (let i = 0; i < maxSession; i++) {
    const assistant = await generateText({
      model,
      messages: context,
      tools,
    });
    context.push(...assistant.response.messages);
    if (assistant.finishReason !== "tool-calls") {
      break;
    }
  }
  return context;
}
