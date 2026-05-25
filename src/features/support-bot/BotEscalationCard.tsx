type BotEscalationCardProps = {
  onConnect: () => void;
  onMarketplace: () => void;
};

export function BotEscalationCard({ onConnect, onMarketplace }: BotEscalationCardProps) {
  return (
    <div className="bot-escalation">
      <div className="bot-escalation-icon" aria-hidden="true">
        <AlertIcon />
      </div>
      <p className="bot-escalation-text">
        It looks like you started typing. Would you like to connect with a human support agent, or browse the marketplace instead?
      </p>
      <div className="bot-escalation-actions">
        <button type="button" className="bot-escalation-btn bot-escalation-btn--primary" onClick={onConnect}>
          Connect me to an agent
        </button>
        <button type="button" className="bot-escalation-btn bot-escalation-btn--ghost" onClick={onMarketplace}>
          Go to marketplace
        </button>
      </div>
    </div>
  );
}

function AlertIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
