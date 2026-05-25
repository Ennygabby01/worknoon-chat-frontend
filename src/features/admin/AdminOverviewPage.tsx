"use client";

import {
  MOCK_USERS,
  MOCK_USER_PAGINATION,
  MOCK_CONVERSATION_PAGINATION,
} from "./admin-mock";

export function AdminOverviewPage() {
  const agents = MOCK_USERS.filter((u) => u.role === "agent").length;
  const customers = MOCK_USERS.filter((u) => u.role === "customer").length;

  return (
    <div className="admin-stat-grid">
      <StatCard label="Total users" value={MOCK_USER_PAGINATION.total} />
      <StatCard label="Conversations" value={MOCK_CONVERSATION_PAGINATION.total} />
      <StatCard label="Support agents" value={agents} />
      <StatCard label="Customers" value={customers} />
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="admin-stat-card">
      <div className="admin-stat-value">{value}</div>
      <div className="admin-stat-label">{label}</div>
    </div>
  );
}
