import { CoreMessage, generateText, LanguageModel } from "ai";
import { fromPromise } from "xstate";

import { ANSWER_INSTRUCTIONS, getCurrentDate } from "@/prompt";
import { format, getResearchTopic } from "@/util";

export interface AnswerActorInput {
  messages: CoreMessage[];
  webResearchResults: string[];
  languageModel: LanguageModel;
}

export async function answer(
  input: AnswerActorInput,
  abortSignal?: AbortSignal,
) {
  const { messages, webResearchResults, languageModel } = input;
  /*
   * Prepares the final output by deduplicating and formatting sources, then
   * combining them with the running summary to create a well-structured
   * research report with proper citations.
   */
  const currentDate = getCurrentDate();
  const formattedPrompt = format(ANSWER_INSTRUCTIONS, {
    current_date: currentDate,
    research_topic: getResearchTopic(messages),
    summaries: webResearchResults.join("\n---\n\n"),
  });

  const result = await generateText({
    model: languageModel,
    temperature: 0,
    maxRetries: 2,
    prompt: formattedPrompt,
    abortSignal,
  });

  return result.text;
}

export const answerActor = fromPromise<string, AnswerActorInput>(
  async ({ input, signal }) => {
    const finalAnswer = await answer(input, signal);
    return finalAnswer;
  },
);
