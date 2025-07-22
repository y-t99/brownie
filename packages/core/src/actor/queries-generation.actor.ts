import { CoreMessage, generateText, LanguageModel } from "ai";
import { fromPromise } from "xstate";
import { ZodError } from "zod";

import { getCurrentDate, QUERY_WRITER_INSTRUCTIONS } from "@/prompt";
import { SearchQueries, searchQueriesSchema } from "@/tool";
import { format, getResearchTopic } from "@/util";

export interface GenerateQueriesActorInput {
  messages: CoreMessage[];
  numberQueries: number;
  languageModel: LanguageModel;
}

export async function generateQueries(
  generateQueriesActorInput: GenerateQueriesActorInput,
  abortSignal?: AbortSignal
) {
  const { messages, numberQueries, languageModel } = generateQueriesActorInput;

  const currentDate = getCurrentDate();
  const formattedPrompt = format(QUERY_WRITER_INSTRUCTIONS, {
    current_date: currentDate,
    research_topic: getResearchTopic(messages),
    number_queries: numberQueries.toString(),
  });

  const context: CoreMessage[] = [
    {
      role: "system",
      content: formattedPrompt,
    },
  ];

  let searchQueries: SearchQueries | null = null;

  for (let i = 0; i < 3; i++) {
    const { text } = await generateText({
      model: languageModel,
      temperature: 1,
      maxRetries: 2,
      messages: context,
      abortSignal,
      providerOptions: {
        response_format: { type: "json_object" },
      },
    });

    try {
      const result = searchQueriesSchema.parse(
        JSON.parse(text.replace(/```json/, "").replace(/```/, ""))
      );
      searchQueries = result;
      break;
    } catch (error: unknown) {
      context.push({
        role: "assistant",
        content: text,
      });
      if (error instanceof ZodError) {
        context.push({
          role: "user",
          content: `Please fix the output error: ${error.issues.map((issue) => issue.message).join(", ")}`,
        });
      } else {
        throw error;
      }
    }
  }

  if (searchQueries === null) {
    throw new Error("Failed to generate search queries");
  }

  return searchQueries;
}

export const queryGenerationActor = fromPromise<
  SearchQueries,
  GenerateQueriesActorInput
>(async ({ input, signal }) => {
  return generateQueries(input, signal);
});
