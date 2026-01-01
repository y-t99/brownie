export const StorageKeyPrefix = {
  IMAGE: "images",
  VIDEO: "videos",
  AUDIO: "audio",
  DOCUMENT: "documents",
} as const;

export const ImageExtension = {
  PNG: "png",
  JPEG: "jpeg",
  JPG: "jpg",
  WEBP: "webp",
  GIF: "gif",
  SVG: "svg",
} as const;

export const VideoExtension = {
  MP4: "mp4",
  WEBM: "webm",
  MOV: "mov",
  AVI: "avi",
} as const;

export const AudioExtension = {
  MP3: "mp3",
  WAV: "wav",
  OGG: "ogg",
  AAC: "aac",
} as const;

export const DocumentExtension = {
  PDF: "pdf",
  DOC: "doc",
  DOCX: "docx",
  TXT: "txt",
} as const;

const MEDIA_TYPE_TO_EXTENSION: Record<string, string> = {
  "image/png": ImageExtension.PNG,
  "image/jpeg": ImageExtension.JPEG,
  "image/jpg": ImageExtension.JPG,
  "image/webp": ImageExtension.WEBP,
};

export function getExtensionFromMediaType(mediaType: string): string {
  return MEDIA_TYPE_TO_EXTENSION[mediaType] || "bin";
}

export interface GenerateStorageKeyOptions {
  prefix: (typeof StorageKeyPrefix)[keyof typeof StorageKeyPrefix];
  userId: string;
  taskId: string;
  resourceId: string;
  extension?: string;
}

export function generateStorageKey(options: GenerateStorageKeyOptions): string {
  const timestamp = Date.now();
  const parts = [
    options.prefix,
    options.userId,
    options.taskId,
    `${options.resourceId}_${timestamp}`,
  ];

  const key = parts.join("/");

  if (options.extension) {
    return `${key}.${options.extension}`;
  }

  return key;
}
