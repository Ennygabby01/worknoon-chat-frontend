"use client";

import { useEffect, useState } from "react";
import { listAdminConversations } from "@/lib/api/conversations";
import { listUsers } from "@/lib/api/users";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { Avatar } from "@/components/ui/Avatar";
import type { ApiConversation, ApiUser, Pagination } from "@/types/api";

export function AdminDashboard() {
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [userPagination, setUserPagination] = useState<Pagination | null>(null);
  const [conversations, setConversations] = useState<ApiConversation[]>([]);
  const [conversationPagination, setConversationPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([listUsers({ limit: 50 }), listAdminConversations({ limit: 50 })])
      .then(([{ users: u, pagination: userPage }, { conversations: c, pagination: convPage }]) => {
        setUsers(u);
        setUserPagination(userPage);
        setConversations(c);
        setConversationPagination(convPage);
      })
      .catch(() => setError("We could not load admin data."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <div className="error-banner">{error}</div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: 14
        }}
      >
        <StatCard label="Total users" value={userPagination?.total ?? users.length} />
        <StatCard
          label="Conversations"
          value={conversationPagination?.total ?? conversations.length}
        />
        <StatCard label="Admins" value={users.filter((u) => u.role === "admin").length} />
        <StatCard label="Agents" value={users.filter((u) => u.role === "agent").length} />
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--color-border)" }}>
          <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>All users</span>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                    <Avatar name={u.name} src={u.avatarUrl} size="sm" />
                    <span style={{ fontWeight: 500 }}>{u.name}</span>
                  </div>
                </td>
                <td style={{ color: "var(--color-muted)" }}>{u.email}</td>
                <td>
                  <Badge label={u.role} variant="default" />
                </td>
                <td style={{ color: "var(--color-muted)" }}>
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && <div className="empty-state">No users found.</div>}
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--color-border)" }}>
          <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>Recent conversations</span>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Participants</th>
              <th>Topic</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            {conversations.map((conversation) => (
              <tr key={conversation.id}>
                <td>
                  <Badge label={conversation.type} variant="default" />
                </td>
                <td>{conversation.participants.length}</td>
                <td style={{ color: "var(--color-muted)" }}>
                  {conversation.topic ?? conversation.productContext?.productName ?? "General"}
                </td>
                <td style={{ color: "var(--color-muted)" }}>
                  {new Date(conversation.updatedAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {conversations.length === 0 && <div className="empty-state">No conversations found.</div>}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="card" style={{ padding: "18px 20px" }}>
      <div style={{ fontSize: "1.6rem", fontWeight: 800, letterSpacing: "-0.03em" }}>
        {value}
      </div>
      <div style={{ fontSize: "0.8rem", color: "var(--color-muted)", marginTop: 3 }}>
        {label}
      </div>
    </div>
  );
}
