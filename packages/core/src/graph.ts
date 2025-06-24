import {
  CoreAssistantMessage,
  generateObject,
  generateText,
  LanguageModel,
  Tool,
  ToolResult,
} from "ai";
import { assign, createMachine, fromPromise } from "xstate";

import { ResearchConfiguration } from "./configuration";
import {
  ANSWER_INSTRUCTIONS,
  getCurrentDate,
  QUERY_WRITER_INSTRUCTIONS,
  REFLECTION_INSTRUCTIONS,
  WEB_SEARCHER_INSTRUCTIONS,
} from "./prompt";
import {
  QueryGenerationContext,
  ResearchEvent,
  ResearchMachineContext,
} from "./state";
import { reflectionSchema, searchQueriesSchema, ToolName } from "./tools";
import {
  Citation,
  format,
  getCitations,
  getResearchTopic,
  insertCitationMarkers,
} from "./utils";

export async function generateQueries(
  state: ResearchMachineContext,
  languageModel: LanguageModel
) {
  const currentDate = getCurrentDate();
  const formattedPrompt = format(QUERY_WRITER_INSTRUCTIONS, {
    current_date: currentDate,
    research_topic: getResearchTopic(state.messages),
    number_queries: state.initialSearchQueryCount.toString(),
  });

  const { object } = await generateObject({
    model: languageModel,
    temperature: 1,
    maxRetries: 2,
    schema: searchQueriesSchema,
    prompt: formattedPrompt,
  });

  return object;
}

interface WebResearchResult {
  sourcesGathered: Citation[];
  webResearchResult: string;
}

export async function webResearch(
  state: QueryGenerationContext,
  languageModel: LanguageModel,
  tools: {
    [ToolName.SearchTool]: Tool;
  }
): Promise<WebResearchResult[]> {
  const tasks = state.queries[state.queries.length - 1]!.queries.map(
    async (item) => {
      const formattedPrompt = format(WEB_SEARCHER_INSTRUCTIONS, {
        current_date: getCurrentDate(),
        research_topic: item,
      });

      const searchStep = await generateText({
        model: languageModel,
        prompt: formattedPrompt,
        tools,
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
          }
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
      });

      // Gets the citations and adds them to the generated text
      const citations = getCitations(searchStep.toolResults);
      const modifiedText = insertCitationMarkers(responseStep.text, citations);

      return {
        sourcesGathered: citations,
        webResearchResult: modifiedText,
      };
    }
  );

  const results = await Promise.all(tasks);

  return results;
}

export async function reflection(
  state: ResearchMachineContext,
  languageModel: LanguageModel
) {
  /*
   * Analyzes the current summary to identify areas for further research and generates
   * potential follow-up queries. Uses structured output to extract
   * the follow-up query in JSON format.
   */

  const currentDate = getCurrentDate();
  const formattedPrompt = format(REFLECTION_INSTRUCTIONS, {
    current_date: currentDate,
    research_topic: getResearchTopic(state.messages),
    summaries: state.webResearchResults.join("\n\n---\n\n"),
  });

  const { object } = await generateObject({
    model: languageModel,
    temperature: 1,
    maxRetries: 2,
    schema: reflectionSchema,
    prompt: formattedPrompt,
  });

  return {
    isSufficient: object.is_sufficient,
    knowledgeGap: object.knowledge_gap,
    followUpQueries: object.follow_up_queries,
  };
}

export async function finalizeAnswer(
  state: ResearchMachineContext,
  languageModel: LanguageModel
) {
  /*
   * Prepares the final output by deduplicating and formatting sources, then
   * combining them with the running summary to create a well-structured
   * research report with proper citations.
   */
  const currentDate = getCurrentDate();
  const formattedPrompt = format(ANSWER_INSTRUCTIONS, {
    current_date: currentDate,
    research_topic: getResearchTopic(state.messages),
    summaries: state.webResearchResults.join("\n---\n\n"),
  });

  const result = await generateText({
    model: languageModel,
    temperature: 0,
    maxRetries: 2,
    prompt: formattedPrompt,
  });

  return {
    message: result.text,
  };
}

