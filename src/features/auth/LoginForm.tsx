"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/session/session-context";
import { FloatInput } from "@/components/ui/FloatInput";
import { Button } from "@/components/ui/Button";
import { BrandPanel } from "./BrandPanel";
import type { AppError } from "@/lib/api/app-error";

export function LoginForm() {
  const { login } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      router.replace("/inbox");
    } catch (err) {
      setError((err as AppError).message ?? "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-split">
      <BrandPanel />

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
          <h1 className="auth-form-heading">Welcome back</h1>
          <p className="auth-form-sub">Sign in to your workspace.</p>

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: 14 }}
          >
            {error && <div className="error-banner">{error}</div>}

            <FloatInput
              id="email"
              type="email"
              label="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <FloatInput
              id="password"
              label="Password"
              showToggle
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />

            <div style={{ textAlign: "right", marginTop: -4 }}>
              <Link
                href="/forgot-password"
                style={{
                  fontSize: "0.8rem",
                  color: "var(--color-accent)",
                  fontWeight: 500
                }}
              >
                Forgot password?
              </Link>
            </div>

            <Button type="submit" full loading={loading} style={{ marginTop: 2 }}>
              Sign in
            </Button>
          </form>

          <div className="auth-link-row">
            Don&apos;t have an account?{" "}
            <Link href="/register">Create one</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function BubbleIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
