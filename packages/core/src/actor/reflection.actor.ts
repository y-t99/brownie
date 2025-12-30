import { generateObject, LanguageModel,ModelMessage } from "ai";
import { fromPromise } from "xstate";
import { z } from "zod/v4";

import { getCurrentDate, REFLECTION_INSTRUCTIONS } from "@/prompt";
import { format, getResearchTopic } from "@/util";

export interface ReflectionActorInput {
  messages: ModelMessage[];
  webResearchResults: string[];
  languageModel: LanguageModel;
}

const reflectionSchema = z.object({
  is_sufficient: z.boolean(),
  knowledge_gap: z.string(),
  follow_up_queries: z.array(z.string()),
});

export type Reflection = z.infer<typeof reflectionSchema>;

export async function reflection(
  input: ReflectionActorInput,
  abortSignal?: AbortSignal,
) {
  const { messages, webResearchResults, languageModel } = input;
  /*
   * Analyzes the current summary to identify areas for further research and generates
   * potential follow-up queries. Uses structured output to extract
   * the follow-up query in JSON format.
   */

  const currentDate = getCurrentDate();
  const formattedPrompt = format(REFLECTION_INSTRUCTIONS, {
    current_date: currentDate,
    research_topic: getResearchTopic(messages),
    summaries: webResearchResults.join("\n\n---\n\n"),
  });

  const { object } = await generateObject({
    model: languageModel,
    temperature: 1,
    maxRetries: 2,
    schema: reflectionSchema,
    prompt: formattedPrompt,
    abortSignal,
  });

  return object as Reflection;
}

export const reflectionActor = fromPromise<Reflection, ReflectionActorInput>(
  async ({ input, signal }) => {
    return reflection(input, signal);
  },
);
