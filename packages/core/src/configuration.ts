import { LanguageModel } from "ai";

export interface ResearchConfiguration {
  queryGeneratorModel: LanguageModel;
  reflectionModel: LanguageModel;
  answerModel: LanguageModel;
  numberOfInitialQueries: number;
  maxResearchLoops: number;
  tools: Record<string, unknown>;
}
