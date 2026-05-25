export type UserRole = "admin" | "agent" | "customer" | "designer" | "merchant";
export type PublicRegistrationRole = Extract<UserRole, "customer" | "designer" | "merchant">;
export type ConversationType = "direct" | "support";
export type ConversationStatus = "open" | "escalated" | "assigned" | "resolved";

export type ApiUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string | null;
  bio: string | null;
  location: string | null;
  ordersCompleted: number;
  conversationsCount: number;
  banned: boolean;
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
  status: ConversationStatus;
  assignedAgentId: string | null;
  participants: ConversationParticipant[];
  topic: string | null;
  productContext: { productId?: string; productName?: string } | null;
  lastMessageId: string | null;
  lastMessageBody: string | null;
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

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned";

export type ApiOrder = {
  id: string;
  orderNumber: string;
  buyerId: string;
  sellerId: string;
  productName: string;
  amount: number;
  status: OrderStatus;
  sellerRole: "designer" | "merchant";
  conversationId: string | null;
  placedAt: string;
  createdAt: string;
  updatedAt: string;
};
