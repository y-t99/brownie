export enum TaskStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
}

export enum TaskTitle {
  TEXT_TO_IMAGE = "Text to Image Generation",
  IMAGE_TO_IMAGE = "Image to Image Generation",
}

export enum TaskResourceType {
  CHAT_MESSAGE = "chat-message",
  IMAGE = "image",
}
