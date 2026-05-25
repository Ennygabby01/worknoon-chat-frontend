"use client";

import { useEffect, useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SearchIcon } from "@/components/ui/SearchIcon";
import { Spinner } from "@/components/ui/Spinner";
import { useRequireRole } from "@/lib/hooks/useRequireRole";
import { adminListUsers, adminUpdateUser } from "@/lib/api/admin";
import { apiRequest } from "@/lib/api/client";
import type { ApiUser } from "@/types/api";
import type { AppError } from "@/lib/api/app-error";

const PAGE_SIZE = 20;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function ChevronIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AgentAccordionItem({
  agent,
  open,
  onToggle,
  onDeactivateToggle,
}: {
  agent: ApiUser;
  open: boolean;
  onToggle: () => void;
  onDeactivateToggle: () => void;
}) {
  return (
    <div className={`oac-item${open ? " is-open" : ""}${agent.banned ? " admin-row-banned" : ""}`}>
      <button className="oac-trigger" onClick={onToggle}>
        <div className="oac-trigger-left">
          <Avatar name={agent.name} src={agent.avatarUrl} size="sm" />
          <div className="oac-trigger-info">
            <span className="oac-product">{agent.name}</span>
            <span className="admin-muted" style={{ fontSize: "0.78rem" }}>{agent.email}</span>
          </div>
        </div>
        <div className="oac-trigger-right">
          {agent.banned
            ? <span className="admin-badge-banned">Deactivated</span>
            : <span className="admin-badge-active">Active</span>
          }
          <ChevronIcon />
        </div>
      </button>

      <div className="oac-body-wrap">
        <div className="oac-body-inner">
          <div className="oac-body">
            <div className="oac-row">
              <span className="oac-label">Joined</span>
              <span className="admin-muted">{formatDate(agent.createdAt)}</span>
            </div>
            <div className="oac-row">
              <button
                className={`admin-action-btn${agent.banned ? " admin-action-unban" : " admin-action-ban"}`}
                onClick={onDeactivateToggle}
              >
                {agent.banned ? "Reactivate" : "Deactivate"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminAgentsPage() {
  const { session, loading: authLoading } = useRequireRole("admin");
  const [agents, setAgents] = useState<ApiUser[]>([]);
  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [openId, setOpenId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    if (!session) return;
    adminListUsers({ role: "agent", limit: 100 })
      .then(({ users }) => setAgents(users))
      .catch(() => setError("Could not load agents."))
      .finally(() => setLoading(false));
  }, [session]);

  async function handleDeactivate(agent: ApiUser) {
    const updated = await adminUpdateUser(agent.id, { banned: !agent.banned });
    setAgents((prev) => prev.map((a) => (a.id === agent.id ? updated : a)));
  }

  async function handleAddAgent(e: { preventDefault(): void }) {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);
    try {
      const data = await apiRequest<{ user: ApiUser }>("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: formName.trim(),
          email: formEmail.trim(),
          password: formPassword,
          role: "agent"
        })
      });
      setAgents((prev) => [data.user, ...prev]);
      setFormName("");
      setFormEmail("");
      setFormPassword("");
      setShowForm(false);
    } catch (err) {
      setFormError((err as AppError).message ?? "Could not create agent.");
    } finally {
      setFormLoading(false);
    }
  }

  const filtered = agents.filter(
    (a) =>
      !search ||
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase())
  );

  const shown = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;

  if (authLoading || loading) return <div className="loading-screen"><Spinner size="lg" /></div>;
  if (error) return <div className="error-banner">{error}</div>;

  return (
    <div className="admin-table-wrap">
      <div className="admin-table-toolbar">
        <div className="admin-search-wrap">
          <SearchIcon />
          <input
            className="admin-search-input"
            type="search"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setVisible(PAGE_SIZE);
            }}
          />
        </div>
        <span className="admin-table-count">{filtered.length} agents</span>
        <Button onClick={() => setShowForm((v) => !v)}>
          {showForm ? "Cancel" : "Add agent"}
        </Button>
      </div>

      {showForm && (
        <div className="admin-agent-form-card">
          <h3 className="admin-agent-form-title">New agent account</h3>
          <form onSubmit={(e) => void handleAddAgent(e)} className="admin-agent-form">
            {formError && <div className="error-banner">{formError}</div>}
            <Input id="agent-name" label="Full name" value={formName} onChange={(e) => setFormName(e.target.value)} required minLength={2} />
            <Input id="agent-email" label="Email" type="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} required />
            <Input id="agent-password" label="Password" type="password" value={formPassword} onChange={(e) => setFormPassword(e.target.value)} required minLength={8} autoComplete="new-password" />
            <Button type="submit" loading={formLoading}>Create agent</Button>
          </form>
        </div>
      )}

      <div className="admin-table-card">
        <div className="admin-desktop-only">
          <table className="data-table">
            <thead>
              <tr>
                <th>Agent</th>
                <th>Email</th>
                <th>Status</th>
                <th>Joined</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {shown.map((a) => (
                <tr key={a.id} className={a.banned ? "admin-row-banned" : ""}>
                  <td>
                    <div className="admin-user-cell">
                      <Avatar name={a.name} src={a.avatarUrl} size="sm" />
                      <span className="admin-user-name">{a.name}</span>
                    </div>
                  </td>
                  <td className="admin-muted">{a.email}</td>
                  <td>
                    {a.banned
                      ? <span className="admin-badge-banned">Deactivated</span>
                      : <span className="admin-badge-active">Active</span>
                    }
                  </td>
                  <td className="admin-muted">{formatDate(a.createdAt)}</td>
                  <td>
                    <button
                      className={`admin-action-btn${a.banned ? " admin-action-unban" : " admin-action-ban"}`}
                      onClick={() => void handleDeactivate(a)}
                    >
                      {a.banned ? "Reactivate" : "Deactivate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="empty-state">No agents yet. Add one above.</div>}
        </div>

        <div className="orders-accordion admin-mobile-only">
          {filtered.length === 0 && (
            <div className="orders-accordion-empty">No agents yet. Add one above.</div>
          )}
          {shown.map((a) => (
            <AgentAccordionItem
              key={a.id}
              agent={a}
              open={openId === a.id}
              onToggle={() => setOpenId((prev) => (prev === a.id ? null : a.id))}
              onDeactivateToggle={() => void handleDeactivate(a)}
            />
          ))}
        </div>
      </div>

      {hasMore && (
        <div className="orders-load-more">
          <button
            className="orders-load-more-btn"
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
          >
            Load more
            <span className="orders-load-more-count">{filtered.length - visible} remaining</span>
          </button>
        </div>
      )}
    </div>
  );
}
