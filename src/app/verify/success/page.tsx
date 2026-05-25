"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { BrandPanel } from "@/features/auth/BrandPanel";

export default function VerifySuccessPage() {
  return (
    <div className="auth-split">
      <BrandPanel quote="You're in. Welcome to Worknoon." />

      <div className="auth-form-panel">
        <div className="auth-mobile-brand">
          <div className="brand-logo-mark"><BubbleIcon /></div>
          <span style={{ fontWeight: 700, fontSize: "1rem", letterSpacing: "-0.02em" }}>Worknoon</span>
        </div>

        <div className="auth-form-inner">
          <div className="auth-icon-circle" style={{ background: "var(--color-accent-subtle)", border: "2px solid var(--color-accent)" }}>
            <CheckIcon />
          </div>

          <h1 className="auth-form-heading">Email verified</h1>
          <p className="auth-form-sub">
            Your account is all set up. You can now access your workspace.
          </p>

          <Link href="/inbox">
            <Button full>Continue to inbox</Button>
          </Link>
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

function CheckIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
