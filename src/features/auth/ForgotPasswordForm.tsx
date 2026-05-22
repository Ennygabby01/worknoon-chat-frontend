"use client";

import { useState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/lib/api/auth";
import { FloatInput } from "@/components/ui/FloatInput";
import { Button } from "@/components/ui/Button";
import { BrandPanel } from "./BrandPanel";
import type { AppError } from "@/lib/api/app-error";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await requestPasswordReset(email.trim());
      setSent(true);
    } catch (err) {
      setError((err as AppError).message ?? "We could not request a reset link.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-split">
      <BrandPanel quote="Locked out? We will help you get back in." />

      <div className="auth-form-panel">
        <div className="auth-mobile-brand">
          <div className="brand-logo-mark">
            <BubbleIcon />
          </div>
          <span style={{ fontWeight: 700, fontSize: "1rem", letterSpacing: "-0.02em" }}>
            Worknoon
          </span>
        </div>

        <div className="auth-form-inner">
          <div className="auth-icon-circle">
            <LockIcon />
          </div>

          <h1 className="auth-form-heading">Reset your password</h1>
          <p className="auth-form-sub">
            Enter your email and we will prepare a secure reset link.
          </p>

          {error && <div className="error-banner" style={{ marginBottom: 14 }}>{error}</div>}

          {sent ? (
            <div className="success-banner">
              If an account exists for <strong>{email}</strong>, a reset link has been sent.
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: 14 }}
            >
              <FloatInput
                id="forgot-email"
                type="email"
                label="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
              <Button type="submit" full loading={loading} style={{ marginTop: 2 }}>
                Send reset link
              </Button>
            </form>
          )}

          <div className="auth-link-row">
            <Link href="/login" style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <BackIcon />
              Back to sign in
            </Link>
          </div>
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
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}
