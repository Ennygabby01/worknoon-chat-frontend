import { apiRequest } from "./client";
import type { ApiConversation, Pagination } from "@/types/api";

export async function listConversations(): Promise<ApiConversation[]> {
  const data = await apiRequest<{ conversations: ApiConversation[] }>("/conversations");
  return data.conversations;
}

export async function createConversation(input: {
  participantIds: string[];
  type?: "direct" | "support";
  topic?: string;
}): Promise<ApiConversation> {
  const data = await apiRequest<{ conversation: ApiConversation }>("/conversations", {
    method: "POST",
    body: JSON.stringify(input)
  });
  return data.conversation;
}

export async function getConversation(id: string): Promise<ApiConversation> {
  const data = await apiRequest<{ conversation: ApiConversation }>(`/conversations/${id}`);
  return data.conversation;
}

export async function markConversationRead(id: string): Promise<ApiConversation> {
  const data = await apiRequest<{ conversation: ApiConversation }>(
    `/conversations/${id}/read`,
    { method: "PATCH" }
  );
  return data.conversation;
}

export async function listAdminConversations(options?: {
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
