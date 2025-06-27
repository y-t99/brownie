import { getCurrentDate, QUERY_WRITER_INSTRUCTIONS } from "@/prompt";
import { SearchQueries, searchQueriesSchema } from "@/tools";
import { format, getResearchTopic } from "@/utils";
import { CoreMessage, generateObject, LanguageModel } from "ai";
import { fromPromise } from "xstate";

export interface GenerateQueriesActorInput {
  messages: CoreMessage[];
  numberQueries: number;
  languageModel: LanguageModel;
}

export async function generateQueries(
  generateQueriesActorInput: GenerateQueriesActorInput,
  abortSignal?: AbortSignal,
) {
  const { messages, numberQueries, languageModel } = generateQueriesActorInput;

  const currentDate = getCurrentDate();
  const formattedPrompt = format(QUERY_WRITER_INSTRUCTIONS, {
    current_date: currentDate,
    research_topic: getResearchTopic(messages),
    number_queries: numberQueries.toString(),
  });

  const { object } = await generateObject({
    model: languageModel,
    temperature: 1,
    maxRetries: 2,
    schema: searchQueriesSchema,
    prompt: formattedPrompt,
    abortSignal,
  });

  return object;
}

export const queryGenerationActor = fromPromise<
  SearchQueries,
  GenerateQueriesActorInput
>(async ({ input, signal }) => {
  return generateQueries(input, signal);
});
