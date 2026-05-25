"use client";

import { useState, type FormEvent } from "react";

type BotComposerProps = {
  onSubmit: (text: string) => void;
  onDeviation: (text: string) => void;
  expectsText: boolean;
  disabled?: boolean;
};

export function BotComposer({ onSubmit, onDeviation, expectsText, disabled = false }: BotComposerProps) {
  const [value, setValue] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const text = e.target.value;
    setValue(text);
    if (!expectsText && text.length > 0) {
      onDeviation(text);
    }
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSubmit(trimmed);
    setValue("");
  }

  if (!expectsText) return null;

  return (
    <form className="bot-composer" onSubmit={handleSubmit}>
      <div className="bot-composer-inner">
        <input
          className="bot-composer-input"
          type="text"
          placeholder="Type your message..."
          value={value}
          onChange={handleChange}
          disabled={disabled}
          autoFocus
        />
        <button
          type="submit"
          className="bot-composer-send"
          disabled={disabled || !value.trim()}
          aria-label="Send"
        >
          <SendIcon />
        </button>
      </div>
    </form>
  );
}

function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}
