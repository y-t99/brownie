export interface SearchQueryList {
  query: string[];
  rationale: string;
}

export interface Reflection {
  isSufficient: boolean;
  knowledgeGap: string;
  followUpQueries: string;
}
