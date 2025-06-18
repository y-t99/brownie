import { createDeepSeek } from "@ai-sdk/deepseek";
import { describe, it, expect } from "vitest";
import { serpSearchApiTool, ToolName } from "./tools";
import { webResearch } from "./graph";
import { QueryGenerationContext } from "./state";

describe("test web research", () => {
  it("should find the capital of France with deepseek", async () => {
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
