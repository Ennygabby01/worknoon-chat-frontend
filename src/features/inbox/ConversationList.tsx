"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { listConversations } from "@/lib/api/conversations";
import { getSocket } from "@/lib/realtime/socket";
import { realtimeEvents } from "@/lib/realtime/events";
import { useSession } from "@/lib/session/session-context";
import { useUserName } from "@/lib/users/user-cache-context";
import { ConversationRow } from "./ConversationRow";
import { Spinner } from "@/components/ui/Spinner";
import type { ApiConversation, ApiMessage } from "@/types/api";

type ConversationListInnerProps = {
  conversations: ApiConversation[];
  currentUserId: string;
  activePath: string;
};

function ConversationListInner({
  conversations,
  currentUserId,
  activePath
}: ConversationListInnerProps) {
  return (
    <>
      {conversations.map((conv) => {
        const otherId =
          conv.participants.find((p) => p.userId !== currentUserId)?.userId ?? currentUserId;
        return (
          <ConversationRowWithName
            key={conv.id}
            conversation={conv}
            currentUserId={currentUserId}
            isActive={activePath === `/inbox/${conv.id}`}
            otherId={otherId}
          />
        );
      })}
    </>
  );
}

function ConversationRowWithName({
  conversation,
  currentUserId,
  isActive,
  otherId
}: {
  conversation: ApiConversation;
  currentUserId: string;
  isActive: boolean;
  otherId: string;
}) {
  const name = useUserName(otherId);
  return (
    <ConversationRow
      conversation={conversation}
      currentUserId={currentUserId}
      isActive={isActive}
      otherName={name}
    />
  );
}

export function ConversationList() {
  const { session } = useSession();
  const pathname = usePathname();
  const [conversations, setConversations] = useState<ApiConversation[]>([]);
  const [loading, setLoading] = useState(true);
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
  }, []);

  useEffect(() => {
    const socket = getSocket();

    function handleMessageNew(payload: { message: ApiMessage }) {
      const { message } = payload;
      setConversations((prev) => {
        const idx = prev.findIndex((c) => c.id === message.conversationId);
        if (idx === -1) return prev;
        const updated = { ...prev[idx], lastMessageAt: message.createdAt };
        const rest = prev.filter((_, i) => i !== idx);
        return [updated, ...rest];
      });
    }

    socket.on(realtimeEvents.messageNew, handleMessageNew);
    return () => {
      socket.off(realtimeEvents.messageNew, handleMessageNew);
    };
  }, []);

  if (loading) {
    return (
      <div className="loading-screen" style={{ padding: 32 }}>
        <Spinner />
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="empty-state">
        <span>No conversations yet.</span>
      </div>
    );
  }

  return (
    <ConversationListInner
      conversations={conversations}
      currentUserId={currentUserId}
      activePath={pathname}
    />
  );
}
