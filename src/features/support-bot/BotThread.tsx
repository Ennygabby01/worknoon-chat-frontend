import { useEffect, useRef } from "react";
import { TypingIndicator } from "@/features/chat/TypingIndicator";
import { BotMessage } from "./BotMessage";
import type { BotHistoryItem } from "./support-bot-types";

type BotThreadProps = {
  history: BotHistoryItem[];
  botTyping: boolean;
};

export function BotThread({ history, botTyping }: BotThreadProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, botTyping]);

  return (
    <div className="message-thread">
      {history.map((item, idx) => (
        <BotMessage key={idx} item={item} />
      ))}
      {botTyping && <TypingIndicator names={["Worknoon Support"]} />}
      <div ref={bottomRef} />
    </div>
  );
}
