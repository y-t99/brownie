import { tool } from "ai";
import axios from "axios";
import z, { Schema } from "zod";

export const searchQueriesSchema = z.object({
  queries: z.array(z.string()),
  rationale: z.string(),
});

export type SearchQueries = z.infer<typeof searchQueriesSchema>;

export const serpSearchParamsSchema = z.object({
  q: z.string(),
  start: z.number().optional(),
  num: z.number().optional(),
});

export type SerpSearchParams = z.infer<typeof serpSearchParamsSchema>;

const _serpSearchOrganicResultSchema = z.object({
  position: z.number(),
  title: z.string(),
  link: z.string(),
  snippet: z.string().optional(),
});

export type SerpSearchOrganicResult = z.infer<
  typeof _serpSearchOrganicResultSchema
>;

export function serpSearchApiTool(apiKey: string) {
  return tool<Schema<SerpSearchParams>, SerpSearchOrganicResult[]>({
    description:
      "API endpoint allows you to scrape the results from Google search engine via SerpApi service.",
    parameters: serpSearchParamsSchema,
    execute: async ({ q, start, num }) => {
      try {
        const url = "https://serpapi.com/search.json";
        const response = await axios.get(url, {
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
          position: result.position,
          title: result.title,
          link: result.link,
          snippet: result.snippet,
        }));
      } catch (_) {
        return [];
      }
    },
  });
}

export enum ToolName {
  SearchTool = "searchTool",
}
