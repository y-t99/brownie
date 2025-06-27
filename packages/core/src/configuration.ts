import { LanguageModel, Tool } from "ai";

import { ToolName } from "./tools";

export interface ResearchConfiguration {
  queryGeneratorModel: LanguageModel;
  reflectionModel: LanguageModel;
  answerModel: LanguageModel;
  numberOfInitialQueries: number;
  maxResearchLoops: number;
  tools: Record<ToolName, Tool>;
}
