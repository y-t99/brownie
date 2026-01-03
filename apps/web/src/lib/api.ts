type ApiFetchInit = Omit<RequestInit, "credentials"> & {
  credentials?: RequestCredentials;
};

function getApiBaseUrl() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!baseUrl) {
    throw new Error(
      "Missing NEXT_PUBLIC_API_BASE_URL (e.g. http://localhost:3001/api)",
    );
  }
  return baseUrl.replace(/\/$/, "");
}

export function apiFetch(path: string, init?: ApiFetchInit) {
  const baseUrl = getApiBaseUrl();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return fetch(`${baseUrl}${normalizedPath}`, {
    ...init,
    credentials: init?.credentials ?? "include",
  });
}

export class ApiError extends Error {
  status: number;

  constructor(status: number, message?: string) {
    super(message ?? `API error: ${status}`);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiJson<T>(path: string, init?: ApiFetchInit): Promise<T> {
  const res = await apiFetch(path, init);
  if (!res.ok) throw new ApiError(res.status);
  return res.json() as Promise<T>;
}

