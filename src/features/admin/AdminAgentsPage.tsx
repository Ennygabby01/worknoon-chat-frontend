"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { useRequireRole } from "@/lib/hooks/useRequireRole";
import { adminListUsers, adminUpdateUser } from "@/lib/api/admin";
import { apiRequest } from "@/lib/api/client";
import type { ApiUser } from "@/types/api";
import type { AppError } from "@/lib/api/app-error";

export function AdminAgentsPage() {
  const { session, loading: authLoading } = useRequireRole("admin");
  const [agents, setAgents] = useState<ApiUser[]>([]);
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

  if (authLoading || loading) return <div className="loading-screen"><Spinner size="lg" /></div>;
  if (error) return <div className="error-banner">{error}</div>;

  return (
    <div className="admin-table-wrap">
      <div className="admin-table-toolbar">
        <span className="admin-table-count">{agents.length} agents</span>
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
            {agents.map((a) => (
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
                <td className="admin-muted">{new Date(a.createdAt).toLocaleDateString()}</td>
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
        {agents.length === 0 && <div className="empty-state">No agents yet. Add one above.</div>}
      </div>
    </div>
  );
}
