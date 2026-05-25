"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/Spinner";
import { adminListConversations, adminListUsers } from "@/lib/api/admin";

type DashData = {
  totalUsers: number;
  customers: number;
  designers: number;
  merchants: number;
  activeAgents: number;
  bannedUsers: number;
  totalConversations: number;
  directCount: number;
  supportCount: number;
  open: number;
  escalated: number;
  assigned: number;
  resolved: number;
};

type DonutSegment = { label: string; value: number; color: string };

function DonutChart({ segments, centerLabel }: { segments: DonutSegment[]; centerLabel: string }) {
  const r = 34;
  const circ = 2 * Math.PI * r;
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  const nonEmpty = total > 0;

  let cum = 0;
  const arcs = segments.map((seg) => {
    const arcLen = nonEmpty ? (seg.value / total) * circ : 0;
    const offset = -cum;
    cum += arcLen;
    return { ...seg, arcLen, offset };
  });

  return (
    <div className="adash-donut">
      <div className="adash-donut-ring">
        <svg viewBox="0 0 100 100" aria-hidden="true">
          <g transform="rotate(-90 50 50)">
            <circle cx="50" cy="50" r={r} fill="none" stroke="#f1f4f8" strokeWidth="13" />
            {nonEmpty && arcs.map((arc) => (
              <circle
                key={arc.label}
                cx="50"
                cy="50"
                r={r}
                fill="none"
                stroke={arc.color}
                strokeWidth="13"
                strokeDasharray={`${arc.arcLen} ${circ}`}
                strokeDashoffset={arc.offset}
                strokeLinecap="butt"
              />
            ))}
          </g>
          <text
            x="50"
            y="46"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="18"
            fontWeight="700"
            fill="#111827"
            fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
          >
            {total}
          </text>
          <text
            x="50"
            y="60"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="8"
            fill="#9ca3af"
            fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
          >
            {centerLabel}
          </text>
        </svg>
      </div>
      <div className="adash-donut-legend">
        {segments.map((seg) => (
          <div key={seg.label} className="adash-legend-item">
            <span className="adash-legend-dot" style={{ background: seg.color }} />
            <span className="adash-legend-label">{seg.label}</span>
            <span className="adash-legend-val">{seg.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  accent,
  icon,
}: {
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="adash-stat-card">
      {accent && <span className="adash-stat-accent" style={{ background: accent }} />}
      {icon && <div className="adash-bg-icon" aria-hidden>{icon}</div>}
      <div className="adash-stat-value">{value}</div>
      <div className="adash-stat-label">{label}</div>
      {sub && <div className="adash-stat-sub">{sub}</div>}
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="adash-mini-stat">
      <span className="adash-mini-val">{value}</span>
      <span className="adash-mini-label">{label}</span>
    </div>
  );
}

export function AdminOverviewPage() {
  const [data, setData] = useState<DashData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      adminListUsers({ role: "customer", limit: 1 }),
      adminListUsers({ role: "designer", limit: 1 }),
      adminListUsers({ role: "merchant", limit: 1 }),
      adminListUsers({ role: "agent", limit: 1 }),
      adminListUsers({ limit: 200 }),
      adminListConversations({ limit: 1 }),
      adminListConversations({ type: "support", limit: 200 }),
    ])
      .then(([custRes, desRes, merRes, agentRes, usersDetail, allConvRes, supportRes]) => {
        const supportConvs = supportRes.conversations;
        const supportCount = supportRes.pagination.total;
        const totalConvs = allConvRes.pagination.total;
        const customers = custRes.pagination.total;
        const designers = desRes.pagination.total;
        const merchants = merRes.pagination.total;

        setData({
          totalUsers: customers + designers + merchants,
          customers,
          designers,
          merchants,
          activeAgents: agentRes.pagination.total,
          bannedUsers: usersDetail.users.filter((u) => u.banned).length,
          totalConversations: totalConvs,
          directCount: totalConvs - supportCount,
          supportCount,
          open: supportConvs.filter((c) => c.status === "open").length,
          escalated: supportConvs.filter((c) => c.status === "escalated").length,
          assigned: supportConvs.filter((c) => c.status === "assigned").length,
          resolved: supportConvs.filter((c) => c.status === "resolved").length,
        });
      })
      .catch(() => setError("Could not load dashboard data."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-screen"><Spinner size="lg" /></div>;
  if (error) return <div className="error-banner">{error}</div>;
  if (!data) return null;

  const resolutionRate = data.supportCount > 0
    ? Math.round((data.resolved / data.supportCount) * 100)
    : 0;

  const convTypeSegments: DonutSegment[] = [
    { label: "Direct", value: data.directCount, color: "#0f766e" },
    { label: "Support", value: data.supportCount, color: "#6366f1" },
  ];

  const supportStatusSegments: DonutSegment[] = [
    { label: "Open", value: data.open, color: "#0f766e" },
    { label: "Assigned", value: data.assigned, color: "#2563eb" },
    { label: "Escalated", value: data.escalated, color: "#d97706" },
    { label: "Resolved", value: data.resolved, color: "#9ca3af" },
  ];

  return (
    <div className="adash">
      <div className="adash-stat-strip">
        <StatCard
          label="Total users"
          value={data.totalUsers}
          sub={`${data.customers ?? 0} customers · ${data.designers ?? 0} designers · ${data.merchants ?? 0} merchants`}
          accent="#0f766e"
          icon={<UsersIcon />}
        />
        <StatCard
          label="Active agents"
          value={data.activeAgents}
          accent="#6366f1"
          icon={<AgentIcon />}
        />
        <StatCard
          label="Conversations"
          value={data.totalConversations}
          sub={`${data.directCount ?? 0} direct · ${data.supportCount ?? 0} support`}
          accent="#2563eb"
          icon={<ChatIcon />}
        />
        <StatCard
          label="Resolution rate"
          value={`${resolutionRate}%`}
          sub="support cases"
          accent="#15803d"
          icon={<CheckRingIcon />}
        />
      </div>

      <div className="adash-chart-row">
        <div className="adash-chart-card">
          <div className="adash-chart-head">
            <span className="adash-chart-title">Conversation types</span>
          </div>
          <DonutChart segments={convTypeSegments} centerLabel="total" />
        </div>

        <div className="adash-chart-card">
          <div className="adash-chart-head">
            <span className="adash-chart-title">Support case status</span>
          </div>
          <DonutChart segments={supportStatusSegments} centerLabel="support" />
        </div>
      </div>

      <div className="adash-mini-row">
        <MiniStat label="Escalated cases" value={data.escalated} />
        <MiniStat label="Resolved cases" value={data.resolved} />
        <MiniStat label="Banned accounts" value={data.bannedUsers} />
      </div>
    </div>
  );
}

function UsersIcon() {
  return (
    <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function AgentIcon() {
  return (
    <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function CheckRingIcon() {
  return (
    <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
