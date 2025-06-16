import {
  CoreAssistantMessage,
  generateObject,
  generateText,
  LanguageModel,
  Tool,
} from "ai";
import {
  ANSWER_INSTRUCTIONS,
  getCurrentDate,
  QUERY_WRITER_INSTRUCTIONS,
  REFLECTION_INSTRUCTIONS,
  WEB_SEARCHER_INSTRUCTIONS,
} from "./prompt";
import { QueryGenerationContext, ResearchMachineContext } from "./state";
import {
  reflectionSchema,
  searchQueriesSchema,
  SerpSearchOrganicResult,
  ToolName,
} from "./tools";
import {
  format,
  getCitations,
  getResearchTopic,
  insertCitationMarkers,
} from "./utils";
import { assign, createMachine, fromPromise } from "xstate";
import { ResearchConfiguration } from "./configuration";

export async function generateQueries(
  state: ResearchMachineContext,
  languageModel: LanguageModel
) {
  // Format the prompt
  const currentDate = getCurrentDate();
  const formattedPrompt = format(QUERY_WRITER_INSTRUCTIONS, {
    current_date: currentDate,
    research_topic: getResearchTopic(state.messages),
    number_queries: state.initialSearchQueryCount.toString(),
  });

  // Generate the search queries
  const { object } = await generateObject({
    model: languageModel,
    temperature: 1,
    maxRetries: 2,
    schema: searchQueriesSchema,
    prompt: formattedPrompt,
  });

  return object;
}

export async function webResearch(
  state: QueryGenerationContext,
  languageModel: LanguageModel,
  tools: { [ToolName.SearchTool]: Tool<any, SerpSearchOrganicResult[]> }
) {
  const tasks = state.queries[state.queries.length - 1].queries.map(
    async (item, idx) => {
      const formattedPrompt = format(WEB_SEARCHER_INSTRUCTIONS, {
        current_date: getCurrentDate(),
        research_topic: item,
      });

      const response = await generateText({
        model: languageModel,
        prompt: formattedPrompt,
        tools,
      });

      // Gets the citations and adds them to the generated text
      const citations = getCitations(response.toolResults);
      const modifiedText = insertCitationMarkers(response.text, citations);
      const sourcesGathered = citations;

      return {
        sourcesGathered,
        searchQuery: [item],
        webResearchResult: [modifiedText],
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

  // Format the prompt
  const currentDate = getCurrentDate();
  const formattedPrompt = format(REFLECTION_INSTRUCTIONS, {
    current_date: currentDate,
    research_topic: getResearchTopic(state.messages),
    summaries: state.webResearchResult.join("\n\n---\n\n"),
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
    summaries: state.webResearchResult.join("\n---\n\n"),
  });

  const result = await generateText({
    model: languageModel,
    temperature: 0,
    maxRetries: 2,
    prompt: formattedPrompt,
  });

  return {
    message: result.text,
    sourcesGathered: state.sourcesGathered,
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
        webResearchResult: [],
        sourcesGathered: [],
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
        // events: {} as ResearchEvent,
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
              model: context.queryGeneratorModel,
            }),
            onDone: {
              target: "webSearch",
              actions: assign({
                // todo: rationale ?
                queries: ({ event }) => event.output.queries,
                searchQueries: ({ event }) => event.output.queries,
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
              queries: context.queries,
              model: config.queryGeneratorModel,
              tools: config.tools,
            }),
            onDone: {
              target: "reflecting",
              actions: assign({}),
            },
            onError: {
              target: "failed",
            },
          },
        },

        reflecting: {
          invoke: {
            id: "reflection",
            src: "reflectionService",
            input: ({ context }) => ({
              state: context,
              languageModel: config.reflectionModel,
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
                guard: "isResearchSufficient",
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
                  queries: ({ event }) => event.output.followUpQueries,
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
              target: "failed",
            },
          },
        },

        finalizingAnswer: {
          invoke: {
            id: "finalizeAnswer",
            src: "answerFinalizationService",
            input: ({ context }) => ({
              state: context,
              languageModel: config.answerModel,
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
                sourcesGathered: ({ event }) => event.output.sourcesGathered,
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
              languageModel: LanguageModel;
            };
          }) => {
            return generateQueries(input.state, input.languageModel);
          }
        ),

        webResearchService: fromPromise(
          async ({
            input,
          }: {
            input: {
              context: QueryGenerationContext;
              languageModel: LanguageModel;
              tools: {
                [ToolName.SearchTool]: Tool;
              };
            };
          }) => {
            return webResearch(input.context, input.languageModel, input.tools);
          }
        ),

        reflectionService: fromPromise(
          async ({
            input,
          }: {
            input: {
              state: ResearchMachineContext;
              languageModel: LanguageModel;
            };
          }) => {
            return reflection(input.state, input.languageModel);
          }
        ),

        answerFinalizationService: fromPromise(
          async ({
            input,
          }: {
            input: {
              state: ResearchMachineContext;
              languageModel: LanguageModel;
            };
          }) => {
            const finalAnswer = await finalizeAnswer(
              input.state,
              input.languageModel
            );
            return finalAnswer;
          }
        ),
      },
      guards: {
        isResearchSufficient: ({ event }) => {
          return event.output?.isSufficient === true;
        },
        hasReachedMaxLoops: ({ context }) => {
          return context.researchLoopCount >= context.maxResearchLoops;
        },
      },
    }
  );
}
