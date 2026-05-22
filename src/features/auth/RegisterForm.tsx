"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/session/session-context";
import { FloatInput } from "@/components/ui/FloatInput";
import { Button } from "@/components/ui/Button";
import { BrandPanel } from "./BrandPanel";
import type { AppError } from "@/lib/api/app-error";
import type { PublicRegistrationRole } from "@/types/api";

type Step = 1 | 2 | 3;

type FormData = {
  role: PublicRegistrationRole;
  name: string;
  email: string;
  password: string;
};

type StepErrors = Partial<Record<keyof FormData | "confirm" | "submit", string>>;

const roleOptions: {
  value: PublicRegistrationRole;
  label: string;
  icon: () => React.ReactElement;
}[] = [
  { value: "customer", label: "Buyer", icon: CartIcon },
  { value: "designer", label: "Designer", icon: PaletteIcon },
  { value: "merchant", label: "Merchant", icon: TagIcon }
];

const stepQuotes: Record<Step, string> = {
  1: "Built for commerce conversations.",
  2: "Create your Worknoon workspace profile.",
  3: "Secure your workspace."
};

const stepLabels: Record<Step, string> = {
  1: "Who are you?",
  2: "Your details",
  3: "Set your password"
};

export function RegisterForm() {
  const { register } = useSession();
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormData>({
    role: "customer",
    name: "",
    email: "",
    password: ""
  });
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<StepErrors>({});
  const [loading, setLoading] = useState(false);

  function setField<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  }

  function validate(s: Step): boolean {
    const next: StepErrors = {};
    if (s === 2) {
      if (!form.name.trim() || form.name.trim().length < 2)
        next.name = "Name must be at least 2 characters.";
      if (!form.email.trim()) next.email = "Email address is required.";
    }
    if (s === 3) {
      if (form.password.length < 8)
        next.password = "Password must be at least 8 characters.";
      if (form.password !== confirm) next.confirm = "Passwords do not match.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function next() {
    if (validate(step)) setStep((s) => Math.min(3, s + 1) as Step);
  }

  function back() {
    setStep((s) => Math.max(1, s - 1) as Step);
  }

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    if (!validate(3)) return;
    setLoading(true);
    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role
      });
      router.replace(`/verify?email=${encodeURIComponent(form.email.trim())}`);
    } catch (err) {
      setErrors({ submit: (err as AppError).message ?? "Something went wrong." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-split">
      <BrandPanel quote={stepQuotes[step]} />

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
          <h1 className="auth-form-heading">Create an account</h1>
          <p className="auth-form-sub">{stepLabels[step]}</p>

          <div className="step-indicator">
            {([1, 2, 3] as Step[]).map((s) => (
              <span
                key={s}
                className={`step-dot${s === step ? " active" : s < step ? " done" : ""}`}
              />
            ))}
            <span className="step-label">Step {step} of 3</span>
          </div>

          <div className="step-content" key={step}>
            {step === 1 && (
              <Step1
                selected={form.role}
                onSelect={(r) => setField("role", r)}
                onNext={next}
              />
            )}
            {step === 2 && (
              <Step2
                name={form.name}
                email={form.email}
                errors={errors}
                onNameChange={(v) => setField("name", v)}
                onEmailChange={(v) => setField("email", v)}
                onBack={back}
                onNext={next}
              />
            )}
            {step === 3 && (
              <Step3
                password={form.password}
                confirm={confirm}
                errors={errors}
                loading={loading}
                onPasswordChange={(v) => setField("password", v)}
                onConfirmChange={setConfirm}
                onBack={back}
                onSubmit={handleSubmit}
              />
            )}
          </div>

          <div className="auth-link-row">
            Already have an account? <Link href="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Step1({
  selected,
  onSelect,
  onNext
}: {
  selected: PublicRegistrationRole;
  onSelect: (r: PublicRegistrationRole) => void;
  onNext: () => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="role-grid">
        {roleOptions.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            type="button"
            className={`role-card${selected === value ? " selected" : ""}`}
            onClick={() => onSelect(value)}
          >
            <span className="role-card-icon">
              <Icon />
            </span>
            <span className="role-card-label">{label}</span>
          </button>
        ))}
      </div>
      <Button type="button" full onClick={onNext}>
        Continue
      </Button>
    </div>
  );
}

function Step2({
  name,
  email,
  errors,
  onNameChange,
  onEmailChange,
  onBack,
  onNext
}: {
  name: string;
  email: string;
  errors: StepErrors;
  onNameChange: (v: string) => void;
  onEmailChange: (v: string) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <FloatInput
        id="reg-name"
        type="text"
        label="Full name"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        error={errors.name}
        autoComplete="name"
        minLength={2}
      />
      <FloatInput
        id="reg-email"
        type="email"
        label="Email address"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
        error={errors.email}
        autoComplete="email"
      />
      <div className="step-nav">
        <Button type="button" variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button type="button" onClick={onNext}>
          Continue
        </Button>
      </div>
    </div>
  );
}

function Step3({
  password,
  confirm,
  errors,
  loading,
  onPasswordChange,
  onConfirmChange,
  onBack,
  onSubmit
}: {
  password: string;
  confirm: string;
  errors: StepErrors;
  loading: boolean;
  onPasswordChange: (v: string) => void;
  onConfirmChange: (v: string) => void;
  onBack: () => void;
  onSubmit: (e: { preventDefault(): void }) => void;
}) {
  return (
    <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {errors.submit && <div className="error-banner">{errors.submit}</div>}
      <FloatInput
        id="reg-password"
        label="Password"
        showToggle
        value={password}
        onChange={(e) => onPasswordChange(e.target.value)}
        error={errors.password}
        autoComplete="new-password"
        minLength={8}
      />
      <FloatInput
        id="reg-confirm"
        label="Confirm password"
        showToggle
        value={confirm}
        onChange={(e) => onConfirmChange(e.target.value)}
        error={errors.confirm}
        autoComplete="new-password"
      />
      <div className="step-nav">
        <Button type="button" variant="secondary" onClick={onBack} disabled={loading}>
          Back
        </Button>
        <Button type="submit" loading={loading}>
          Create account
        </Button>
      </div>
    </form>
  );
}

/* ---- role icons ---- */
function BubbleIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

function PaletteIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="13.5" cy="6.5" r="0.5" fill="currentColor" />
      <circle cx="17.5" cy="10.5" r="0.5" fill="currentColor" />
      <circle cx="8.5" cy="7.5" r="0.5" fill="currentColor" />
      <circle cx="6.5" cy="12.5" r="0.5" fill="currentColor" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  );
}
