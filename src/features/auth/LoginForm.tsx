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
      const appError = err as AppError;
      if (appError.code === "EMAIL_NOT_VERIFIED") {
        router.replace(`/verify?email=${encodeURIComponent(email.trim())}`);
        return;
      }

      setError(appError.message ?? "Something went wrong. Please try again.");
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
            suppressHydrationWarning
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
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 2H7C4.24 2 2 4.23 2 6.98V12.96V13.96C2 16.71 4.24 18.94 7 18.94H8.5C8.77 18.94 9.13 19.12 9.3 19.34L10.8 21.33C11.46 22.21 12.54 22.21 13.2 21.33L14.7 19.34C14.89 19.09 15.19 18.94 15.5 18.94H17C19.76 18.94 22 16.71 22 13.96V6.98C22 4.23 19.76 2 17 2ZM13 13.75H7C6.59 13.75 6.25 13.41 6.25 13C6.25 12.59 6.59 12.25 7 12.25H13C13.41 12.25 13.75 12.59 13.75 13C13.75 13.41 13.41 13.75 13 13.75ZM17 8.75H7C6.59 8.75 6.25 8.41 6.25 8C6.25 7.59 6.59 7.25 7 7.25H17C17.41 7.25 17.75 7.59 17.75 8C17.75 8.41 17.41 8.75 17 8.75Z" fill="currentColor" />
    </svg>
  );
}
