import { apiRequest } from "./client";
import type { ApiConversation } from "@/types/api";

export async function getAgentQueue(): Promise<ApiConversation[]> {
  const data = await apiRequest<{ conversations: ApiConversation[] }>("/conversations/queue");
  return data.conversations;
}

export async function getAgentCases(): Promise<ApiConversation[]> {
  const data = await apiRequest<{ conversations: ApiConversation[] }>("/conversations/my-cases");
  return data.conversations;
}

export async function claimConversation(conversationId: string): Promise<ApiConversation> {
  const data = await apiRequest<{ conversation: ApiConversation }>(
    `/conversations/${conversationId}/claim`,
    { method: "POST" }
  );
  return data.conversation;
}

export async function resolveConversation(conversationId: string): Promise<ApiConversation> {
  const data = await apiRequest<{ conversation: ApiConversation }>(
    `/conversations/${conversationId}/resolve`,
    { method: "POST" }
  );
  return data.conversation;
}

export async function escalateConversation(conversationId: string): Promise<ApiConversation> {
  const data = await apiRequest<{ conversation: ApiConversation }>(
    `/conversations/${conversationId}/escalate`,
    { method: "POST" }
  );
  return data.conversation;
}
