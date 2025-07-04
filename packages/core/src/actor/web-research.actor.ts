import { generateText, LanguageModel,Tool, ToolResult  } from "ai";
import { fromPromise } from "xstate";

import { getCurrentDate, WEB_SEARCHER_INSTRUCTIONS } from "@/prompt";
import { SearchQueries, ToolName } from "@/tool";
import { Citation, format, getCitations, insertCitationMarkers } from "@/util";

export interface WebResearchActorInput {
  queries?: SearchQueries;
  languageModel: LanguageModel;
  tools: {
    [ToolName.SearchTool]: Tool;
  };
}

export interface WebResearchResult {
  sourcesGathered: Citation[];
  webResearchResult: string;
}

export async function webResearch(
  input: WebResearchActorInput,
  abortSignal?: AbortSignal,
): Promise<WebResearchResult[]> {
  const { queries, languageModel, tools } = input;

  if (!queries) {
    return [];
  }

  const tasks = queries.queries.map(async (item) => {
    const formattedPrompt = format(WEB_SEARCHER_INSTRUCTIONS, {
      current_date: getCurrentDate(),
      research_topic: item,
    });

    const searchStep = await generateText({
      model: languageModel,
      prompt: formattedPrompt,
      tools,
      abortSignal,
    });

    const parts = [];

    if (searchStep.reasoning) {
      parts.push({
        type: "reasoning" as const,
        reasoning: searchStep.reasoning,
        details: searchStep.reasoningDetails,
      });
    }

    if (searchStep.toolResults && searchStep.toolResults.length > 0) {
      searchStep.toolResults.forEach(
        (toolResult: ToolResult<string, unknown, unknown>) => {
          parts.push({
            type: "tool-invocation" as const,
            toolInvocation: {
              state: "result" as const,
              toolCallId: toolResult.toolCallId,
              toolName: toolResult.toolName,
              args: toolResult.args,
              result: toolResult.result,
            },
          });
        },
      );
    }

    const responseStep = await generateText({
      model: languageModel,
      messages: [
        {
          role: "user",
          content: formattedPrompt,
        },
        {
          role: "assistant",
          content: searchStep.text,
          parts,
        },
      ],
      abortSignal,
    });

    // Gets the citations and adds them to the generated text
    const citations = getCitations(searchStep.toolResults);
    const modifiedText = insertCitationMarkers(responseStep.text, citations);

    return {
      sourcesGathered: citations,
      webResearchResult: modifiedText,
    };
  });

  const results = await Promise.all(tasks);

  return results;
}

export const webResearchActor = fromPromise<
  WebResearchResult[],
  WebResearchActorInput
>(async ({ input, signal }) => {
  return webResearch(input, signal);
});
