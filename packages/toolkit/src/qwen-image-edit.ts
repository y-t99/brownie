import { tool } from "ai";
import { z } from "zod";

export const qwenImageEditTool = tool({
  name: "Qwen-Image-Edit",
  description: `Key Features:
Semantic and Appearance Editing: Qwen-Image-Edit supports both low-level visual appearance editing (such as adding, removing, or modifying elements, requiring all other regions of the image to remain completely unchanged) and high-level visual semantic editing (such as IP creation, object rotation, and style transfer, allowing overall pixel changes while maintaining semantic consistency).
Precise Text Editing: Qwen-Image-Edit supports bilingual (Chinese and English) text editing, allowing direct addition, deletion, and modification of text in images while preserving the original font, size, and style.`,
  inputSchema: z.object({
    image: z.string().url().describe("The image to edit."),
    prompt: z
      .string()
      .describe("The prompt or prompts to guide the image generation."),
    negative_prompt: z
      .string()
      .optional()
      .describe("The prompt or prompts not to guide the image generation."),
    true_cfg_scale: z
      .number()
      .default(1)
      .optional()
      .describe(
        "When > 1.0 and a provided `negative_prompt`, enables true classifier-free guidance."
      ),
    height: z
      .number()
      .optional()
      .describe("The height in pixels of the generated image."),
    width: z
      .number()
      .optional()
      .describe("The width in pixels of the generated image."),
    num_inference_steps: z
      .number()
      .default(50)
      .optional()
      .describe(
        "The number of denoising steps. More denoising steps usually lead to a higher quality image at the expense of slower inference."
      ),
  }),
  execute: async () => {
    return "image_url";
  },
});
