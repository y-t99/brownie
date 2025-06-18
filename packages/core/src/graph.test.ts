import { createDeepSeek } from "@ai-sdk/deepseek";
import { describe, expect,it } from "vitest";

import { webResearch } from "./graph";
import { QueryGenerationContext } from "./state";
import { serpSearchApiTool, ToolName } from "./tools";

describe("test web research", () => {
  it.only("should find the capital of France", async () => {
    const state = {
      queries: [
        {
          queries: ["What is the capital of France?"],
          rationale: "I need to find the capital of France",
        },
      ],
    } as QueryGenerationContext;

    const provider = createDeepSeek({
      baseURL: process.env.DEEPSEEK_BASE_URL,
      apiKey: process.env.DEEPSEEK_API_KEY,
    });

    const tools = {
      [ToolName.SearchTool]: serpSearchApiTool(process.env.SERP_API_KEY!),
    };

    const languageModel = provider(process.env.DEEPSEEK_MODEL!);

    const results = await webResearch(state, languageModel, tools);

    expect(results).toBeDefined();
  });
});
