import { ModelMessage, UserModelMessage } from "ai";

import { SearchQueries } from "./tool";
import { Citation } from "./util";

export interface ResearchMachineContext {
  messages: ModelMessage[];
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
  messages: UserModelMessage[];
};
