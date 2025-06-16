import { LanguageModel, Tool } from "ai";
import { SerpSearchOrganicResult, ToolName } from "./tools";

export interface ResearchConfiguration {
  queryGeneratorModel: LanguageModel;
  reflectionModel: LanguageModel;
  answerModel: LanguageModel;
  numberOfInitialQueries: number;
  maxResearchLoops: number;
  tools: { [ToolName.SearchTool]: Tool<any, SerpSearchOrganicResult[]> };
}
