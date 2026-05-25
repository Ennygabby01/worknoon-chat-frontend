"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/Button";
import { useRequireRole } from "@/lib/hooks/useRequireRole";
import { getAgentCases, resolveConversation } from "@/lib/api/agent";
import type { ApiConversation } from "@/types/api";


export function AgentCasesPage() {
  const { session, loading: authLoading } = useRequireRole("agent");
  const router = useRouter();
  const [cases, setCases] = useState<ApiConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [resolving, setResolving] = useState<string | null>(null);

  useEffect(() => {
    if (!session) return;
    getAgentCases()
      .then(setCases)
      .catch(() => setError("Could not load your cases."))
      .finally(() => setLoading(false));
  }, [session]);

  async function handleResolve(convId: string) {
    setResolving(convId);
    try {
      const updated = await resolveConversation(convId);
      setCases((prev) => prev.map((c) => (c.id === convId ? updated : c)));
    } finally {
      setResolving(null);
    }
  }

  if (authLoading || loading) return <div className="loading-screen"><Spinner size="lg" /></div>;
  if (error) return <div className="error-banner">{error}</div>;

  const active = cases.filter((c) => c.status === "assigned");
  const resolved = cases.filter((c) => c.status === "resolved");

  return (
    <div className="agent-queue">
      {cases.length === 0 ? (
        <div className="empty-state">You have no assigned cases yet.</div>
      ) : (
        <>
          {active.length > 0 && (
            <div className="agent-cases-section">
              <h2 className="agent-cases-heading">Active ({active.length})</h2>
              <div className="agent-queue-list">
                {active.map((conv) => (
                  <div key={conv.id} className="agent-queue-card">
                    <div className="agent-queue-card-body">
                      <div className="agent-queue-topic">
                        {conv.topic ?? conv.productContext?.productName ?? "Support request"}
                      </div>
                      <div className="agent-queue-meta">
                        {conv.participants.length} participants &middot; claimed{" "}
                        {formatRelative(conv.updatedAt)}
                      </div>
                      {conv.lastMessageBody && (
                        <div className="agent-queue-preview">{conv.lastMessageBody}</div>
                      )}
                    </div>
                    <div className="agent-case-actions">
                      <Button variant="ghost" onClick={() => router.push(`/inbox/${conv.id}`)}>
                        Open chat
                      </Button>
                      <Button
                        variant="secondary"
                        loading={resolving === conv.id}
                        onClick={() => void handleResolve(conv.id)}
                      >
                        Mark resolved
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {resolved.length > 0 && (
            <div className="agent-cases-section">
              <h2 className="agent-cases-heading">Resolved ({resolved.length})</h2>
              <div className="agent-queue-list">
                {resolved.map((conv) => (
                  <div key={conv.id} className="agent-queue-card agent-queue-card-resolved">
                    <div className="agent-queue-card-body">
                      <div className="agent-queue-topic">
                        {conv.topic ?? conv.productContext?.productName ?? "Support request"}
                      </div>
                      <div className="agent-queue-meta">
                        {conv.participants.length} participants
                      </div>
                    </div>
                    <span className="admin-badge-resolved">Resolved</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}
