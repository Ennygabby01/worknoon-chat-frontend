import { Avatar } from "@/components/ui/Avatar";
import type { ApiMessage } from "@/types/api";

type MessageBubbleProps = {
  message: ApiMessage;
  isOwn: boolean;
  senderName: string;
  showAvatar: boolean;
};

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function MessageBubble({ message, isOwn, senderName, showAvatar }: MessageBubbleProps) {
  return (
    <div className={`message-row ${isOwn ? "own" : "other"}`}>
      {!isOwn && (
        <div style={{ width: 30, flexShrink: 0 }}>
          {showAvatar && <Avatar name={senderName} size="sm" />}
        </div>
      )}
      <div className="message-bubble">{message.body}</div>
      <span className="message-time">{formatTime(message.createdAt)}</span>
    </div>
  );
}
