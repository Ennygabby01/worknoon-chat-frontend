import { getApiUrl } from "./config";
import { getSafeErrorMessage, type AppError } from "./app-error";
import { setAccessToken } from "../session/session-store";
import type { ApiUser, PublicRegistrationRole } from "@/types/api";

type AuthResult = {
  user: ApiUser;
  accessToken: string;
};

type ActionResponse = {
  sent?: boolean;
  reset?: boolean;
};

let refreshPromise: Promise<AuthResult> | null = null;

export async function register(input: {
  name: string;
  email: string;
  password: string;
  role: PublicRegistrationRole;
}): Promise<AuthResult> {
  const response = await fetch(getApiUrl("/auth/register"), {
    method: "POST",
    headers: { "content-type": "application/json" },
    credentials: "include",
    body: JSON.stringify(input)
  });

  if (!response.ok) {
    const error: AppError = {
      code: "REGISTER_FAILED",
      message:
        response.status === 409
          ? "An account with this email already exists."
          : getSafeErrorMessage(response.status),
      status: response.status
    };
    throw error;
  }

  return response.json() as Promise<AuthResult>;
}

export async function login(input: {
  email: string;
  password: string;
}): Promise<AuthResult> {
  const response = await fetch(getApiUrl("/auth/login"), {
    method: "POST",
    headers: { "content-type": "application/json" },
    credentials: "include",
    body: JSON.stringify(input)
  });

  if (!response.ok) {
    const error: AppError = {
      code: "LOGIN_FAILED",
      message:
        response.status === 401
          ? "The email or password is incorrect."
          : getSafeErrorMessage(response.status),
      status: response.status
    };
    throw error;
  }

  return response.json() as Promise<AuthResult>;
}

export function refreshSession(): Promise<AuthResult> {
  if (!refreshPromise) {
    refreshPromise = fetch(getApiUrl("/auth/refresh"), {
      method: "POST",
      credentials: "include"
    })
      .then(async (response) => {
        if (!response.ok) {
          const error: AppError = {
            code: "REFRESH_FAILED",
            message: "Please sign in again to continue.",
            status: response.status
          };
          throw error;
        }
        const result = (await response.json()) as AuthResult;
        setAccessToken(result.accessToken);
        return result;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

export async function logout(): Promise<void> {
  try {
    await fetch(getApiUrl("/auth/logout"), {
      method: "POST",
      credentials: "include"
    });
  } finally {
    setAccessToken(null);
  }
}

export async function requestEmailVerification(email: string): Promise<ActionResponse> {
  const response = await fetch(getApiUrl("/auth/email-verification/request"), {
    method: "POST",
    headers: { "content-type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email })
  });

  if (!response.ok) {
    const error: AppError = {
      code: "VERIFICATION_REQUEST_FAILED",
      message: getSafeErrorMessage(response.status),
      status: response.status
    };
    throw error;
  }

  return response.json() as Promise<ActionResponse>;
}

export async function confirmEmailVerification(input: {
  email: string;
  code: string;
}): Promise<{ user: ApiUser }> {
  const response = await fetch(getApiUrl("/auth/email-verification/confirm"), {
    method: "POST",
    headers: { "content-type": "application/json" },
    credentials: "include",
    body: JSON.stringify(input)
  });

  if (!response.ok) {
    const error: AppError = {
      code: "VERIFICATION_FAILED",
      message:
        response.status === 400
          ? "The verification code is invalid or expired."
          : getSafeErrorMessage(response.status),
      status: response.status
    };
    throw error;
  }

  return response.json() as Promise<{ user: ApiUser }>;
}

export async function requestPasswordReset(email: string): Promise<ActionResponse> {
  const response = await fetch(getApiUrl("/auth/password-reset/request"), {
    method: "POST",
    headers: { "content-type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email })
  });

  if (!response.ok) {
    const error: AppError = {
      code: "PASSWORD_RESET_REQUEST_FAILED",
      message: getSafeErrorMessage(response.status),
      status: response.status
    };
    throw error;
  }

  return response.json() as Promise<ActionResponse>;
}

export async function resetPassword(input: {
  token: string;
  password: string;
}): Promise<ActionResponse> {
  const response = await fetch(getApiUrl("/auth/password-reset/confirm"), {
    method: "POST",
    headers: { "content-type": "application/json" },
    credentials: "include",
    body: JSON.stringify(input)
  });

  if (!response.ok) {
    const error: AppError = {
      code: "PASSWORD_RESET_FAILED",
      message:
        response.status === 400
          ? "The reset link is invalid or expired."
          : getSafeErrorMessage(response.status),
      status: response.status
    };
    throw error;
  }

  return response.json() as Promise<ActionResponse>;
}
