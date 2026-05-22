"use client";

import { useRef, useState, type KeyboardEvent } from "react";

type ChatComposerProps = {
  onSend: (body: string) => Promise<void>;
  onTyping?: () => void;
  disabled?: boolean;
};

export function ChatComposer({ onSend, onTyping, disabled }: ChatComposerProps) {
  const [value, setValue] = useState("");
  const [sending, setSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function autoResize() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }

  async function submit() {
    const body = value.trim();
    if (!body || sending || disabled) return;
    setSending(true);
    try {
      await onSend(body);
      setValue("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    } finally {
      setSending(false);
      textareaRef.current?.focus();
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void submit();
    }
  }

  const canSend = value.trim().length > 0 && !sending && !disabled;

  return (
    <div className="chat-composer">
      <textarea
        ref={textareaRef}
        className="composer-textarea"
        placeholder="Type a message… (Enter to send)"
        value={value}
        rows={1}
        onChange={(e) => {
          setValue(e.target.value);
          autoResize();
          onTyping?.();
        }}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-label="Message input"
      />
      <button
        className="composer-send"
        onClick={() => void submit()}
        disabled={!canSend}
        aria-label="Send message"
      >
        <SendIcon />
      </button>
    </div>
  );
}

function SendIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}
