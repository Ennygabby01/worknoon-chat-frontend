import type { ApiUser, ApiConversation, ApiMessage } from "@/types/api";

export const MOCK_MODE = true;

const ago = (ms: number) => new Date(Date.now() - ms).toISOString();
const mins = (m: number) => ago(m * 60_000);
const hrs  = (h: number) => ago(h * 3_600_000);

// ---- users ----

export const MOCK_ME: ApiUser = {
  id: "mock-me",
  name: "Gabriel Torres",
  email: "gabriel@example.com",
  role: "customer",
  avatarUrl: null,
  banned: false,
  emailVerifiedAt: hrs(720),
  createdAt: hrs(720),
  updatedAt: hrs(1),
};

export type PresenceStatus = "online" | "away" | "offline";

export const MOCK_PRESENCE: Map<string, PresenceStatus> = new Map([
  ["mock-1", "online"],
  ["mock-2", "away"],
  ["mock-3", "online"],
  ["mock-4", "away"],
  ["mock-5", "offline"],
  ["mock-6", "online"],
  ["mock-7", "away"],
]);

export const MOCK_USERS: ApiUser[] = [
  MOCK_ME,
  { id: "mock-1", name: "Alice Johnson",   email: "alice@example.com",         role: "designer", avatarUrl: null, banned: false, emailVerifiedAt: hrs(720), createdAt: hrs(720), updatedAt: hrs(1) },
  { id: "mock-2", name: "TechStore",        email: "hello@techstore.com",        role: "merchant", avatarUrl: null, banned: false, emailVerifiedAt: hrs(720), createdAt: hrs(720), updatedAt: hrs(1) },
  { id: "mock-3", name: "Support Agent",    email: "support@worknoon.com",       role: "agent",    avatarUrl: null, banned: false, emailVerifiedAt: hrs(720), createdAt: hrs(720), updatedAt: hrs(1) },
  { id: "mock-4", name: "Brandify Studio",  email: "studio@brandify.com",        role: "designer", avatarUrl: null, banned: false, emailVerifiedAt: hrs(720), createdAt: hrs(720), updatedAt: hrs(1) },
  { id: "mock-5", name: "Urban Shop",       email: "hello@urbanshop.com",        role: "merchant", avatarUrl: null, banned: false, emailVerifiedAt: hrs(720), createdAt: hrs(720), updatedAt: hrs(1) },
  { id: "mock-6", name: "Maya Chen",        email: "maya@worknoon.com",          role: "agent",    avatarUrl: null, banned: false, emailVerifiedAt: hrs(720), createdAt: hrs(720), updatedAt: hrs(1) },
  { id: "mock-7", name: "James Okafor",     email: "james@worknoon.com",         role: "agent",    avatarUrl: null, banned: false, emailVerifiedAt: hrs(720), createdAt: hrs(720), updatedAt: hrs(1) },
];

// ---- conversations ----

export const MOCK_CONVERSATIONS: ApiConversation[] = [
  {
    id: "conv-1",
    type: "direct",
    participants: [
      { userId: "mock-me", readAt: mins(2) },
      { userId: "mock-1", readAt: mins(3) },
    ],
    topic: null,
    productContext: null,
    lastMessageId: "msg-1-5",
    status: "open",
    assignedAgentId: null,
    lastMessageBody: "Would you like any changes to the colors?",
    lastMessageAt: mins(3),
    createdAt: hrs(2),
    updatedAt: mins(3),
  },
  {
    id: "conv-2",
    type: "direct",
    participants: [
      { userId: "mock-me", readAt: hrs(2) },
      { userId: "mock-2", readAt: mins(12) },
    ],
    topic: null,
    productContext: { productName: "Wireless Headphones" },
    lastMessageId: "msg-2-4",
    status: "open",
    assignedAgentId: null,
    lastMessageBody: "Thank you! I will check it.",
    lastMessageAt: mins(12),
    createdAt: hrs(3),
    updatedAt: mins(12),
  },
  {
    id: "conv-3",
    type: "support",
    participants: [
      { userId: "mock-me", readAt: hrs(1) },
      { userId: "mock-3", readAt: mins(40) },
    ],
    topic: null,
    productContext: null,
    lastMessageId: "msg-3-3",
    status: "open",
    assignedAgentId: null,
    lastMessageBody: "Please provide your order ID.",
    lastMessageAt: mins(40),
    createdAt: hrs(4),
    updatedAt: mins(40),
  },
  {
    id: "conv-4",
    type: "direct",
    participants: [
      { userId: "mock-me", readAt: hrs(23) },
      { userId: "mock-4", readAt: hrs(22) },
    ],
    topic: null,
    productContext: null,
    lastMessageId: "msg-4-3",
    status: "open",
    assignedAgentId: null,
    lastMessageBody: "Here is the preview you asked.",
    lastMessageAt: hrs(22),
    createdAt: hrs(25),
    updatedAt: hrs(22),
  },
  {
    id: "conv-5",
    type: "direct",
    participants: [
      { userId: "mock-me", readAt: hrs(23) },
      { userId: "mock-5", readAt: hrs(22) },
    ],
    topic: null,
    productContext: null,
    lastMessageId: "msg-5-3",
    status: "open",
    assignedAgentId: null,
    lastMessageBody: "Of course! We have size L.",
    lastMessageAt: hrs(22),
    createdAt: hrs(26),
    updatedAt: hrs(22),
  },
];

