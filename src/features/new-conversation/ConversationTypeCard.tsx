import type { ReactNode } from "react";

type ConversationTypeCardProps = {
  icon: ReactNode;
  label: string;
  description: string;
  onClick: () => void;
};

export function ConversationTypeCard({ icon, label, description, onClick }: ConversationTypeCardProps) {
  return (
    <button type="button" className="nc-type-card" onClick={onClick}>
      <div className="nc-type-card-icon">{icon}</div>
      <span className="nc-type-card-label">{label}</span>
      <span className="nc-type-card-desc">{description}</span>
    </button>
  );
}
