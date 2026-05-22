"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getConversation, markConversationRead } from "@/lib/api/conversations";
import { listMessages, sendMessage } from "@/lib/api/messages";
import { getSocket } from "@/lib/realtime/socket";
import { realtimeEvents } from "@/lib/realtime/events";
import { useSession } from "@/lib/session/session-context";
import { useUserName } from "@/lib/users/user-cache-context";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { MessageBubble } from "./MessageBubble";
import { ChatComposer } from "./ChatComposer";
import { TypingIndicator } from "./TypingIndicator";
import type { ApiConversation, ApiMessage } from "@/types/api";

type TypingState = Record<string, boolean>;

type ChatHeaderProps = {
  conversation: ApiConversation;
  currentUserId: string;
  onBack: () => void;
};

function ChatHeaderContent({ conversation, currentUserId, onBack }: ChatHeaderProps) {
  const otherId =
    conversation.participants.find((p) => p.userId !== currentUserId)?.userId ??
    currentUserId;
  const otherName = useUserName(otherId);

  const displayName = conversation.topic ?? otherName;

  return (
    <div className="chat-header">
      <button className="chat-header-back" onClick={onBack} aria-label="Back to inbox">
        <BackIcon />
      </button>
      <Avatar name={displayName} size="md" />
      <div className="chat-header-info">
        <div className="chat-header-name">{displayName}</div>
        <div className="chat-header-sub">
          <Badge label={conversation.type} variant="default" />
          <span style={{ color: "var(--color-border)" }}>·</span>
          <span>{conversation.participants.length} participants</span>
        </div>
      </div>
    </div>
  );
}

function isSameDay(a: string, b: string): boolean {
  const da = new Date(a);
  const db = new Date(b);
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  );
}

function formatDay(iso: string): string {
  const date = new Date(iso);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (isSameDay(iso, today.toISOString())) return "Today";
  if (isSameDay(iso, yesterday.toISOString())) return "Yesterday";
  return date.toLocaleDateString([], { month: "long", day: "numeric", year: "numeric" });
}

function generateClientId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

type ChatViewProps = {
  conversationId: string;
};

export function ChatView({ conversationId }: ChatViewProps) {
  const { session } = useSession();
  const router = useRouter();
  const currentUserId = session!.user.id;

  const [conversation, setConversation] = useState<ApiConversation | null>(null);
  const [messages, setMessages] = useState<ApiMessage[]>([]);
  const [loadingConv, setLoadingConv] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(true);
  const [error, setError] = useState("");
  const [typing, setTyping] = useState<TypingState>({});
  const [connected, setConnected] = useState(true);

  const threadRef = useRef<HTMLDivElement>(null);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didJoin = useRef(false);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    if (threadRef.current) {
      threadRef.current.scrollTo({ top: threadRef.current.scrollHeight, behavior });
    }
  }, []);

  useEffect(() => {
    Promise.all([getConversation(conversationId), listMessages(conversationId)])
      .then(([conv, msgs]) => {
        setConversation(conv);
        setMessages(msgs);
        markConversationRead(conversationId).catch(() => {});
      })
      .catch(() => setError("We could not load this conversation."))
      .finally(() => {
        setLoadingConv(false);
        setLoadingMsgs(false);
      });
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom("instant");
  }, [loadingMsgs, scrollToBottom]);

  useEffect(() => {
    const socket = getSocket();

    if (!didJoin.current) {
      socket.emit(realtimeEvents.conversationJoin, { conversationId });
      didJoin.current = true;
    }

    function handleMessageNew(payload: { message: ApiMessage }) {
      if (payload.message.conversationId !== conversationId) return;
      setMessages((prev) => {
        if (prev.some((m) => m.id === payload.message.id)) return prev;
        return [...prev, payload.message];
      });
      markConversationRead(conversationId).catch(() => {});
      setTimeout(() => scrollToBottom(), 50);
    }

    function handleTypingUpdate(payload: {
      conversationId: string;
      userId: string;
      isTyping: boolean;
    }) {
      if (payload.conversationId !== conversationId) return;
      if (payload.userId === currentUserId) return;
      setTyping((prev) => ({ ...prev, [payload.userId]: payload.isTyping }));
    }

    function handleDisconnect() {
      setConnected(false);
    }

    function handleConnect() {
      setConnected(true);
      socket.emit(realtimeEvents.conversationJoin, { conversationId });
    }

    socket.on(realtimeEvents.messageNew, handleMessageNew);
    socket.on(realtimeEvents.typingUpdate, handleTypingUpdate);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect", handleConnect);

    return () => {
      socket.off(realtimeEvents.messageNew, handleMessageNew);
      socket.off(realtimeEvents.typingUpdate, handleTypingUpdate);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect", handleConnect);
      socket.emit(realtimeEvents.conversationLeave, { conversationId });
      didJoin.current = false;
    };
  }, [conversationId, currentUserId, scrollToBottom]);

  function handleTyping() {
    const socket = getSocket();
    socket.emit(realtimeEvents.typingStart, { conversationId });
    if (typingTimer.current) clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => {
      socket.emit(realtimeEvents.typingStop, { conversationId });
    }, 2000);
  }

  async function handleSend(body: string) {
    const clientMessageId = generateClientId();
    const message = await sendMessage(conversationId, { body, clientMessageId });
    setMessages((prev) => {
      if (prev.some((m) => m.id === message.id)) return prev;
      return [...prev, message];
    });
    setTimeout(() => scrollToBottom(), 50);
    const socket = getSocket();
    socket.emit(realtimeEvents.typingStop, { conversationId });
  }

  if (loadingConv || loadingMsgs) {
    return (
      <div className="chat-area">
        <div className="loading-screen">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  if (error || !conversation) {
    return (
      <div className="chat-area">
        <div className="chat-empty">
          <span>{error || "Conversation not found."}</span>
        </div>
      </div>
    );
  }

  const typingNames = Object.entries(typing)
    .filter(([, isTyping]) => isTyping)
    .map(([id]) => `User …${id.slice(-5)}`);

  return (
    <div className="chat-area panel-active">
      <ChatHeaderContent
        conversation={conversation}
        currentUserId={currentUserId}
        onBack={() => router.push("/inbox")}
      />

      {!connected && (
        <div className="connection-banner">
          Reconnecting... Your messages will be delivered when connection is restored.
        </div>
      )}

      <div className="message-thread" ref={threadRef}>
        {messages.length === 0 && (
          <div className="chat-empty" style={{ flex: "none", padding: "24px 0" }}>
            <span>No messages yet. Start the conversation.</span>
          </div>
        )}

        {messages.map((msg, idx) => {
          const prev = messages[idx - 1];
          const showDivider = !prev || !isSameDay(prev.createdAt, msg.createdAt);
          const isOwn = msg.senderId === currentUserId;
          const prevSameSender = prev?.senderId === msg.senderId;
          const senderName = `User …${msg.senderId.slice(-5)}`;

          return (
            <div key={msg.id}>
              {showDivider && (
                <div className="message-date-divider">{formatDay(msg.createdAt)}</div>
              )}
              <MessageBubble
                message={msg}
                isOwn={isOwn}
                senderName={senderName}
                showAvatar={!isOwn && !prevSameSender}
              />
            </div>
          );
        })}

        {typingNames.length > 0 && <TypingIndicator names={typingNames} />}
      </div>

      <ChatComposer
        onSend={handleSend}
        onTyping={handleTyping}
        disabled={!connected}
      />
    </div>
  );
}

function BackIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}
