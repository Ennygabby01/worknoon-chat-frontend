"use client";

import { useState, type FormEvent } from "react";
import { updateProfile } from "@/lib/api/users";
import { useSession } from "@/lib/session/session-context";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { AppError } from "@/lib/api/app-error";

export function ProfileForm() {
  const { session } = useSession();
  const user = session!.user;

  const [name, setName] = useState(user.name);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl ?? "");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);
    try {
      await updateProfile({
        name: name.trim() || undefined,
        avatarUrl: avatarUrl.trim() || null
      });
      setSuccess(true);
    } catch (err) {
      setError((err as AppError).message ?? "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card" style={{ maxWidth: 480 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
        <Avatar name={user.name} src={user.avatarUrl} size="lg" />
        <div>
          <div style={{ fontWeight: 700, fontSize: "1rem" }}>{user.name}</div>
          <div style={{ marginTop: 4 }}>
            <Badge label={user.role} variant="accent" />
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--color-muted)", marginTop: 4 }}>
            {user.email}
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 14 }}
      >
        {error && <div className="error-banner">{error}</div>}
        {success && (
          <div
            style={{
              padding: "10px 13px",
              background: "var(--color-accent-subtle)",
              border: "1px solid var(--color-accent)",
              borderRadius: "var(--radius-sm)",
              fontSize: "0.84rem",
              color: "var(--color-accent-strong)"
            }}
          >
            Profile updated.
          </div>
        )}

        <Input
          id="profile-name"
          type="text"
          label="Display name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          minLength={2}
        />

        <Input
          id="profile-avatar"
          type="url"
          label="Avatar URL (optional)"
          placeholder="https://..."
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
        />

        <Button type="submit" loading={loading}>
          Save changes
        </Button>
      </form>
    </div>
  );
}
