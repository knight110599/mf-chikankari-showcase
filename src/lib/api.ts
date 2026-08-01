const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const AUTH_TOKEN_STORAGE_KEY =
  "mf-chikankari-access-token";

interface ApiErrorResponse {
  success?: boolean;
  message?: string;
}

function getAccessToken(): string | null {
  return (
    localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) ??
    sessionStorage.getItem(AUTH_TOKEN_STORAGE_KEY)
  );
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const accessToken = getAccessToken();

  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (
    accessToken &&
    !headers.has("Authorization")
  ) {
    headers.set(
      "Authorization",
      `Bearer ${accessToken}`,
    );
  }

  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,
      credentials: "include",
      headers,
    },
  );

  const data =
    (await response.json()) as T &
      ApiErrorResponse;

  if (!response.ok) {
    throw new Error(
      data.message || "API request failed.",
    );
  }

  return data;
}