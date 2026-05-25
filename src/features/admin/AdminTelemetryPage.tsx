"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/Spinner";
import { useRequireRole } from "@/lib/hooks/useRequireRole";
import { adminListConversations, adminListUsers } from "@/lib/api/admin";

type TelemetryStat = { label: string; value: string | number; sub?: string };

export function AdminTelemetryPage() {
  const { session, loading: authLoading } = useRequireRole("admin");
  const [stats, setStats] = useState<TelemetryStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!session) return;
    Promise.all([
      adminListUsers({ limit: 200 }),
      adminListConversations({ limit: 200 }),
      adminListConversations({ type: "support", limit: 200 })
    ])
      .then(([{ users, pagination: userPage }, { conversations, pagination: convPage }, { conversations: supportConvs }]) => {
        const resolved = supportConvs.filter((c) => c.status === "resolved").length;
        const escalated = supportConvs.filter((c) => c.status === "escalated" || c.status === "assigned").length;
        const activeAgents = users.filter((u) => u.role === "agent" && !u.banned).length;
        const bannedUsers = users.filter((u) => u.banned).length;
        const resolutionRate = supportConvs.length > 0
          ? Math.round((resolved / supportConvs.length) * 100)
          : 0;

        setStats([
          { label: "Total users", value: userPage.total },
          { label: "Active agents", value: activeAgents },
          { label: "Banned accounts", value: bannedUsers },
          { label: "Total conversations", value: convPage.total },
          { label: "Support conversations", value: supportConvs.length },
          { label: "Escalated / in progress", value: escalated },
          { label: "Resolved", value: resolved },
          { label: "Resolution rate", value: `${resolutionRate}%`, sub: "support conversations" }
        ]);
      })
      .catch(() => setError("Could not load telemetry data."))
      .finally(() => setLoading(false));
  }, [session]);

  if (authLoading || loading) return <div className="loading-screen"><Spinner size="lg" /></div>;
  if (error) return <div className="error-banner">{error}</div>;

  return (
    <div className="admin-stat-grid">
      {stats.map((s) => (
        <div key={s.label} className="admin-stat-card">
          <div className="admin-stat-value">{s.value}</div>
          <div className="admin-stat-label">{s.label}</div>
          {s.sub && <div className="admin-stat-sub">{s.sub}</div>}
        </div>
      ))}
    </div>
  );
}
