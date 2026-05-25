import { apiRequest } from "./client";
import type { ApiUser, Pagination, UserRole } from "@/types/api";

export async function getMe(): Promise<ApiUser> {
  const data = await apiRequest<{ user: ApiUser }>("/users/me");
  return data.user;
}

export async function updateProfile(input: {
  name?: string;
  avatarUrl?: string | null;
  bio?: string | null;
  location?: string | null;
}): Promise<ApiUser> {
  const data = await apiRequest<{ user: ApiUser }>("/users/me", {
    method: "PATCH",
    body: JSON.stringify(input)
  });
  return data.user;
}

export async function changePassword(input: {
  currentPassword: string;
  newPassword: string;
}): Promise<void> {
  await apiRequest("/users/me/password", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export async function listUsers(options?: {
  page?: number;
  limit?: number;
  role?: UserRole;
  search?: string;
}): Promise<{ users: ApiUser[]; pagination: Pagination }> {
  const params = new URLSearchParams();
  if (options?.page) params.set("page", String(options.page));
  if (options?.limit) params.set("limit", String(options.limit));
  if (options?.role) params.set("role", options.role);
  if (options?.search) params.set("search", options.search);
  const qs = params.size > 0 ? `?${params.toString()}` : "";

  return apiRequest<{ users: ApiUser[]; pagination: Pagination }>(`/users${qs}`);
}

export async function listChatContacts(options?: {
  page?: number;
  limit?: number;
  role?: Exclude<UserRole, "admin">;
  search?: string;
}): Promise<{ users: ApiUser[]; pagination: Pagination }> {
  const params = new URLSearchParams();
  if (options?.page) params.set("page", String(options.page));
  if (options?.limit) params.set("limit", String(options.limit));
  if (options?.role) params.set("role", options.role);
  if (options?.search) params.set("search", options.search);
  const qs = params.size > 0 ? `?${params.toString()}` : "";

  return apiRequest<{ users: ApiUser[]; pagination: Pagination }>(`/users/contacts${qs}`);
}
