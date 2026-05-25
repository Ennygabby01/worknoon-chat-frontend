import { apiRequest } from "./client";
import type { ApiUser, ApiConversation, Pagination, UserRole } from "@/types/api";

export async function adminListUsers(options?: {
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

export async function adminUpdateUser(
  userId: string,
  input: { role?: UserRole; banned?: boolean }
): Promise<ApiUser> {
  const data = await apiRequest<{ user: ApiUser }>(`/admin/users/${userId}`, {
    method: "PATCH",
    body: JSON.stringify(input)
  });
  return data.user;
}

export async function adminListConversations(options?: {
  page?: number;
  limit?: number;
  type?: "direct" | "support";
}): Promise<{ conversations: ApiConversation[]; pagination: Pagination }> {
  const params = new URLSearchParams();
  if (options?.page) params.set("page", String(options.page));
  if (options?.limit) params.set("limit", String(options.limit));
  if (options?.type) params.set("type", options.type);
  const qs = params.size > 0 ? `?${params.toString()}` : "";
  return apiRequest<{ conversations: ApiConversation[]; pagination: Pagination }>(
    `/admin/conversations${qs}`
  );
}
