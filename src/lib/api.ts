const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

interface ApiErrorResponse {
  success?: boolean;
  message?: string;
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = (await response.json()) as T & ApiErrorResponse;

  if (!response.ok) {
    throw new Error(data.message || "API request failed.");
  }

  return data;
}