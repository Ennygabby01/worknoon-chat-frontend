"use client";

import { useEffect, useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { listChatContacts } from "@/lib/api/users";
import { useIsOnline } from "@/lib/realtime/online-status-context";
import { Spinner } from "@/components/ui/Spinner";
import type { ApiUser } from "@/types/api";

type AgentHandoffPanelProps = {
  error?: string;
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

export function AgentHandoffPanel({ error }: AgentHandoffPanelProps) {
  const [agents, setAgents] = useState<ApiUser[]>([]);

  useEffect(() => {
    listChatContacts({ role: "agent", limit: 3 })
      .then(({ users }) => setAgents(users))
      .catch(() => setAgents([]));
  }, []);

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

      <div className="handoff-waiting" aria-live="polite">
        <Spinner />
        <span>Waiting for a human agent to take over...</span>
      </div>
    </div>
  );
}
