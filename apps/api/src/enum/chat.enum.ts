export enum ChatMessageRole {
  SYSTEM = "system",
  USER = "user",
  ASSISTANT = "assistant",
  TOOL = "tool",
}

export enum ChatMessageStatus {
  EXECUTING = "executing",
  PROCESSING = "processing",
  PENDING = "pending",
  SUCCESS = "success",
  PAUSED = "paused",
  ERROR = "error",
}

export enum ChatMessageFinishReason {
  STOP = "stop",
  LENGTH = "length",
  CONTENT_FILTER = "content-filter",
  TOOL_CALLS = "tool-calls",
  ERROR = "error",
  OTHER = "other",
  UNKNOWN = "unknown",
}

export enum ChatMessageSpecification {
  VERCEL = "vercel",
}
