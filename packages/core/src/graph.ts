import { CoreAssistantMessage } from "ai";
import { assign, createMachine, DoneActorEvent } from "xstate";

import { ResearchConfiguration } from "./configuration";
import { ResearchEvent, ResearchMachineContext } from "./state";
import { SearchQueries } from "./tools";
import {
  answerActor,
  AnswerActorInput,
  GenerateQueriesActorInput,
  queryGenerationActor,
  Reflection,
  reflectionActor,
  ReflectionActorInput,
  webResearchActor,
  WebResearchActorInput,
  WebResearchResult,
} from "./actor";

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
        context: {} as ResearchMachineContext,
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
            src: queryGenerationActor,
            input: ({ context }): GenerateQueriesActorInput => ({
              messages: context.messages,
              numberQueries: context.initialSearchQueryCount,
              languageModel: config.queryGeneratorModel,
            }),
            onDone: {
              target: "webSearching",
              actions: assign({
                queries: ({
                  context,
                  event,
                }: {
                  context: ResearchMachineContext;
                  event: DoneActorEvent<SearchQueries, string>;
                }) => [...context.queries, event.output],
                searchQueries: ({
                  context,
                  event,
                }: {
                  context: ResearchMachineContext;
                  event: DoneActorEvent<SearchQueries, string>;
                }) => [...context.searchQueries, ...event.output.queries],
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
            src: webResearchActor,
            input: ({ context }): WebResearchActorInput => ({
              queries: context.queries[context.queries.length - 1],
              languageModel: config.queryGeneratorModel,
              tools: config.tools,
            }),
            onDone: {
              target: "reflecting",
              actions: assign({
                webResearchResults: ({
                  context,
                  event,
                }: {
                  context: ResearchMachineContext;
                  event: DoneActorEvent<WebResearchResult[], string>;
                }) => [
                  ...context.webResearchResults,
                  ...event.output.map(
                    (item: WebResearchResult) => item.webResearchResult,
                  ),
                ],
                sourcesGathereds: ({ context, event }) => [
                  ...context.sourcesGathereds,
                  ...event.output
                    .map((item: WebResearchResult) => item.sourcesGathered)
                    .flat(),
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
            src: reflectionActor,
            input: ({ context }): ReflectionActorInput => ({
              messages: context.messages,
              webResearchResults: context.webResearchResults,
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
                guard: {
                  type: "isResearchSufficient",
                  params: ({
                    event,
                  }: {
                    event: DoneActorEvent<Reflection, string>;
                  }) => event.output.is_sufficient,
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
                  queries: ({
                    context,
                    event,
                  }: {
                    context: ResearchMachineContext;
                    event: DoneActorEvent<Reflection, string>;
                  }) => [
                    ...context.queries,
                    {
                      queries: event.output.follow_up_queries,
                      rationale: event.output.knowledge_gap,
                    },
                  ],
                  searchQueries: ({
                    context,
                    event,
                  }: {
                    context: ResearchMachineContext;
                    event: DoneActorEvent<Reflection, string>;
                  }) => [
                    ...context.searchQueries,
                    ...event.output.follow_up_queries,
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
            src: answerActor,
            input: ({ context }): AnswerActorInput => ({
              messages: context.messages,
              webResearchResults: context.webResearchResults,
              languageModel: config.answerModel,
            }),
            onDone: {
              target: "completed",
              actions: assign({
                messages: ({
                  context,
                  event,
                }: {
                  context: ResearchMachineContext;
                  event: DoneActorEvent<string, string>;
                }) => [
                  ...context.messages,
                  {
                    role: "assistant",
                    content: event.output,
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
    },
  );
}
