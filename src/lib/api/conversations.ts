import { apiRequest } from "./client";
import type { ApiConversation, Pagination } from "@/types/api";
import { MOCK_MODE, MOCK_CONVERSATIONS } from "@/lib/mock";

function conversationForUser(conversation: ApiConversation, currentUserId: string): ApiConversation {
  return {
    ...conversation,
    participants: conversation.participants.map((participant) => ({
      ...participant,
      userId: participant.userId === "mock-me" ? currentUserId : participant.userId,
    })),
  };
}

export async function listConversations(currentUserId: string): Promise<ApiConversation[]> {
  if (MOCK_MODE) return MOCK_CONVERSATIONS.map((conversation) => conversationForUser(conversation, currentUserId));
  const data = await apiRequest<{ conversations: ApiConversation[] }>("/conversations");
  return data.conversations;
}

export async function createConversation(input: {
  participantIds: string[];
  type?: "direct" | "support";
  topic?: string;
}, currentUserId: string): Promise<ApiConversation> {
  if (MOCK_MODE) {
    const now = new Date().toISOString();
    const otherId = input.participantIds[0] ?? null;
    const newConv: ApiConversation = {
      id: `conv-mock-${Date.now()}`,
      type: input.type ?? "direct",
      status: "open",
      assignedAgentId: null,
      participants: [
        { userId: currentUserId, readAt: now },
        ...(otherId ? [{ userId: otherId, readAt: now }] : []),
      ],
      topic: input.topic ?? null,
      productContext: null,
      lastMessageId: null,
      lastMessageBody: null,
      lastMessageAt: null,
      createdAt: now,
      updatedAt: now,
    };
    MOCK_CONVERSATIONS.unshift(newConv);
    return newConv;
  }
  const data = await apiRequest<{ conversation: ApiConversation }>("/conversations", {
    method: "POST",
    body: JSON.stringify(input)
  });
  return data.conversation;
}

export async function getConversation(id: string, currentUserId: string): Promise<ApiConversation> {
  if (MOCK_MODE) {
    const conv = MOCK_CONVERSATIONS.find((c) => c.id === id);
    if (!conv) throw new Error("Conversation not found");
    return conversationForUser(conv, currentUserId);
  }
  const data = await apiRequest<{ conversation: ApiConversation }>(`/conversations/${id}`);
  return data.conversation;
}

export async function markConversationRead(id: string, currentUserId: string): Promise<ApiConversation> {
  if (MOCK_MODE) {
    const conv = MOCK_CONVERSATIONS.find((c) => c.id === id);
    if (!conv) throw new Error("Conversation not found");
    return conversationForUser(conv, currentUserId);
  }
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
