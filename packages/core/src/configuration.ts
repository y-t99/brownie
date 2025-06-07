export interface Configuration {
  queryGeneratorModel: string;
  reflectionModel: string;
  answerModel: string;
  numberOfInitialQueries: number;
  maxResearchLoops: number;
}