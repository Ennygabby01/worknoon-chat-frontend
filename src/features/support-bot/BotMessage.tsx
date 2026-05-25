import { Avatar } from "@/components/ui/Avatar";
import type { BotHistoryItem } from "./support-bot-types";

type BotMessageProps = {
  item: BotHistoryItem;
};

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function BotMessage({ item }: BotMessageProps) {
  if (item.role === "bot") {
    return (
      <div className="message-row other new-sender">
        <div style={{ width: 30, flexShrink: 0 }}>
          <Avatar name="Worknoon Support" size="sm" />
        </div>
        <div className="message-content">
          <div className="message-bubble">
            <span className="bubble-body">{item.text}</span>
            <span className="bubble-time">{formatTime(item.timestamp)}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="message-row own">
      <div className="message-content">
        <div className="message-bubble">
          <span className="bubble-body">{item.text}</span>
          <span className="bubble-time">{formatTime(item.timestamp)}</span>
        </div>
      </div>
    </div>
  );
}