// ---- messages per conversation ----

export const MOCK_MESSAGES: Record<string, ApiMessage[]> = {
  "conv-1": [
    { id: "msg-1-1", conversationId: "conv-1", senderId: "mock-me",  body: "Hi Alice, I love this design!",               clientMessageId: "c1", readBy: ["mock-me", "mock-1"], createdAt: mins(20), updatedAt: mins(20) },
    { id: "msg-1-2", conversationId: "conv-1", senderId: "mock-1",   body: "Hi! Thank you so much.",                       clientMessageId: "c2", readBy: ["mock-me", "mock-1"], createdAt: mins(18), updatedAt: mins(18) },
    { id: "msg-1-3", conversationId: "conv-1", senderId: "mock-1",   body: "Would you like any changes to the colors?",    clientMessageId: "c3", readBy: ["mock-me", "mock-1"], createdAt: mins(15), updatedAt: mins(15) },
    { id: "msg-1-4", conversationId: "conv-1", senderId: "mock-me",  body: "Yes, can you make the background darker and the text white?", clientMessageId: "c4", readBy: ["mock-me", "mock-1"], createdAt: mins(10), updatedAt: mins(10) },
    { id: "msg-1-5", conversationId: "conv-1", senderId: "mock-1",   body: "Sure! Give me a few minutes.",                 clientMessageId: "c5", readBy: ["mock-me", "mock-1"], createdAt: mins(3),  updatedAt: mins(3)  },
  ],
  "conv-2": [
    { id: "msg-2-1", conversationId: "conv-2", senderId: "mock-me",  body: "Hey, I placed an order but haven't received a confirmation.",  clientMessageId: "c6",  readBy: ["mock-me", "mock-2"], createdAt: hrs(1),  updatedAt: hrs(1)  },
    { id: "msg-2-2", conversationId: "conv-2", senderId: "mock-2",   body: "Hello! How can I help you today?",              clientMessageId: "c7",  readBy: ["mock-me", "mock-2"], createdAt: mins(50), updatedAt: mins(50) },
    { id: "msg-2-3", conversationId: "conv-2", senderId: "mock-me",  body: "Hi! When will my order be shipped?",            clientMessageId: "c8",  readBy: ["mock-me", "mock-2"], createdAt: mins(30), updatedAt: mins(30) },
    { id: "msg-2-4", conversationId: "conv-2", senderId: "mock-2",   body: "Thank you! I will check it.",                   clientMessageId: "c9",  readBy: ["mock-2"],            createdAt: mins(12), updatedAt: mins(12) },
  ],
  "conv-3": [
    { id: "msg-3-1", conversationId: "conv-3", senderId: "mock-me",  body: "Hi, I need help with a refund.",                clientMessageId: "c10", readBy: ["mock-me", "mock-3"], createdAt: hrs(2),  updatedAt: hrs(2)  },
    { id: "msg-3-2", conversationId: "conv-3", senderId: "mock-3",   body: "I can help with that. What is the issue?",      clientMessageId: "c11", readBy: ["mock-me", "mock-3"], createdAt: hrs(1),  updatedAt: hrs(1)  },
    { id: "msg-3-3", conversationId: "conv-3", senderId: "mock-3",   body: "Please provide your order ID.",                 clientMessageId: "c12", readBy: ["mock-3"],            createdAt: mins(40), updatedAt: mins(40) },
  ],
  "conv-4": [
    { id: "msg-4-1", conversationId: "conv-4", senderId: "mock-me",  body: "Hey, can you share the logo variations?",       clientMessageId: "c13", readBy: ["mock-me", "mock-4"], createdAt: hrs(26), updatedAt: hrs(26) },
    { id: "msg-4-2", conversationId: "conv-4", senderId: "mock-4",   body: "Of course! Working on them now.",               clientMessageId: "c14", readBy: ["mock-me", "mock-4"], createdAt: hrs(25), updatedAt: hrs(25) },
    { id: "msg-4-3", conversationId: "conv-4", senderId: "mock-4",   body: "Here is the preview you asked.",                clientMessageId: "c15", readBy: ["mock-me", "mock-4"], createdAt: hrs(22), updatedAt: hrs(22) },
  ],
  "conv-5": [
    { id: "msg-5-1", conversationId: "conv-5", senderId: "mock-me",  body: "Do you carry this jacket in size L?",           clientMessageId: "c16", readBy: ["mock-me", "mock-5"], createdAt: hrs(25), updatedAt: hrs(25) },
    { id: "msg-5-2", conversationId: "conv-5", senderId: "mock-5",   body: "Hi! Let me check our stock.",                   clientMessageId: "c17", readBy: ["mock-me", "mock-5"], createdAt: hrs(24), updatedAt: hrs(24) },
    { id: "msg-5-3", conversationId: "conv-5", senderId: "mock-5",   body: "Of course! We have size L.",                    clientMessageId: "c18", readBy: ["mock-me", "mock-5"], createdAt: hrs(22), updatedAt: hrs(22) },
  ],
};
