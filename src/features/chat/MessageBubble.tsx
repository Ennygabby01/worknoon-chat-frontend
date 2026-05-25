import { Avatar } from "@/components/ui/Avatar";
import type { ApiMessage } from "@/types/api";

type MessageBubbleProps = {
  message: ApiMessage;
  isOwn: boolean;
  senderName: string;
  showAvatar: boolean;
  seen?: boolean;
};

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function MessageBubble({ message, isOwn, senderName, showAvatar, seen }: MessageBubbleProps) {
  return (
    <div className={`message-row ${isOwn ? "own" : "other"}${showAvatar ? " new-sender" : ""}`}>
      {!isOwn && (
        <div style={{ width: 30, flexShrink: 0 }}>
          {showAvatar && <Avatar name={senderName} size="sm" />}
        </div>
      )}
      <div className="message-content">
        <div className="message-bubble">
          <span className="bubble-body">{message.body}</span>
          <span className="bubble-time">{formatTime(message.createdAt)}</span>
        </div>
        {isOwn && seen && <span className="message-seen">Seen</span>}
      </div>
    </div>
  );
}
