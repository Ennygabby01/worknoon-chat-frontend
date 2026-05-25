"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { requestEmailVerification } from "@/lib/api/auth";
import { OtpInput } from "@/components/ui/OtpInput";
import { Button } from "@/components/ui/Button";
import { BrandPanel } from "@/features/auth/BrandPanel";
import { useSession } from "@/lib/session/session-context";
import type { AppError } from "@/lib/api/app-error";

const verificationCooldownSeconds = 60;
const verificationRequestKeyPrefix = "worknoon:verification-requested:";
const verificationCooldownKeyPrefix = "worknoon:verification-cooldown-until:";

function getVerificationRequestKey(email: string) {
  return `${verificationRequestKeyPrefix}${email.trim().toLowerCase()}`;
}

function getVerificationCooldownKey(email: string) {
  return `${verificationCooldownKeyPrefix}${email.trim().toLowerCase()}`;
}

function getCooldownRemainingSeconds(email: string) {
  const cooldownUntil = Number(sessionStorage.getItem(getVerificationCooldownKey(email)) ?? 0);
  return Math.max(0, Math.ceil((cooldownUntil - Date.now()) / 1000));
}

function startVerificationCooldown(email: string) {
  sessionStorage.setItem(
    getVerificationCooldownKey(email),
    String(Date.now() + verificationCooldownSeconds * 1000)
  );
}

export default function VerifyPage() {
  const router = useRouter();
  const { confirmEmailVerification } = useSession();
  const params = useSearchParams();
  const email = params.get("email") ?? "";

  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const [error, setError] = useState("");

  const isFilled = digits.every((d) => d !== "");

  useEffect(() => {
    if (!email) return;
    const requestKey = getVerificationRequestKey(email);
    if (sessionStorage.getItem(requestKey)) {
      queueMicrotask(() => setRequesting(false));
      return;
    }

    queueMicrotask(() => setRequesting(true));
    sessionStorage.setItem(requestKey, "1");
    startVerificationCooldown(email);
    queueMicrotask(() => setCooldownRemaining(getCooldownRemainingSeconds(email)));
    requestEmailVerification(email)
      .catch(() => {
        sessionStorage.removeItem(requestKey);
        sessionStorage.removeItem(getVerificationCooldownKey(email));
        setCooldownRemaining(0);
        setError("We could not prepare a verification code.");
      })
      .finally(() => setRequesting(false));
  }, [email]);

  useEffect(() => {
    if (!email) return;

    const syncCooldown = () => {
      setCooldownRemaining(getCooldownRemainingSeconds(email));
    };

    queueMicrotask(syncCooldown);
    const intervalId = window.setInterval(syncCooldown, 1000);
    return () => window.clearInterval(intervalId);
  }, [email]);

  async function handleVerify(event?: { preventDefault(): void }) {
    event?.preventDefault();
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
    if (!email || cooldownRemaining > 0) return;
    setDigits(Array(6).fill(""));
    setError("");
    setRequesting(true);
    startVerificationCooldown(email);
    setCooldownRemaining(verificationCooldownSeconds);
    try {
      await requestEmailVerification(email);
      sessionStorage.setItem(getVerificationRequestKey(email), "1");
    } catch {
      sessionStorage.removeItem(getVerificationCooldownKey(email));
      setCooldownRemaining(0);
      setError("We could not resend the verification code.");
    } finally {
      setRequesting(false);
    }
  }

  return (
    <div className="auth-split">
      <BrandPanel quote="Almost there. Check your inbox." />

      <div className="auth-form-panel">
        <div className="auth-mobile-brand">
          <div className="brand-logo-mark"><BubbleIcon /></div>
          <span style={{ fontWeight: 700, fontSize: "1rem", letterSpacing: "-0.02em" }}>Worknoon</span>
        </div>

        <div className="auth-form-inner">
          <div className="auth-icon-circle">
            <MailIcon />
          </div>

          <h1 className="auth-form-heading">Check your email</h1>
          <p className="auth-form-sub">
            Enter the 6-digit code sent to <strong style={{ color: "var(--color-text)" }}>{email || "your account"}</strong>.
          </p>

          {error && <div className="error-banner" style={{ marginBottom: 4 }}>{error}</div>}

          <form onSubmit={handleVerify} suppressHydrationWarning style={{ margin: 0 }}>
            <OtpInput value={digits} onChange={setDigits} />

            <Button full type="submit" loading={loading} disabled={!isFilled || requesting || !email}>
              Verify
            </Button>
          </form>

          <div className="resend-row">
            Didn&apos;t receive it?{" "}
            <button
              className="resend-btn"
              onClick={() => void handleResend()}
              disabled={requesting || cooldownRemaining > 0 || !email}
            >
              {cooldownRemaining > 0 ? `Resend code in ${cooldownRemaining}s` : "Resend code"}
            </button>
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
