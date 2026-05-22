type BrandPanelProps = {
  quote?: string;
};

export function BrandPanel({ quote }: BrandPanelProps) {
  return (
    <div className="auth-brand-panel">
      <div className="brand-glow" />
      <div className="brand-ring" />

      <div className="brand-logo-row">
        <div className="brand-logo-mark">
          <BubbleIcon />
        </div>
        <span className="brand-logo-text">Worknoon</span>
      </div>

      <div className="brand-center">
        <div className="brand-chat-illustration">
          <div className="chat-bubble-a" />
          <div className="chat-bubble-b" />
        </div>
        <h2 className="brand-tagline">
          {quote ?? "Commerce conversations, simplified."}
        </h2>
        <p className="brand-sub">
          Connect buyers, designers, merchants, and agents in one seamless platform.
        </p>
      </div>

      <ul className="brand-features">
        {["Real-time", "Multi-role", "eCommerce"].map(
          (feature) => (
            <li key={feature} className="brand-feature">
              <span className="brand-feature-check">
                <CheckIcon />
              </span>
              {feature}
            </li>
          )
        )}
      </ul>
    </div>
  );
}

function BubbleIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
