"use client";

import { forwardRef, useState, type InputHTMLAttributes } from "react";

type FloatInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  showToggle?: boolean;
};

export const FloatInput = forwardRef<HTMLInputElement, FloatInputProps>(function FloatInput(
  { label, error, id, type = "text", showToggle, className = "", ...props },
  ref
) {
  const [visible, setVisible] = useState(false);
  const resolvedType = showToggle ? (visible ? "text" : "password") : type;

  return (
    <div className="float-field">
      <input
        ref={ref}
        id={id}
        suppressHydrationWarning
        type={resolvedType}
        placeholder=" "
        className={`float-input${error ? " has-error" : ""}${showToggle ? " has-toggle" : ""} ${className}`}
        {...props}
      />
      <label htmlFor={id} className="float-label">
        {label}
      </label>
      {showToggle && (
        <button
          type="button"
          className="float-toggle"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          tabIndex={-1}
        >
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      )}
      {error && <span className="float-error">{error}</span>}
    </div>
  );
});

function EyeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}
