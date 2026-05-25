import { apiRequest } from "./client";
import type { ApiMessage } from "@/types/api";

export async function listMessages(
  conversationId: string,
  options?: { limit?: number; before?: string }
): Promise<ApiMessage[]> {
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
  input: { body: string; clientMessageId: string }
): Promise<ApiMessage> {
  const data = await apiRequest<{ message: ApiMessage }>(
    `/messages/${conversationId}`,
    { method: "POST", body: JSON.stringify(input) }
  );
  return data.message;
}
