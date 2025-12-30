import { tool } from "ai";
import { z } from "zod/v4";

export const seedream3Tool = tool({
  description: `A native high-resolution bilingual image generation foundational model (Chinese-English). Seedream 3.0 delivers significantly enhanced capabilities: it supports native **2K resolution** output, offers faster response speeds, **generates more accurate small text, improves text layout effects**, enhances **aesthetics** and structural quality, and demonstrates excellent fidelity and detail performance.`,
  inputSchema: z.object({
    prompt: z.string().describe("The text prompt used to generate the image."),
    size: z
      .string()
      .default("1024x1024")
      .optional()
      .describe(
        "Specifies the dimensions (width x height in pixels) of the generated image. Must be between [512x512, 2048x2048]."
      ),
    guidance_scale: z
      .number()
      .default(2.5)
      .optional()
      .describe(
        "Controls how closely the output image aligns with the input prompt. The higher the value, the less freedom the model has, and the stronger the prompt correlation. Range: [1, 10]."
      ),
    seed: z
      .number()
      .default(-1)
      .optional()
      .describe(
        "Random seed to control the stochasticity of image generation. Range: [-1, 2147483647]. If not specified, a seed will be automatically generated. To reproduce the same output, use the same seed value."
      ),
  }),
  execute: async () => {
    return "image_url";
  },
});
