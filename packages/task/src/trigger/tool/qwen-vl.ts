import { schemaTask } from "@trigger.dev/sdk";
import { ai } from "@trigger.dev/sdk/ai";
import z from "zod/v4";

const qwenVlToolTask = schemaTask({
  id: "qwen-vl-tool",
  description: `Qwen3-VL-235B-A22B Instruct is an open-weight multimodal model that unifies strong text generation with visual understanding across images and video. 
The Instruct model targets general vision-language use (VQA, document parsing, chart/table extraction, multilingual OCR). 
The series emphasizes robust perception (recognition of diverse real-world and synthetic categories), spatial understanding (2D/3D grounding), and long-form visual comprehension, with competitive results on public multimodal benchmarks for both perception and reasoning.
Beyond analysis, Qwen3-VL supports agentic interaction and tool use: 
  it can follow complex instructions over multi-image, multi-turn dialogues; 
  align text to video timelines for precise temporal queries; 
  and operate GUI elements for automation tasks. 
The models also enable visual coding workflows—turning sketches or mockups into code and assisting with UI debugging—while maintaining strong text-only performance comparable to the flagship Qwen3 language models. 
This makes Qwen3-VL suitable for production scenarios spanning document AI, multilingual OCR, software/UI assistance, spatial/embodied tasks, and research on vision-language agents.`,
  schema: z.object({
    image: z.url().describe("the image url to describe."),
    prompt: z.string().optional().describe("the instruction to describe the image."),
  }),
  run: async () => {
    return "description";
  },
});

export const qwenVlTool = ai.tool(qwenVlToolTask);
