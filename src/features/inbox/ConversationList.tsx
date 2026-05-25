"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { listConversations } from "@/lib/api/conversations";
import { getSocket } from "@/lib/realtime/socket";
import { realtimeEvents } from "@/lib/realtime/events";
import { useSession } from "@/lib/session/session-context";
import { useUserName } from "@/lib/users/user-cache-context";
import { usePresence } from "@/lib/realtime/online-status-context";
import { ConversationRow } from "./ConversationRow";
import { Spinner } from "@/components/ui/Spinner";
import type { ApiConversation, ApiMessage } from "@/types/api";

type ConversationListInnerProps = {
  conversations: ApiConversation[];
  currentUserId: string;
  activePath: string;
  typingConvs: Set<string>;
};

function ConversationListInner({
  conversations,
  currentUserId,
  activePath,
  typingConvs,
}: ConversationListInnerProps) {
  return (
    <>
      {conversations.map((conv) => {
        const otherId =
          conv.participants.find((p) => p.userId !== currentUserId)?.userId ?? currentUserId;
        return (
          <ConversationRowWithMeta
            key={conv.id}
            conversation={conv}
            currentUserId={currentUserId}
            isActive={activePath === `/inbox/${conv.id}`}
            otherId={otherId}
            isTyping={typingConvs.has(conv.id)}
          />
        );
      })}
    </>
  );
}

function ConversationRowWithMeta({
  conversation,
  currentUserId,
  isActive,
  otherId,
  isTyping,
}: {
  conversation: ApiConversation;
  currentUserId: string;
  isActive: boolean;
  otherId: string;
  isTyping: boolean;
}) {
  const name = useUserName(otherId);
  const presence = usePresence(otherId);
  return (
    <ConversationRow
      conversation={conversation}
      currentUserId={currentUserId}
      isActive={isActive}
      otherName={name}
      isTyping={isTyping}
      presence={presence}
    />
  );
}

export type ConversationSort = "newest" | "oldest";
export type ConversationFilter = "all" | "open" | "escalated" | "assigned" | "resolved";

export function ConversationList({
  search = "",
  sort = "newest",
  filter = "all",
}: {
  search?: string;
  sort?: ConversationSort;
  filter?: ConversationFilter;
}) {
  const { session } = useSession();
  const pathname = usePathname();
  const [conversations, setConversations] = useState<ApiConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [typingConvs, setTypingConvs] = useState<Set<string>>(new Set());
  const joinedRooms = useRef<Set<string>>(new Set());

  const currentUserId = session!.user.id;

  useEffect(() => {
    listConversations()
      .then((list) => {
        setConversations(list);

        const socket = getSocket();
        for (const conv of list) {
          if (!joinedRooms.current.has(conv.id)) {
            socket.emit(realtimeEvents.conversationJoin, { conversationId: conv.id });
            joinedRooms.current.add(conv.id);
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [currentUserId]);

  useEffect(() => {
    const socket = getSocket();

    function handleMessageNew(payload: { message: ApiMessage }) {
      const { message } = payload;
      setConversations((prev) => {
        const idx = prev.findIndex((c) => c.id === message.conversationId);
        if (idx === -1) return prev;
        const updated = { ...prev[idx], lastMessageAt: message.createdAt, lastMessageBody: message.body };
        const rest = prev.filter((_, i) => i !== idx);
        return [updated, ...rest];
      });
    }

    function handleTypingUpdate(payload: {
      conversationId: string;
      userId: string;
      isTyping: boolean;
    }) {
      if (payload.userId === currentUserId) return;
      setTypingConvs((prev) => {
        const next = new Set(prev);
        if (payload.isTyping) {
          next.add(payload.conversationId);
        } else {
          next.delete(payload.conversationId);
        }
        return next;
      });
    }

    socket.on(realtimeEvents.messageNew, handleMessageNew);
    socket.on(realtimeEvents.typingUpdate, handleTypingUpdate);
    return () => {
      socket.off(realtimeEvents.messageNew, handleMessageNew);
      socket.off(realtimeEvents.typingUpdate, handleTypingUpdate);
    };
  }, [currentUserId]);

  if (loading) {
    return (
      <div className="loading-screen" style={{ padding: 32 }}>
        <Spinner />
      </div>
    );
  }

  const normalizedSearch = search.trim().toLowerCase();

  let visibleConversations = normalizedSearch
    ? conversations.filter((conversation) => {
        const haystack = [
          conversation.topic,
          conversation.productContext?.productName,
          conversation.lastMessageBody,
          conversation.type,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return haystack.includes(normalizedSearch);
      })
    : [...conversations];

  if (filter !== "all") {
    visibleConversations = visibleConversations.filter((c) => c.status === filter);
  }

  visibleConversations.sort((a, b) => {
    const ta = new Date(a.lastMessageAt ?? a.createdAt).getTime();
    const tb = new Date(b.lastMessageAt ?? b.createdAt).getTime();
    return sort === "newest" ? tb - ta : ta - tb;
  });

  if (conversations.length === 0) {
    return (
      <div className="empty-state">
        <span>No chats yet.</span>
      </div>
    );
  }

  if (visibleConversations.length === 0) {
    return (
      <div className="empty-state">
        <span>No chats match your search.</span>
      </div>
    );
  }

  return (
    <ConversationListInner
      conversations={visibleConversations}
      currentUserId={currentUserId}
      activePath={pathname}
      typingConvs={typingConvs}
    />
  );
}
