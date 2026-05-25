"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPassword } from "@/lib/api/auth";
import { Button } from "@/components/ui/Button";
import { FloatInput } from "@/components/ui/FloatInput";
import { BrandPanel } from "./BrandPanel";
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
    <div className="auth-split">
      <BrandPanel quote="Secure your workspace." />

      <div className="auth-form-panel">
        <div className="auth-mobile-brand">
          <div className="brand-logo-mark"><BubbleIcon /></div>
          <span style={{ fontWeight: 700, fontSize: "1rem", letterSpacing: "-0.02em" }}>Worknoon</span>
        </div>

        <div className="auth-form-inner">
          <div className="auth-icon-circle">
            <LockIcon />
          </div>

          <h1 className="auth-form-heading">Choose a new password</h1>
          <p className="auth-form-sub">Use at least 8 characters.</p>

          <form
            onSubmit={handleSubmit}
            suppressHydrationWarning
            style={{ display: "flex", flexDirection: "column", gap: 14 }}
          >
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
    </div>
  );
}

function BubbleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 2H7C4.24 2 2 4.23 2 6.98V12.96V13.96C2 16.71 4.24 18.94 7 18.94H8.5C8.77 18.94 9.13 19.12 9.3 19.34L10.8 21.33C11.46 22.21 12.54 22.21 13.2 21.33L14.7 19.34C14.89 19.09 15.19 18.94 15.5 18.94H17C19.76 18.94 22 16.71 22 13.96V6.98C22 4.23 19.76 2 17 2ZM13 13.75H7C6.59 13.75 6.25 13.41 6.25 13C6.25 12.59 6.59 12.25 7 12.25H13C13.41 12.25 13.75 12.59 13.75 13C13.75 13.41 13.41 13.75 13 13.75ZM17 8.75H7C6.59 8.75 6.25 8.41 6.25 8C6.25 7.59 6.59 7.25 7 7.25H17C17.41 7.25 17.75 7.59 17.75 8C17.75 8.41 17.41 8.75 17 8.75Z" fill="currentColor" />
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
