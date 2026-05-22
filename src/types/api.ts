export type UserRole = "admin" | "agent" | "customer" | "designer" | "merchant";
export type PublicRegistrationRole = Extract<UserRole, "customer" | "designer" | "merchant">;
export type ConversationType = "direct" | "support";

export type ApiUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string | null;
  emailVerifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ConversationParticipant = {
  userId: string;
  readAt: string | null;
};

export type ApiConversation = {
  id: string;
  type: ConversationType;
  participants: ConversationParticipant[];
  topic: string | null;
  productContext: { productId?: string; productName?: string } | null;
  lastMessageId: string | null;
  lastMessageAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ApiMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  clientMessageId: string;
  readBy: string[];
  createdAt: string;
  updatedAt: string;
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
};
