import { Avatar } from "@/components/ui/Avatar";

type TypingIndicatorProps = {
  names: string[];
};

export function TypingIndicator({ names }: TypingIndicatorProps) {
  if (names.length === 0) return null;

  const label =
    names.length === 1
      ? `${names[0]} is typing`
      : `${names.slice(0, 2).join(", ")} are typing`;

  return (
    <div className="typing-row" aria-label={label}>
      <div style={{ width: 30, flexShrink: 0 }}>
        <Avatar name={names[0]} size="sm" />
      </div>
      <div className="typing-bubble">
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="typing-dot" />
      </div>
    </div>
  );
}
