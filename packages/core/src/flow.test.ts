/* eslint-disable turbo/no-undeclared-env-vars */
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { qwenImageEditTool, seedream3Tool } from "@brownie/toolkit";
import { describe, expect, it, test } from "vitest";

import { run } from "./flow";
import { ToolName } from "./tool";

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

describe("flow", () => {
  it("should run", async () => {
    const provider = createOpenAICompatible({
      name: "moonshot",
      baseURL: process.env.MOONSHOT_BASE_URL!,
      apiKey: process.env.MOONSHOT_API_KEY!,
    });

    const languageModel = provider(process.env.MOONSHOT_MODEL!);

    const result = await run(
      languageModel,
      [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: "who are you?" },
      ],
      {
        tools: {
          [ToolName.Seedream3Tool]: seedream3Tool,
          [ToolName.QwenImageEditTool]: qwenImageEditTool,
        },
      }
    );
    expect(result).toBeDefined();
  });
});

test("should call tool", async () => {
  const provider = createOpenAICompatible({
    name: "openai-compatible",
    baseURL: process.env.OPENAI_BASE_URL!,
    apiKey: process.env.OPENAI_API_KEY!,
  });

  const languageModel = provider(process.env.OPENAI_DEFAULT_MODEL!);

  const result = await run(
    languageModel,
    [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: "Design a bold and dynamic vector icon of [✌️], in a high-contrast color palette: pure black, white, and neon green. The style is playful, expressive, and energetic, with thick black outlines, exaggerated forms, and cartoon-like proportions. Add dynamic shadows and minimalistic graphic effects to create a strong visual impact. The design should feel fun, lively, slightly rebellious, and tech-inspired. No gradients, no textures — only flat colors and striking contrast." },
    ],
    {
      tools: {
        [ToolName.Seedream3Tool]: seedream3Tool,
        [ToolName.QwenImageEditTool]: qwenImageEditTool,
      },
    }
  );

  expect(result).toBeDefined();
});