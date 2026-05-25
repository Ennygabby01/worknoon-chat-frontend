"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { listChatContacts } from "@/lib/api/users";
import { useIsOnline } from "@/lib/realtime/online-status-context";
import type { ApiUser } from "@/types/api";

type AgentHandoffPanelProps = {
  onSend: (message: string) => Promise<void>;
};

function AgentPileItem({ name, userId }: { name: string; userId: string }) {
  const online = useIsOnline(userId);
  return (
    <div className="handoff-pile-item">
      <Avatar name={name} size="md" />
      {online && <span className="online-dot online-dot--online" aria-label="Online" />}
    </div>
  );
}

export function AgentHandoffPanel({ onSend }: AgentHandoffPanelProps) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [agents, setAgents] = useState<ApiUser[]>([]);

  useEffect(() => {
    listChatContacts({ role: "agent", limit: 3 })
      .then(({ users }) => setAgents(users))
      .catch(() => setAgents([]));
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed || sending) return;
    setSending(true);
    setError("");
    try {
      await onSend(trimmed);
    } catch {
      setError("We could not connect you. Please try again.");
      setSending(false);
    }
  }

  return (
    <div className="handoff-panel">
      <div className="handoff-agents">
        <div className="handoff-pile">
          {agents.map((agent) => (
            <AgentPileItem key={agent.id} name={agent.name} userId={agent.id} />
          ))}
        </div>
        <div className="handoff-agent-info">
          <span className="handoff-title">Connecting you with support</span>
          <span className="handoff-status">
            Our support team typically responds within a few minutes.
          </span>
        </div>
      </div>

      {error && <div className="error-banner" style={{ margin: "0 0 12px" }}>{error}</div>}

      <form className="handoff-form" onSubmit={handleSubmit}>
        <textarea
          className="handoff-textarea"
          placeholder="Describe your issue to get started..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          disabled={sending}
        />
        <button
          type="submit"
          className="handoff-submit"
          disabled={sending || !message.trim()}
        >
          {sending ? "Connecting..." : "Send and connect"}
        </button>
      </form>
    </div>
  );
}
