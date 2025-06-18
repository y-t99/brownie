import { CoreMessage, CoreUserMessage } from "ai";

import { SearchQueries } from "./tools";

export interface ResearchMachineContext {
  messages: CoreMessage[];
  searchQueries: string[];
  webResearchResults: string[];
  sourcesGathereds: {
    title: string;
    link: string;
    snippet: string;
  }[];
  initialSearchQueryCount: number;
  maxResearchLoops: number;
  researchLoopCount: number;
  queryGeneratorModel: string | null;
  reflectionModel: string | null;
  answerModel: string | null;
}

export interface ReflectionMachineContext {
  isSufficient: boolean;
  knowledgeGap: string;
  followUpQueries: unknown[];
  researchLoopCount: number;
  numberOfRanQueries: number;
}

export interface QueryGenerationContext {
  queries: SearchQueries[];
}

export interface WebSearchContext {
  searchQuery: string;
  id: number;
}

export type ResearchEvent = {
  type: "START_RESEARCH";
  messages: CoreUserMessage[];
};
