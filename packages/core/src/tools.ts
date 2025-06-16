import { tool } from "ai";
import axios from "axios";
import z from "zod";

export const searchQueriesSchema = z.object({
  queries: z.array(z.string()),
  rationale: z.string(),
});

export type SearchQueries = z.infer<typeof searchQueriesSchema>;

export const reflectionSchema = z.object({
  is_sufficient: z.boolean(),
  knowledge_gap: z.string(),
  follow_up_queries: z.array(z.string()),
});

export type Reflection = z.infer<typeof reflectionSchema>;

const serpSearchParamsSchema = z.object({
  q: z.string(),
  start: z.number().optional(),
  num: z.number().optional(),
});

export type SerpSearchParams = z.infer<typeof serpSearchParamsSchema>;

const serpSearchOrganicResultSchema = z.object({
  position: z.number(),
  title: z.string(),
  link: z.string(),
  snippet: z.string().optional(),
});

export type SerpSearchOrganicResult = z.infer<
  typeof serpSearchOrganicResultSchema
>;

export function serpSearchApiTool(apiKey: string) {
  return tool({
    description:
      "API endpoint allows you to scrape the results from Google search engine via SerpApi service.",
    parameters: serpSearchParamsSchema,
    execute: async ({ q, start, num }: SerpSearchParams) => {
      try {
        const baseUrl = "https://serpapi.com/search.json";
        const response = await axios.get(baseUrl, {
          params: {
            engine: "google",
            q,
            start,
            num,
            api_key: apiKey,
          },
        });
        const organicResults = response.data
          ?.organic_results as SerpSearchOrganicResult[];
        return organicResults.map((result) => ({
          title: result.title,
          link: result.link,
          snippet: result.snippet,
        }));
      } catch (_) {}
    },
  });
}

export enum ToolName {
  SearchTool = "searchTool",
}
