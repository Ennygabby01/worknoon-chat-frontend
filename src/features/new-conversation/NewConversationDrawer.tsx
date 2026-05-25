"use client";

import { createPortal } from "react-dom";
import { ConversationTypeCard } from "./ConversationTypeCard";

export type ConversationEntry = "support" | "browse-designer" | "browse-merchant";

type NewConversationDrawerProps = {
  open: boolean;
  onClose: () => void;
  onSelect: (entry: ConversationEntry) => void;
};

export function NewConversationDrawer({ open, onClose, onSelect }: NewConversationDrawerProps) {
  if (!open) return null;

  function select(entry: ConversationEntry) {
    onClose();
    onSelect(entry);
  }

  return createPortal(
    <div className="nc-backdrop" role="presentation" onMouseDown={onClose}>
      <div
        className="nc-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="nc-sheet-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="nc-sheet-handle" aria-hidden="true" />

        <div className="nc-sheet-header">
          <h3 className="nc-sheet-title" id="nc-sheet-title">Start a conversation</h3>
          <button className="nc-sheet-close" type="button" onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>
        </div>

        <div className="nc-type-grid">
          <ConversationTypeCard
            icon={<SupportIcon />}
            label="Support"
            description="Talk to our support team or assistant"
            onClick={() => select("support")}
          />
          <ConversationTypeCard
            icon={<DesignerIcon />}
            label="Designer"
            description="Message a designer about your project"
            onClick={() => select("browse-designer")}
          />
          <ConversationTypeCard
            icon={<MerchantIcon />}
            label="Merchant"
            description="Contact a merchant about a product"
            onClick={() => select("browse-merchant")}
          />
        </div>
      </div>
    </div>,
    document.body
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function SupportIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <line x1="9" y1="10" x2="15" y2="10" />
      <line x1="12" y1="7" x2="12" y2="13" />
    </svg>
  );
}

function DesignerIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="3" />
      <line x1="12" y1="2" x2="12" y2="9" />
      <line x1="12" y1="15" x2="12" y2="22" />
      <line x1="2" y1="12" x2="9" y2="12" />
      <line x1="15" y1="12" x2="22" y2="12" />
    </svg>
  );
}

function MerchantIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}
