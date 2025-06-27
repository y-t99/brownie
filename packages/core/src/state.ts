import { CoreMessage, CoreUserMessage } from "ai";

import { ActorId } from "./actor";
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

export type ResearchEvent = {
  type: "START_RESEARCH";
  messages: CoreUserMessage[];
};
