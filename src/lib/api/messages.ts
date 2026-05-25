import { apiRequest } from "./client";
import type { ApiMessage } from "@/types/api";
import { MOCK_MODE, MOCK_MESSAGES } from "@/lib/mock";

function messageForUser(message: ApiMessage, currentUserId: string): ApiMessage {
  return {
    ...message,
    senderId: message.senderId === "mock-me" ? currentUserId : message.senderId,
    readBy: message.readBy.map((userId) => userId === "mock-me" ? currentUserId : userId),
  };
}

export async function listMessages(
  conversationId: string,
  options?: { limit?: number; before?: string },
  currentUserId?: string
): Promise<ApiMessage[]> {
  if (MOCK_MODE) {
    const userId = currentUserId ?? "mock-me";
    return (MOCK_MESSAGES[conversationId] ?? []).map((message) => messageForUser(message, userId));
  }
  const params = new URLSearchParams();
  if (options?.limit) params.set("limit", String(options.limit));
  if (options?.before) params.set("before", options.before);
  const qs = params.size > 0 ? `?${params.toString()}` : "";

  const data = await apiRequest<{ messages: ApiMessage[] }>(
    `/messages/${conversationId}${qs}`
  );
  return data.messages;
}

export async function sendMessage(
  conversationId: string,
  input: { body: string; clientMessageId: string },
  currentUserId: string
): Promise<ApiMessage> {
  if (MOCK_MODE) {
    return {
      id: `mock-msg-${Date.now()}`,
      conversationId,
      senderId: currentUserId,
      body: input.body,
      clientMessageId: input.clientMessageId,
      readBy: [currentUserId],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
  const data = await apiRequest<{ message: ApiMessage }>(
    `/messages/${conversationId}`,
    { method: "POST", body: JSON.stringify(input) }
  );
  return data.message;
}
