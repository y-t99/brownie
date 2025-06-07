import { assign, createMachine } from "xstate";

interface ResearchMachineContext {
  messages: unknown[];
  searchQuery: unknown[];
  webResearchResult: unknown[];
  sourcesGathered: unknown[];
  initialSearchQueryCount: number;
  maxResearchLoops: number;
  researchLoopCount: number;
  reasoningModel: string;
}

interface ReflectionMachineContext {
  isSufficient: boolean;
  knowledgeGap: string;
  followUpQueries: unknown[];
  researchLoopCount: number;
  numberOfRanQueries: number;
}

export function createResearchMachine({
  initialSearchQueryCount,
  maxResearchLoops,
  reasoningModel,
}: Pick<
  ResearchMachineContext,
  "initialSearchQueryCount" | "maxResearchLoops" | "reasoningModel"
>) {
  const context: ResearchMachineContext = {
    messages: [],
    searchQuery: [],
    webResearchResult: [],
    sourcesGathered: [],
    initialSearchQueryCount,
    maxResearchLoops,
    researchLoopCount: 0,
    reasoningModel,
  };
  return createMachine({
    id: `${new Date().getTime()}-${Math.random().toString(36).substring(2, 15)}`,
    initial: "active",
    context,
    states: {
      active: {
        on: {
          ADD_MESSAGE: {
            actions: assign({
              messages: ({ context, event }) => [
                ...context.messages,
                event.message,
              ],
            }),
          },
          ADD_SEARCH_QUERY: {
            actions: assign({
              searchQuery: ({ context, event }) => [
                ...context.searchQuery,
                event.query,
              ],
            }),
          },
          ADD_WEB_RESEARCH_RESULT: {
            actions: assign({
              webResearchResult: ({ context, event }) => [
                ...context.webResearchResult,
                event.result,
              ],
            }),
          },
          ADD_SOURCES_GATHERED: {
            actions: assign({
              sourcesGathered: ({ context, event }) => [
                ...context.sourcesGathered,
                event.source,
              ],
            }),
          },
          INCREMENT_RESEARCH_LOOP_COUNT: {
            actions: assign({
              researchLoopCount: ({ context }) => context.researchLoopCount + 1,
            }),
          },
        },
      },
    },
  });
}

export function createReflectionMachine({
  isSufficient,
  knowledgeGap,
  followUpQueries,
}: Pick<
  ReflectionMachineContext,
  "isSufficient" | "knowledgeGap" | "followUpQueries"
>) {
  const context: ReflectionMachineContext = {
    isSufficient,
    knowledgeGap,
    followUpQueries,
    researchLoopCount: 0,
    numberOfRanQueries: 0,
  };

  return createMachine({
    id: `${new Date().getTime()}-${Math.random().toString(36).substring(2, 15)}`,
    initial: "active",
    context,
    states: {
      active: {
        on: {
          ADD_FOLLOW_UP_QUERY: {
            actions: assign({
              followUpQueries: ({ context, event }) => [
                ...context.followUpQueries,
                event.query,
              ],
            }),
          },
          INCREMENT_RESEARCH_LOOP_COUNT: {
            actions: assign({
              researchLoopCount: ({ context }) => context.researchLoopCount + 1,
            }),
          },
          INCREMENT_RAN_QUERIES: {
            actions: assign({
              numberOfRanQueries: ({ context }) =>
                context.numberOfRanQueries + 1,
            }),
          },
          SET_SUFFICIENCY: {
            actions: assign({
              isSufficient: ({ event }) => event.isSufficient,
            }),
          },
          SET_KNOWLEDGE_GAP: {
            actions: assign({
              knowledgeGap: ({ event }) => event.knowledgeGap,
            }),
          },
        },
      },
    },
  });
}
