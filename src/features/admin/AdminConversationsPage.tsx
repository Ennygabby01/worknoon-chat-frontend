"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { useRequireRole } from "@/lib/hooks/useRequireRole";
import { adminListConversations } from "@/lib/api/admin";
import type { ApiConversation } from "@/types/api";

const STATUS_LABELS: Record<string, string> = {
  open: "Open",
  escalated: "Escalated",
  assigned: "Assigned",
  resolved: "Resolved"
};

export function AdminConversationsPage() {
  const { session, loading: authLoading } = useRequireRole("admin");
  const [conversations, setConversations] = useState<ApiConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "direct" | "support">("all");

  useEffect(() => {
    if (!session) return;
    adminListConversations({ limit: 100 })
      .then(({ conversations: c }) => setConversations(c))
      .catch(() => setError("Could not load conversations."))
      .finally(() => setLoading(false));
  }, [session]);

  const filtered = typeFilter === "all"
    ? conversations
    : conversations.filter((c) => c.type === typeFilter);

  if (authLoading || loading) return <div className="loading-screen"><Spinner size="lg" /></div>;
  if (error) return <div className="error-banner">{error}</div>;

  return (
    <div className="admin-table-wrap">
      <div className="admin-table-toolbar">
        <div className="admin-filter-tabs">
          {(["all", "direct", "support"] as const).map((t) => (
            <button
              key={t}
              className={`admin-filter-tab${typeFilter === t ? " is-active" : ""}`}
              onClick={() => setTypeFilter(t)}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <span className="admin-table-count">{filtered.length} conversations</span>
      </div>

      <div className="admin-table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Topic</th>
              <th>Status</th>
              <th>Participants</th>
              <th>Last activity</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id}>
                <td><Badge label={c.type} /></td>
                <td className="admin-muted">
                  {c.topic ?? c.productContext?.productName ?? "General"}
                </td>
                <td>
                  <span className={`admin-status-badge admin-status-${c.status ?? "open"}`}>
                    {STATUS_LABELS[c.status ?? "open"]}
                  </span>
                </td>
                <td className="admin-muted">{c.participants.length}</td>
                <td className="admin-muted">
                  {c.lastMessageAt
                    ? new Date(c.lastMessageAt).toLocaleDateString()
                    : new Date(c.updatedAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="empty-state">No conversations found.</div>}
      </div>
    </div>
  );
}
