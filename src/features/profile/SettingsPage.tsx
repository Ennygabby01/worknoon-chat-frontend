"use client";

import { useState, useRef } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useSession } from "@/lib/session/session-context";
import { updateProfile, changePassword } from "@/lib/api/users";
import type { AppError } from "@/lib/api/app-error";

type Section = "profile" | "account" | "preferences" | "password";

const NAV: { value: Section; label: string }[] = [
  { value: "profile",     label: "Edit Profile" },
  { value: "account",     label: "Account" },
  { value: "preferences", label: "Preferences" },
  { value: "password",    label: "Change Password" },
];

function SuccessBanner({ message }: { message: string }) {
  return <div className="settings-success">{message}</div>;
}

function toDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function AvatarUploader({
  name,
  previewSrc,
  onFileChange,
}: {
  name: string;
  previewSrc: string | null;
  onFileChange: (file: File) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: { target: HTMLInputElement }) {
    const file = e.target.files?.[0];
    if (file) onFileChange(file);
  }

  return (
    <div className="avatar-uploader">
      <Avatar name={name} src={previewSrc} size="xl" />
      <button
        type="button"
        className="avatar-upload-btn"
        onClick={() => inputRef.current?.click()}
        aria-label="Change avatar"
      >
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.5 2.5H5.5L4 4.5H2a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7a1 1 0 0 0-1-1h-2L10.5 2.5z" />
          <circle cx="8" cy="9" r="2.5" />
        </svg>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleChange}
        tabIndex={-1}
      />
    </div>
  );
}

function EditProfileSection() {
  const { session } = useSession();
  const user = session!.user;

  const [name, setName] = useState(user.name);
  const [previewSrc, setPreviewSrc] = useState<string | null>(user.avatarUrl ?? null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function handleFileChange(file: File) {
    setPreviewSrc(URL.createObjectURL(file));
    setPendingFile(file);
  }

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);
    try {
      let avatarUrl = user.avatarUrl ?? null;
      if (pendingFile) {
        avatarUrl = await toDataUrl(pendingFile);
      }
      await updateProfile({ name: name.trim() || undefined, avatarUrl });
      setSuccess(true);
      setPendingFile(null);
    } catch (err) {
      setError((err as AppError).message ?? "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="settings-card">
      <h2 className="settings-card-title">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="settings-form">
        {error && <div className="error-banner">{error}</div>}
        {success && <SuccessBanner message="Profile updated." />}
        <AvatarUploader
          name={user.name}
          previewSrc={previewSrc}
          onFileChange={handleFileChange}
        />
        <Input
          id="settings-name"
          type="text"
          label="Display name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          minLength={2}
        />
        <div className="settings-form-footer">
          <Button type="submit" loading={loading}>Save changes</Button>
        </div>
      </form>
    </div>
  );
}

function AccountSection() {
  const { session } = useSession();
  const user = session!.user;

  const joined = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="settings-card">
      <h2 className="settings-card-title">Account</h2>
      <div className="settings-info-grid">
        <div className="settings-info-row">
          <span className="settings-info-label">Email address</span>
          <span className="settings-info-value">
            {user.email}
            {user.emailVerifiedAt && <span className="settings-verified-badge">Verified</span>}
          </span>
        </div>
        <div className="settings-info-row">
          <span className="settings-info-label">Account type</span>
          <span className="settings-info-value">
            <Badge label={user.role} />
          </span>
        </div>
        <div className="settings-info-row">
          <span className="settings-info-label">Member since</span>
          <span className="settings-info-value">{joined}</span>
        </div>
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
  id,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  id: string;
}) {
  return (
    <div className="settings-toggle-row">
      <div className="settings-toggle-info">
        <label className="settings-toggle-label" htmlFor={id}>{label}</label>
        <span className="settings-toggle-desc">{description}</span>
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        className={`settings-toggle${checked ? " is-on" : ""}`}
        onClick={() => onChange(!checked)}
      >
        <span className="settings-toggle-thumb" />
      </button>
    </div>
  );
}

function PreferencesSection() {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [messageAlerts, setMessageAlerts] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);

  return (
    <div className="settings-card">
      <h2 className="settings-card-title">Preferences</h2>
      <div className="settings-toggles">
        <ToggleRow
          id="pref-email"
          label="Email notifications"
          description="Receive email summaries of new messages"
          checked={emailNotifs}
          onChange={setEmailNotifs}
        />
        <ToggleRow
          id="pref-message"
          label="Message alerts"
          description="In-app notifications for new messages"
          checked={messageAlerts}
          onChange={setMessageAlerts}
        />
        <ToggleRow
          id="pref-orders"
          label="Order updates"
          description="Status changes for your orders"
          checked={orderUpdates}
          onChange={setOrderUpdates}
        />
      </div>
    </div>
  );
}

function ChangePasswordSection() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    if (next !== confirm) {
      setError("New passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await changePassword({ currentPassword: current, newPassword: next });
      setSuccess(true);
      setCurrent("");
      setNext("");
      setConfirm("");
    } catch (err) {
      setError((err as AppError).message ?? "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="settings-card">
      <h2 className="settings-card-title">Change Password</h2>
      <form onSubmit={handleSubmit} className="settings-form">
        {error && <div className="error-banner">{error}</div>}
        {success && <SuccessBanner message="Password updated." />}
        <Input
          id="settings-current-pass"
          type="password"
          label="Current password"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          required
          autoComplete="current-password"
        />
        <Input
          id="settings-new-pass"
          type="password"
          label="New password"
          value={next}
          onChange={(e) => setNext(e.target.value)}
          required
          minLength={8}
          autoComplete="new-password"
        />
        <Input
          id="settings-confirm-pass"
          type="password"
          label="Confirm new password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          minLength={8}
          autoComplete="new-password"
        />
        <div className="settings-form-footer">
          <Button type="submit" loading={loading}>Update password</Button>
        </div>
      </form>
    </div>
  );
}

export function SettingsPage() {
  const [active, setActive] = useState<Section>("profile");

  return (
    <div className="settings-layout">
      <nav className="settings-nav" aria-label="Settings sections">
        {NAV.map((item) => (
          <button
            key={item.value}
            type="button"
            className={`settings-nav-item${active === item.value ? " is-active" : ""}`}
            onClick={() => setActive(item.value)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="settings-content">
        {active === "profile"     && <EditProfileSection />}
        {active === "account"     && <AccountSection />}
        {active === "preferences" && <PreferencesSection />}
        {active === "password"    && <ChangePasswordSection />}
      </div>
    </div>
  );
}
