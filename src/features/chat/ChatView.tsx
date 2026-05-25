"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getConversation, markConversationRead } from "@/lib/api/conversations";
import { listMessages, sendMessage } from "@/lib/api/messages";
import { getSocket } from "@/lib/realtime/socket";
import { realtimeEvents } from "@/lib/realtime/events";
import { useSession } from "@/lib/session/session-context";
import { useUserName, useUserRole } from "@/lib/users/user-cache-context";
import { usePresence } from "@/lib/realtime/online-status-context";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Avatar } from "@/components/ui/Avatar";
import { Drawer } from "@/components/ui/Drawer";
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
  onNameClick: () => void;
  detailOpen: boolean;
};

function ChatHeaderContent({
  conversation,
  currentUserId,
  onBack,
  onNameClick,
  detailOpen,
}: ChatHeaderProps) {
  const otherParticipant = conversation.participants.find((p) => p.userId !== currentUserId);
  const waitingForAgent = conversation.type === "support" && !otherParticipant;
  const otherId = otherParticipant?.userId ?? currentUserId;
  const otherName = useUserName(otherId);
  const otherRole = useUserRole(otherId);
  const presence = usePresence(otherId);

  const displayName = waitingForAgent
    ? "Worknoon Support"
    : otherName || conversation.topic || "Participant";
  const roleLabel = otherRole
    ? otherRole.charAt(0).toUpperCase() + otherRole.slice(1)
    : conversation.type === "support"
    ? "Support"
    : "";
  const presenceLabel = waitingForAgent
    ? "Waiting for an agent"
    : presence.charAt(0).toUpperCase() + presence.slice(1);

  return (
    <div className="chat-header">
      <button className="chat-header-back" onClick={onBack} aria-label="Back to inbox">
        <BackIcon />
      </button>
      <div className="avatar-wrap">
        <Avatar name={displayName} size="md" />
        {!waitingForAgent && presence !== "offline" && (
          <span className={`online-dot online-dot--${presence}`} aria-label={presence} />
        )}
      </div>
      <div className="chat-header-info">
        <button
          className="chat-header-name-btn"
          onClick={onNameClick}
          aria-expanded={detailOpen}
          aria-label="View contact details"
        >
          {displayName}
        </button>
        <div className="chat-header-sub">
          {roleLabel && <span>{roleLabel}</span>}
          <span className={`presence-text presence-text--${waitingForAgent ? "away" : presence}`}>
            {presenceLabel}
          </span>
        </div>
      </div>
    </div>
  );
}

