"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { confirmEmailVerification, requestEmailVerification } from "@/lib/api/auth";
import { OtpInput } from "@/components/ui/OtpInput";
import { Button } from "@/components/ui/Button";
import type { AppError } from "@/lib/api/app-error";

export default function VerifyPage() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email") ?? "";

  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [requesting, setRequesting] = useState(Boolean(email));
  const [error, setError] = useState("");

  const isFilled = digits.every((d) => d !== "");

  useEffect(() => {
    if (!email) return;
    requestEmailVerification(email)
      .catch(() => setError("We could not prepare a verification code."))
      .finally(() => setRequesting(false));
  }, [email]);

  async function handleVerify() {
    if (!isFilled || !email) return;
    setError("");
    setLoading(true);
    try {
      await confirmEmailVerification({ email, code: digits.join("") });
      router.push("/verify/success");
    } catch (err) {
      setError((err as AppError).message ?? "We could not verify that code.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (!email) return;
    setDigits(Array(6).fill(""));
    setError("");
    setRequesting(true);
    try {
      await requestEmailVerification(email);
    } catch {
      setError("We could not resend the verification code.");
    } finally {
      setRequesting(false);
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
          <MailIcon />
        </div>

        <h1 className="verify-heading">Check your email</h1>
        <p className="verify-hint">Enter the 6-digit code for</p>
        <p className="verify-email-label">{email || "your account"}</p>

        {error && (
          <div className="error-banner" style={{ marginTop: 16, textAlign: "left" }}>
            {error}
          </div>
        )}

        <OtpInput value={digits} onChange={setDigits} />

        <Button full loading={loading} onClick={handleVerify} disabled={!isFilled || requesting || !email}>
          Verify
        </Button>

        <div className="resend-row">
          Didn&apos;t receive it?{" "}
          <button className="resend-btn" onClick={() => void handleResend()} disabled={requesting || !email}>
            Resend code
          </button>
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

function MailIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}