export function createResearchAgentMachine(config: ResearchConfiguration) {
  return createMachine(
    {
      id: `0`,
      initial: "idle",
      context: {
        // research context
        messages: [],
        searchQueries: [],
        webResearchResults: [],
        sourcesGathereds: [],
        initialSearchQueryCount: config.numberOfInitialQueries,
        maxResearchLoops: config.maxResearchLoops,
        researchLoopCount: 0,
        queries: [],
        queryGeneratorModel: config.queryGeneratorModel.provider,
        reflectionModel: config.reflectionModel.provider,
        answerModel: config.answerModel.provider,
      },
      types: {
        context: {} as ResearchMachineContext & QueryGenerationContext,
        events: {} as ResearchEvent,
      },
      states: {
        idle: {
          on: {
            START_RESEARCH: {
              target: "generatingQueries",
              actions: assign({
                messages: ({ event }) => event.messages,
              }),
            },
          },
        },

        generatingQueries: {
          invoke: {
            id: "generateQueries",
            src: "queryGenerationService",
            input: ({ context }) => ({
              state: context,
              model: config.queryGeneratorModel,
            }),
            onDone: {
              target: "webSearching",
              actions: assign({
                queries: ({ context, event }) => [...context.queries, event.output],
                searchQueries: ({ context, event }) => [...context.searchQueries, event.output.queries],
              }),
            },
            onError: {
              target: "error",
            },
          },
        },

        webSearching: {
          invoke: {
            id: "webSearch",
            src: "webResearchService",
            input: ({ context }) => ({
              state: { queries: context.queries },
              model: config.queryGeneratorModel,
              tools: config.tools,
            }),
            onDone: {
              target: "reflecting",
              actions: assign({
                webResearchResults: ({ context, event }) => [
                  ...context.webResearchResults,
                  ...event.output.map(
                    (item: WebResearchResult) => item.webResearchResult
                  ),
                ],
                sourcesGathereds: ({ context, event }) => [
                  ...context.sourcesGathereds,
                  ...event.output
                    .map((item: WebResearchResult) => item.sourcesGathered)
                    .flatMap((item: Citation[]) => item),
                ],
              }),
            },
            onError: {
              target: "error",
            },
          },
        },

        reflecting: {
          invoke: {
            id: "reflection",
            src: "reflectionService",
            input: ({ context }) => ({
              state: context,
              model: config.reflectionModel,
            }),
            onDone: [
              /*
               * evaluate research
               *
               * Controls the research loop by deciding whether to continue gathering information
               * or to finalize the summary based on the configured maximum number of research loops.
               */
              {
                target: "finalizingAnswer",
                guard: {
                  type: "isResearchSufficient",
                  params: ({ event }) => event.output.isSufficient,
                },
                actions: assign({
                  researchLoopCount: ({ context }) =>
                    context.researchLoopCount + 1,
                }),
              },
              {
                target: "finalizingAnswer",
                guard: "hasReachedMaxLoops",
                actions: assign({
                  researchLoopCount: ({ context }) =>
                    context.researchLoopCount + 1,
                }),
              },
              {
                target: "webSearching",
                actions: assign({
                  queries: ({ context, event }) => [
                    ...context.queries,
                    {
                      queries: event.output.followUpQueries,
                      rationale: event.output.knowledge_gap,
                    },
                  ],
                  searchQueries: ({ context, event }) => [
                    ...context.searchQueries,
                    ...event.output.followUpQueries,
                  ],
                  researchLoopCount: ({ context }) =>
                    context.researchLoopCount + 1,
                }),
              },
            ],
            onError: {
              target: "error",
            },
          },
        },

        finalizingAnswer: {
          invoke: {
            id: "finalizeAnswer",
            src: "answerFinalizationService",
            input: ({ context }) => ({
              state: context,
              model: config.answerModel,
            }),
            onDone: {
              target: "completed",
              actions: assign({
                messages: ({ context, event }) => [
                  ...context.messages,
                  {
                    role: "assistant",
                    content: event.output.message,
                  } as CoreAssistantMessage,
                ],
              }),
            },
            onError: {
              target: "error",
            },
          },
        },

        completed: {
          type: "final",
        },

        error: {
          type: "final",
        },
      },
    },
    {
      actors: {
        queryGenerationService: fromPromise(
          async ({
            input,
          }: {
            input: {
              state: ResearchMachineContext;
              model: LanguageModel;
            };
          }) => {
            return generateQueries(input.state, input.model);
          }
        ),

        webResearchService: fromPromise(
          async ({
            input,
          }: {
            input: {
              state: QueryGenerationContext;
              model: LanguageModel;
              tools: {
                [ToolName.SearchTool]: Tool;
              };
            };
          }) => {
            return webResearch(input.state, input.model, input.tools);
          }
        ),

        reflectionService: fromPromise(
          async ({
            input,
          }: {
            input: {
              state: ResearchMachineContext;
              model: LanguageModel;
            };
          }) => {
            return reflection(input.state, input.model);
          }
        ),

        answerFinalizationService: fromPromise(
          async ({
            input,
          }: {
            input: {
              state: ResearchMachineContext;
              model: LanguageModel;
            };
          }) => {
            const finalAnswer = await finalizeAnswer(
              input.state,
              input.model
            );
            return finalAnswer;
          }
        ),
      },
      guards: {
        isResearchSufficient: (_, params) => {
          return params &&
            "isSufficient" in params &&
            params.isSufficient === true
            ? true
            : false;
        },
        hasReachedMaxLoops: ({ context }) => {
          return context.researchLoopCount >= context.maxResearchLoops;
        },
      },
    }
  );
}
