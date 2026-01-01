export const HttpMethod = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
  HEAD: "HEAD",
  OPTIONS: "OPTIONS",
} as const;

export const HttpHeader = {
  CONTENT_TYPE: "Content-Type",
  AUTHORIZATION: "Authorization",
  ACCEPT: "Accept",
  CACHE_CONTROL: "Cache-Control",
} as const;

export const ContentType = {
  JSON: "application/json",
  FORM_URLENCODED: "application/x-www-form-urlencoded",
  MULTIPART_FORM_DATA: "multipart/form-data",
  TEXT_PLAIN: "text/plain",
  HTML: "text/html",
  XML: "application/xml",
  PDF: "application/pdf",
  PNG: "image/png",
  JPEG: "image/jpeg",
  GIF: "image/gif",
  WEBP: "image/webp",
  SVG: "image/svg+xml",
  MP4: "video/mp4",
  WEBM: "video/webm",
  MP3: "audio/mpeg",
  WAV: "audio/wav",
  OGG: "audio/ogg",
} as const;
