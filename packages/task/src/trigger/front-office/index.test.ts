import { runs, tasks } from "@trigger.dev/sdk/v3";
import { UIMessageChunk } from "ai";
import { describe, expect, it } from "vitest";

import { FrontOfficeAssiant } from ".";

describe("test front-office", () => {
  it("should test front-office", async () => {

    const handle = await tasks.trigger("front-office-assiant", { message: " Design a bold and dynamic vector icon of [✌️], in a high-contrast color palette: pure black, white, and neon green. The style is playful, expressive, and energetic, with thick black outlines, exaggerated forms, and cartoon-like proportions. Add dynamic shadows and minimalistic graphic effects to create a strong visual impact. The design should feel fun, lively, slightly rebellious, and tech-inspired. No gradients, no textures — only flat colors and striking contrast."});

    const subscribe = runs.subscribeToRun<typeof FrontOfficeAssiant>(handle.id);
    for await (const part of subscribe.withStreams()) {
      if (part.type === "run" && part.run.status === "COMPLETED") {
        subscribe.unsubscribe();
      }

      if (part.type.startsWith("session_")) {
        const modelMessage = (part as { chunk: unknown }).chunk as UIMessageChunk;
        expect(modelMessage).toHaveProperty('type');
        expect(typeof modelMessage.type).toBe('string');
      }
    }
  });
});