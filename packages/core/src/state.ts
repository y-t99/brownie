import { CoreMessage, CoreUserMessage } from "ai";

import { SearchQueries } from "./tools";
import { Citation } from "./utils";

export interface ResearchMachineContext {
  messages: CoreMessage[];
  queries: SearchQueries[];
  searchQueries: string[];
  webResearchResults: string[];
  sourcesGathereds: Citation[];
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

export interface WebSearchContext {
  searchQuery: string;
  id: number;
}

export type ResearchEvent = {
  type: "START_RESEARCH";
  messages: CoreUserMessage[];
};
