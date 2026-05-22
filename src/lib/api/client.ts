import { getApiUrl } from "./config";
import { getSafeErrorMessage, type AppError } from "./app-error";
import { getAccessToken, setAccessToken } from "../session/session-store";
import { refreshSession } from "./auth";

type ApiClientOptions = RequestInit & {
  skipRefresh?: boolean;
};

async function doRequest<T>(path: string, options: ApiClientOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
  const token = getAccessToken();

  if (options.body && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }

  if (token) {
    headers.set("authorization", `Bearer ${token}`);
  }

  const response = await fetch(getApiUrl(path), {
    ...options,
    headers,
    credentials: "include"
  });

  if (response.status === 401 && !options.skipRefresh) {
    try {
      const result = await refreshSession();
      setAccessToken(result.accessToken);
      return doRequest<T>(path, { ...options, skipRefresh: true });
    } catch {
      setAccessToken(null);
      const error: AppError = {
        code: "SESSION_EXPIRED",
        message: "Please sign in again to continue.",
        status: 401
      };
      throw error;
    }
  }

  if (!response.ok) {
    const error: AppError = {
      code: "REQUEST_FAILED",
      message: getSafeErrorMessage(response.status),
      status: response.status
    };
    throw error;
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export function apiRequest<T>(path: string, options: ApiClientOptions = {}): Promise<T> {
  return doRequest<T>(path, options);
}
