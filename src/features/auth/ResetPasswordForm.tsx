"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPassword } from "@/lib/api/auth";
import { Button } from "@/components/ui/Button";
import { FloatInput } from "@/components/ui/FloatInput";
import type { AppError } from "@/lib/api/app-error";

export function ResetPasswordForm() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: { preventDefault(): void }) {
    event.preventDefault();
    setError("");

    if (!token) {
      setError("This reset link is invalid.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await resetPassword({ token, password });
      router.replace("/login");
    } catch (err) {
      setError((err as AppError).message ?? "We could not reset your password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="verify-shell">
      <div className="auth-mobile-brand">
        <div className="brand-logo-mark"><BubbleIcon /></div>
        <span style={{ fontWeight: 700, fontSize: "1rem", letterSpacing: "-0.02em" }}>Worknoon</span>
      </div>
      <div className="verify-card">
        <div className="verify-icon">
          <LockIcon />
        </div>
        <h1 className="verify-heading">Choose a new password</h1>
        <p className="verify-hint" style={{ marginBottom: 22 }}>
          Use at least 8 characters.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14, textAlign: "left" }}>
          {error && <div className="error-banner">{error}</div>}
          <FloatInput
            id="reset-password"
            label="New password"
            showToggle
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
          />
          <FloatInput
            id="reset-confirm"
            label="Confirm password"
            showToggle
            value={confirm}
            onChange={(event) => setConfirm(event.target.value)}
            autoComplete="new-password"
          />
          <Button type="submit" full loading={loading}>
            Reset password
          </Button>
        </form>

        <div className="auth-link-row">
          <Link href="/login">Back to sign in</Link>
        </div>
      </div>
    </div>
  );
}

function BubbleIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
