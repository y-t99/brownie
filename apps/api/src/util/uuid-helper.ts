import { v4 as uuidv4 } from "uuid";

export const UUIDType = {
  CHAT_SESSION: "cs",
  CHAT_MESSAGE: "cm",
  CHAT_MESSAGE_BLOCK: "cmb",
  TASK: "tsk",
  TASK_RESOURCE_RELATION: "trr",
  USER: "usr",
} as const;

export function generateUUID(type: (typeof UUIDType)[keyof typeof UUIDType]) {
  return `${type}${uuidv4().replace(/-/g, "").slice(0, 16)}`;
}
