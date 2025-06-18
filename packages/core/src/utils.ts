import { CoreMessage } from "ai";

import { SerpSearchOrganicResult, ToolName } from "./tools";

export function format(template: string, params: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (_, key) => params[key]!);
}

export function getResearchTopic(messages: CoreMessage[]) {
  let researchTopic: string = "";
  if (messages.length === 1) {
    const message = messages[messages.length - 1]!;
    if (typeof message.content === "string") {
      researchTopic = message.content;
    }
  } else {
    for (const message of messages) {
      const content = message.content;
      if (typeof content === "string") {
        if (message.role === "user") {
          researchTopic += `User: ${message.content}\n`;
        } else if (message.role === "assistant") {
          researchTopic += `Assistant: ${message.content}\n`;
        }
      }
    }
  }
  return researchTopic;
}

export interface Citation {
  title: string;
  link: string;
  snippet?: string;
}

export function getCitations(
  toolResults: { tool: string; input: unknown; output: unknown }[]
) {
  const citations: Citation[] = [];
  for (const toolResult of toolResults) {
    if (toolResult.tool === ToolName.SearchTool) {
      const output = toolResult.output as SerpSearchOrganicResult[];
      for (const result of output) {
        citations.push({
          title: result.title,
          link: result.link,
          snippet: result.snippet,
        });
      }
    }
  }
  return citations;
}

export function insertCitationMarkers(text: string, _citations: Citation[]) {
  return text;
}
