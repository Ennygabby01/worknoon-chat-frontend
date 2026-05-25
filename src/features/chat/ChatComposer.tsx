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
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf,.doc,.docx,.txt"
        className="composer-file-input"
        aria-label="Attach file"
        tabIndex={-1}
      />

      <div className="composer-input-wrap">
        <button
          className="composer-attach"
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          aria-label="Attach file"
        >
          <AttachIcon />
        </button>

        <textarea
          ref={textareaRef}
          className="composer-textarea"
          placeholder="Write a message..."
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
    </div>
  );
}

function AttachIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66L9.42 16.41a2 2 0 01-2.83-2.83l8.49-8.48" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg
      width="15"
      height="15"
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