function ChatDetailContent({
  conversation,
  currentUserId,
  onClose,
}: {
  conversation: ApiConversation;
  currentUserId: string;
  onClose: () => void;
}) {
  const otherId =
    conversation.participants.find((p) => p.userId !== currentUserId)?.userId ??
    currentUserId;
  const otherName = useUserName(otherId);
  const otherRole = useUserRole(otherId);

  const displayName = otherName || conversation.topic || "Participant";
  const roleLabel = otherRole
    ? otherRole.charAt(0).toUpperCase() + otherRole.slice(1)
    : conversation.type === "support"
    ? "Support"
    : "";

  return (
    <>
      <div className="chat-detail-header">
        <span className="chat-detail-title">Details</span>
        <button className="chat-detail-close" onClick={onClose} aria-label="Close details">
          <CloseIcon />
        </button>
      </div>

      <div className="chat-detail-body">
        <div className="chat-detail-profile">
          <Avatar name={displayName} size="xl" />
          <div className="chat-detail-name">{displayName}</div>
          {roleLabel && <div className="chat-detail-role">{roleLabel}</div>}
        </div>

        <div className="chat-detail-section">
          <div className="chat-detail-section-label">Conversation</div>
          <div className="chat-detail-row">
            <span className="chat-detail-row-label">Type</span>
            <span className="chat-detail-row-value">
              {conversation.type === "support" ? "Support" : "Direct"}
            </span>
          </div>
          {conversation.topic && (
            <div className="chat-detail-row">
              <span className="chat-detail-row-label">Topic</span>
              <span className="chat-detail-row-value">{conversation.topic}</span>
            </div>
          )}
          <div className="chat-detail-row">
            <span className="chat-detail-row-label">Started</span>
            <span className="chat-detail-row-value">
              {new Date(conversation.createdAt).toLocaleDateString([], {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        <div className="chat-detail-section">
          <div className="chat-detail-section-label">Participants</div>
          {conversation.participants.map((p) => (
            <ParticipantRow key={p.userId} userId={p.userId} currentUserId={currentUserId} />
          ))}
        </div>
      </div>
    </>
  );
}

function ParticipantRow({
  userId,
  currentUserId,
}: {
  userId: string;
  currentUserId: string;
}) {
  const name = useUserName(userId);
  const role = useUserRole(userId);
  return (
    <div className="chat-detail-participant">
      <Avatar name={name} size="sm" />
      <div className="chat-detail-participant-info">
        <span className="chat-detail-participant-name">
          {name}
          {userId === currentUserId && (
            <span className="chat-detail-you-badge">you</span>
          )}
        </span>
        {role && (
          <span className="chat-detail-participant-role">
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </span>
        )}
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

function MessageBubbleWithName({
  message,
  isOwn,
  showAvatar,
  otherId,
}: {
  message: ApiMessage;
  isOwn: boolean;
  showAvatar: boolean;
  otherId: string;
}) {
  const cachedName = useUserName(message.senderId);
  const name = message.senderName || cachedName;
  const seen = isOwn && otherId ? message.readBy.includes(otherId) : false;
  return (
    <MessageBubble
      message={message}
      isOwn={isOwn}
      senderName={name}
      showAvatar={showAvatar}
      seen={seen}
    />
  );
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
  const [detailOpen, setDetailOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 720px)");

  const threadRef = useRef<HTMLDivElement>(null);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didJoin = useRef(false);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    if (threadRef.current) {
      threadRef.current.scrollTo({ top: threadRef.current.scrollHeight, behavior });
    }
  }, []);

  useEffect(() => {
    Promise.all([
      getConversation(conversationId),
      listMessages(conversationId),
    ])
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
  }, [conversationId, currentUserId]);

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

    function handleConversationUpdate(payload: { conversation: ApiConversation }) {
      if (payload.conversation.id !== conversationId) return;
      setConversation(payload.conversation);
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
    socket.on(realtimeEvents.conversationUpdate, handleConversationUpdate);
    socket.on(realtimeEvents.typingUpdate, handleTypingUpdate);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect", handleConnect);

    return () => {
      socket.off(realtimeEvents.messageNew, handleMessageNew);
      socket.off(realtimeEvents.conversationUpdate, handleConversationUpdate);
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
    socket.emit(realtimeEvents.messageSend, { conversationId, body, clientMessageId });
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

  const otherId =
    conversation.participants.find((p) => p.userId !== currentUserId)?.userId ?? "";
  const waitingForAgent = conversation.type === "support" && conversation.status === "escalated";
  const composerDisabled = !connected || waitingForAgent;

  const typingNames = Object.entries(typing)
    .filter(([, isTyping]) => isTyping)
    .map(([id]) => `User …${id.slice(-5)}`);

  return (
    <div className={`chat-area panel-active${detailOpen ? " detail-open" : ""}`}>
      <div className="chat-main">
        <ChatHeaderContent
          conversation={conversation}
          currentUserId={currentUserId}
          onBack={() => router.push("/inbox")}
          onNameClick={() => setDetailOpen((o) => !o)}
          detailOpen={detailOpen}
        />

        {!connected && (
          <div className="connection-banner">
            Reconnecting... Your messages will be delivered when connection is restored.
          </div>
        )}

        {waitingForAgent && (
          <div className="connection-banner connection-banner-waiting">
            Connecting you to a human agent...
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
            const isOwn = msg.senderKind !== "assistant" && msg.senderId === currentUserId;
            const prevSameSender =
              prev?.senderId === msg.senderId && prev?.senderKind === msg.senderKind;

            return (
              <div key={msg.id}>
                {showDivider && (
                  <div className="message-date-divider">{formatDay(msg.createdAt)}</div>
                )}
                <MessageBubbleWithName
                  message={msg}
                  isOwn={isOwn}
                  showAvatar={!isOwn && !prevSameSender}
                  otherId={otherId}
                />
              </div>
            );
          })}

          {typingNames.length > 0 && <TypingIndicator names={typingNames} />}
        </div>

        <ChatComposer
          onSend={handleSend}
          onTyping={handleTyping}
          disabled={composerDisabled}
        />
      </div>

      {detailOpen && !isMobile && (
        <div className="chat-detail-panel">
          <ChatDetailContent
            conversation={conversation}
            currentUserId={currentUserId}
            onClose={() => setDetailOpen(false)}
          />
        </div>
      )}

      <Drawer open={detailOpen && isMobile} onClose={() => setDetailOpen(false)}>
        <ChatDetailContent
          conversation={conversation}
          currentUserId={currentUserId}
          onClose={() => setDetailOpen(false)}
        />
      </Drawer>
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

function CloseIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
