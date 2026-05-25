import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import type { ApiConversation } from "@/types/api";

type PresenceStatus = "online" | "away" | "offline";

type ConversationRowProps = {
  conversation: ApiConversation;
  currentUserId: string;
  isActive: boolean;
  otherName: string;
  isTyping?: boolean;
  presence?: PresenceStatus;
};

function formatRelativeTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "now";
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

function isUnread(conversation: ApiConversation, userId: string): boolean {
  if (!conversation.lastMessageAt) return false;
  const me = conversation.participants.find((p) => p.userId === userId);
  if (!me) return false;
  if (!me.readAt) return true;
  return new Date(me.readAt) < new Date(conversation.lastMessageAt);
}

function displayName(conversation: ApiConversation, otherName: string): string {
  if (conversation.topic) return conversation.topic;
  if (conversation.type === "support") return "Support request";
  return otherName;
}


export function ConversationRow({
  conversation,
  currentUserId,
  isActive,
  otherName,
  isTyping = false,
  presence = "offline",
}: ConversationRowProps) {
  const unread = isUnread(conversation, currentUserId);
  const name = displayName(conversation, otherName);
  const timestamp = conversation.lastMessageAt ?? conversation.createdAt;

  return (
    <Link
      href={`/inbox/${conversation.id}`}
      className={`conversation-row${isActive ? " is-active" : ""}${unread ? " is-unread" : ""}`}
    >
      <div className="avatar-wrap">
        <Avatar name={name} size="md" />
        {presence !== "offline" && (
          <span className={`online-dot online-dot--${presence}`} aria-label={presence} />
        )}
      </div>

      <div className="conversation-row-body">
        <div className="conversation-row-header">
          <span className="conversation-row-name">{name}</span>
          <span className="conversation-row-time">{formatRelativeTime(timestamp)}</span>
        </div>

        <div className="conversation-row-preview">
          {isTyping ? (
            <span className="conversation-row-typing">Typing...</span>
          ) : (
            <span className="conversation-row-preview-text">
              {conversation.lastMessageBody ??
                (conversation.type === "support" ? "Support chat" : "No messages yet")}
            </span>
          )}
          {unread && <span className="unread-badge" aria-label="Unread" />}
        </div>
      </div>
    </Link>
  );
}
