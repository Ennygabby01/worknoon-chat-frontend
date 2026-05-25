"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/Button";
import { useRequireRole } from "@/lib/hooks/useRequireRole";
import { getAgentQueue, claimConversation } from "@/lib/api/agent";
import type { ApiConversation } from "@/types/api";
import type { AppError } from "@/lib/api/app-error";

export function AgentQueuePage() {
  const { session, loading: authLoading } = useRequireRole("agent");
  const router = useRouter();
  const [queue, setQueue] = useState<ApiConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [claiming, setClaiming] = useState<string | null>(null);
  const [claimError, setClaimError] = useState<string | null>(null);

  useEffect(() => {
    if (!session) return;
    getAgentQueue()
      .then(setQueue)
      .catch(() => setError("Could not load queue."))
      .finally(() => setLoading(false));
  }, [session]);

  async function handleClaim(conv: ApiConversation) {
    setClaimError(null);
    setClaiming(conv.id);
    try {
      await claimConversation(conv.id);
      setQueue((prev) => prev.filter((c) => c.id !== conv.id));
      router.push(`/inbox/${conv.id}`);
    } catch (err) {
      setClaimError((err as AppError).message ?? "Already claimed by another agent.");
    } finally {
      setClaiming(null);
    }
  }

  if (authLoading || loading) return <div className="loading-screen"><Spinner size="lg" /></div>;
  if (error) return <div className="error-banner">{error}</div>;

  return (
    <div className="agent-queue">
      {claimError && <div className="error-banner">{claimError}</div>}

      {queue.length === 0 ? (
        <div className="empty-state">No conversations in the queue right now.</div>
      ) : (
        <div className="agent-queue-list">
          {queue.map((conv) => (
            <div key={conv.id} className="agent-queue-card">
              <div className="agent-queue-card-body">
                <div className="agent-queue-topic">
                  {conv.topic ?? conv.productContext?.productName ?? "Support request"}
                </div>
                <div className="agent-queue-meta">
                  {conv.participants.length} participants &middot; escalated{" "}
                  {formatRelative(conv.updatedAt)}
                </div>
                {conv.lastMessageBody && (
                  <div className="agent-queue-preview">{conv.lastMessageBody}</div>
                )}
              </div>
              <Button
                loading={claiming === conv.id}
                onClick={() => void handleClaim(conv)}
              >
                Take conversation
              </Button>
            </div>
          ))}
        </div>
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
